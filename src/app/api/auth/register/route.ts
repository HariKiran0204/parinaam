import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';
import { success, error, serverError } from '@/lib/apiResponse';

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

    if (password.length < 8) {
      return error('Password must be at least 8 characters');
    }

    const emailLower = email.toLowerCase().trim();

    // Check if Amrita student based on selection or email domain
    const isAmritaDomain = emailLower.endsWith(`@${AMRITA_DOMAIN}`) || emailLower.endsWith('.amrita.edu') || emailLower.endsWith('@amrita.edu');
    
    if (student_type === 'amrita' && !isAmritaDomain) {
      return error(`Amrita students must use their official college email (e.g., yourname@${AMRITA_DOMAIN})`);
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
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [emailLower]);
    if (existing.rows.length > 0) {
      return error('An account with this email already exists', 409);
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

    // Generate QR token (opaque UUID hash)
    const qrToken = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '').slice(0, 8);

    // Both Amrita and external students start with pending verification for Super Admin review
    const verificationStatus = 'pending';
    const emailVerifyToken = uuidv4();

    // Insert user (platform_fee_paid starts as false until Super Admin approves)
    const result = await db.query(
      `INSERT INTO users (
        email, password_hash, full_name, phone,
        college_name, is_amrita_student, roll_number, department,
        year_of_study, city, verification_status, qr_token,
        email_verify_token, email_verified, platform_fee_paid, id_card_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING id, email, full_name, role, is_amrita_student, verification_status, qr_token, platform_fee_paid, id_card_url`,
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
        verificationStatus,
        qrToken,
        emailVerifyToken,
        true, // email_verified
        false, // platform_fee_paid starts as false until Superadmin approves
        id_card_url || null,
      ]
    );

    const user = result.rows[0];

    // Sign JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'student' | 'club_admin' | 'super_admin',
    });

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
      },
      is_amrita_student: isAmritaStudent,
      verification_status: verificationStatus,
      needs_id_upload: !isAmritaStudent,
    }, 201);

    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error('Registration error:', err);
    return serverError('Registration failed. Please try again.');
  }
}
