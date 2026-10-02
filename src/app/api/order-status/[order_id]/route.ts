export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayOrderPayments, RazorpayError } from '@/lib/razorpay';

/**
 * GET /api/order-status/:order_id
 * Fallback route: Queries the Razorpay API for payments associated with an order.
 * Useful when client connectivity dropped or browser closed before checkout handler completed.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id } = await params;

    if (!order_id || !order_id.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid order_id parameter.' },
        { status: 400 }
      );
    }

    const payments = await getRazorpayOrderPayments(order_id);

    return NextResponse.json({
      success: true,
      order_id,
      count: payments.count,
      items: payments.items,
    });
  } catch (err: any) {
    if (err instanceof RazorpayError) {
      return NextResponse.json(
        { success: false, error: err.message, code: err.code },
        { status: err.statusCode }
      );
    }

    console.error('[GET /api/order-status] Error:', err?.message || err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order payment status.' },
      { status: 500 }
    );
  }
}
