export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyRazorpaySignature, RazorpayError } from '@/lib/razorpay';

interface VerifyRequestBody {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  payment_db_id?: string;
  type?: string;
}

/**
 * POST /api/verify-payment
 * Verifies Razorpay payment signature server-side using constant-time comparison,
 * marks internal order as paid, and handles retries idempotently.
 */
export async function POST(req: NextRequest) {
  try {
    let body: VerifyRequestBody = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, payment_db_id } = body;

    // Rule: Mismatch or missing fields -> 400; never mark the order paid on failure.
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required payment verification fields (razorpay_payment_id, razorpay_order_id, razorpay_signature).',
        },
        { status: 400 }
      );
    }

    // Step 1: Validate signature BEFORE any DB state change or short-circuit
    // (Crucial: never return success for an unverified request, even if already marked paid)
    let isValidSignature = false;
    try {
      isValidSignature = verifyRazorpaySignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
    } catch (cfgErr: any) {
      if (cfgErr instanceof RazorpayError) {
        return NextResponse.json(
          { success: false, error: cfgErr.message },
          { status: cfgErr.statusCode }
        );
      }
      throw cfgErr;
    }

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Invalid signature.' },
        { status: 400 }
      );
    }

    // Step 2: Idempotent DB update under transaction
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // Look up internal payment record by razorpay_order_id or internal ID
      const paymentRes = await client.query(
        `SELECT id, user_id, type, amount, status, razorpay_order_id
         FROM payments
         WHERE razorpay_order_id = $1 OR id = $2
         FOR UPDATE`,
        [razorpay_order_id, payment_db_id || null]
      );

      if (paymentRes.rows.length > 0) {
        const paymentRecord = paymentRes.rows[0];

        // Idempotency check: if already marked paid, return success without re-processing
        if (paymentRecord.status === 'paid') {
          await client.query('ROLLBACK');
          client.release();
          return NextResponse.json({
            success: true,
            message: 'Payment already verified.',
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            status: 'paid',
            already_verified: true,
          });
        }

        // Mark payment record as paid
        await client.query(
          `UPDATE payments
           SET status = 'paid',
               razorpay_payment_id = $1,
               razorpay_signature = $2,
               updated_at = NOW()
           WHERE id = $3`,
          [razorpay_payment_id, razorpay_signature, paymentRecord.id]
        );

        // Update corresponding application records based on payment type
        if (paymentRecord.type === 'platform_fee' && paymentRecord.user_id) {
          await client.query(
            `UPDATE users
             SET platform_fee_paid = TRUE,
                 verification_status = 'verified',
                 pass_type = 'DELEGATE_PASS_1000',
                 platform_payment_id = $1,
                 platform_fee_paid_at = NOW()
             WHERE id = $2`,
            [razorpay_payment_id, paymentRecord.user_id]
          );
        } else if (paymentRecord.type === 'event_fee') {
          // Confirm linked registrations
          const regsRes = await client.query(
            `SELECT id, event_id, status FROM registrations WHERE payment_id = $1`,
            [paymentRecord.id]
          );

          for (const reg of regsRes.rows) {
            if (reg.status !== 'CONFIRMED') {
              await client.query(
                `UPDATE registrations
                 SET status = 'CONFIRMED',
                     payment_status = 'paid',
                     payment_id = $1,
                     payment_order_id = $2,
                     confirmed_at = NOW()
                 WHERE id = $3`,
                [razorpay_payment_id, razorpay_order_id, reg.id]
              );

              await client.query(
                `UPDATE events SET enrolled = enrolled + 1 WHERE id = $1`,
                [reg.event_id]
              );
            }
          }
        }

        await client.query('COMMIT');
        client.release();
      } else {
        // No existing DB payment record (e.g. standalone test order)
        // Insert a new confirmed payment record for audit and tracking
        await client.query(
          `INSERT INTO payments (type, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, status)
           VALUES ('standard_order', 0, $1, $2, $3, 'paid')
           ON CONFLICT DO NOTHING`,
          [razorpay_order_id, razorpay_payment_id, razorpay_signature]
        );
        await client.query('COMMIT');
        client.release();
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully and order marked as paid.',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        status: 'paid',
      });
    } catch (dbErr) {
      if (client) {
        try {
          await client.query('ROLLBACK');
        } catch {
          /* ignore */
        }
        client.release();
      }
      console.error('[POST /api/verify-payment] Database update error:', (dbErr as Error).message);
      return NextResponse.json(
        { success: false, error: 'Database error while marking order as paid.' },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('[POST /api/verify-payment] Unexpected verification error:', err?.message || err);
    return NextResponse.json(
      { success: false, error: 'Internal server error during payment verification.' },
      { status: 500 }
    );
  }
}
