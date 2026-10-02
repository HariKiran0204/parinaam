import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';
import { success, error, serverError } from '@/lib/apiResponse';
import { isInstitutionalEmail, STANDARD_PLATFORM_FEE_INR } from '@/lib/institutionPolicy';
import { isValidEmail, isValidStudentName } from '@/lib/utils';

const AMRITA_DOMAIN = 'av.students.amrita.edu';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_type,
      email,
      password,
      full_name,
      phone,
      college_name,
      roll_number,
      department,
      year_of_study,
      city,
      id_card_url,
    } = body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return error('Email, password and full name are required');
    }

    const emailLower = email.toLowerCase().trim();
    if (!isValidEmail(emailLower)) {
      return error('Please enter a valid email address');
    }

    const nameCheck = isValidStudentName(full_name);
    if (!nameCheck.valid) {
      return error(nameCheck.error || 'Student name is invalid');
    }

    if (password.length < 8) {
      return error('Password must be at least 8 characters');
    }

    // Check if Amrita student based on selection or recognized institutional email domain
    const isAmritaDomain = isInstitutionalEmail(emailLower);
    
    if (student_type === 'amrita' && !isAmritaDomain) {
      return error(`Amrita students must use their official college email (e.g., yourname@av.students.amrita.edu)`);
    }

    if (student_type === 'other') {
      if (!college_name?.trim()) return error('College / Institution name is required');
      if (!department?.trim()) return error('Branch / Department name is required');
      if (!city?.trim()) return error('City / Location is required');
    }

    if (student_type === 'amrita') {
      if (!roll_number?.trim()) return error('Amrita Roll Number is required');
      if (!department?.trim()) return error('Branch is required');
    }

    if (!year_of_study) {
      return error('Year of study is required');
    }

    const isAmritaStudent = student_type === 'amrita' || (student_type !== 'other' && isAmritaDomain);

    // Check if email already exists
    const existing = await db.query('SELECT id, email, platform_fee_paid, verification_status FROM users WHERE email = $1', [emailLower]);
    if (existing.rows.length > 0) {
      return error('An account with this email already exists. Please log in.', 409);
    }

    const cleanPhone = (phone || '').replace(/\D/g, '').slice(0, 10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return error('Phone number must be exactly 10 digits');
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return error('Phone number must start with 6, 7, 8, or 9 (excluding +91)');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate unique QR token
    const qrToken = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '').slice(0, 8);
    const emailVerifyToken = uuidv4();

    // Verification Status & Platform Fee Policy:
    // - Amrita students: Instantly verified, free pass (platform_fee_paid: true, pass_type: 'AMRITA_FREE')
    // - Outside students: 'pending' initially, instantly marked 'verified' upon successful ₹1000 payment
    const isInitiallyPaid = isAmritaStudent;
    const initialVerificationStatus = isAmritaStudent ? 'verified' : 'pending';
    const passType = isAmritaStudent ? 'AMRITA_FREE' : 'DELEGATE_PASS_1000';

    // Insert user into PostgreSQL
    const result = await db.query(
      `INSERT INTO users (
        email, password_hash, full_name, phone,
        college_name, is_amrita_student, roll_number, department,
        year_of_study, city, verification_status, qr_token,
        email_verify_token, email_verified, platform_fee_paid, id_card_url, pass_type
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING id, email, full_name, role, is_amrita_student, verification_status, qr_token, platform_fee_paid, id_card_url, pass_type`,
      [
        emailLower,
        passwordHash,
        full_name,
        cleanPhone,
        college_name || (isAmritaStudent ? 'Amrita Vishwa Vidyapeetham, Amaravati' : null),
        isAmritaStudent,
        roll_number || null,
        department || null,
        year_of_study || null,
        city || null,
        initialVerificationStatus,
        qrToken,
        emailVerifyToken,
        true, // email_verified
        isInitiallyPaid,
        id_card_url || null,
        passType,
      ]
    );

    const user = result.rows[0];

    // Sign JWT session
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'student' | 'club_admin' | 'super_admin',
    });

    // For Outside College Students: Create Razorpay Order for ₹1000 Fixed Festival Pass
    let razorpayOrder = null;
    if (!isAmritaStudent) {
      const amountPaise = STANDARD_PLATFORM_FEE_INR * 100; // 100000 paise (₹1000)
      const rzpKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_Tj1xekDdSGlLZx';
      const rzpSecret = process.env.RAZORPAY_KEY_SECRET || 'iG7V5PISj2ERvhLFGAD3Wass';

      let rzpOrderId: string;

      try {
        const authHeader = Buffer.from(`${rzpKeyId}:${rzpSecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountPaise,
            currency: 'INR',
            receipt: `pf_${Date.now().toString().slice(-8)}`,
            notes: {
              userId: user.id,
              userEmail: user.email,
              type: 'platform_fee',
              passName: 'Parinaam 2026 Delegate Pass (Includes 4 Flagship Events)',
            },
          }),
        });

        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          rzpOrderId = rzpData.id;
        } else {
          const errText = await rzpRes.text();
          console.warn('[Razorpay] Order API returned error status:', rzpRes.status, errText);
          rzpOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        }
      } catch (rzpErr) {
        console.error('[Razorpay] Network error, fallback order generated:', rzpErr);
        rzpOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      }

      // Record payment row in database
      const paymentInsert = await db.query(
        `INSERT INTO payments (user_id, type, amount, razorpay_order_id, status)
         VALUES ($1, 'platform_fee', $2, $3, 'created')
         RETURNING id`,
        [user.id, amountPaise, rzpOrderId]
      );

      razorpayOrder = {
        order_id: rzpOrderId,
        amount: amountPaise,
        currency: 'INR',
        key_id: rzpKeyId,
        payment_db_id: paymentInsert.rows[0]?.id,
        description: 'PARINAAM 2026 Festival Pass (₹1000 Fixed Entry)',
        included_events: [
          'Live Concert and DJ',
          'Garba Night',
          'Auto Expo',
          'Tholu Bommalata',
        ],
      };
    }

    const response = success({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_amrita_student: user.is_amrita_student,
        verification_status: user.verification_status,
        platform_fee_paid: user.platform_fee_paid,
        qr_token: user.qr_token,
        pass_type: user.pass_type,
      },
      is_amrita_student: isAmritaStudent,
      requires_payment: !isAmritaStudent,
      razorpay_order: razorpayOrder,
    }, 201);

    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error('Registration error:', err);
    return serverError();
  }
}
