import { NextRequest } from 'next/server';
import { getSessionUser, COOKIE_NAME } from '@/lib/auth';
import { db } from '@/lib/db';
import { success, unauthorized, serverError } from '@/lib/apiResponse';

// GET /api/auth/me — get current user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const result = await db.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.club_id,
              u.college_name, u.is_amrita_student, u.roll_number, u.department,
              u.year_of_study, u.city, u.id_card_url, u.verification_status,
              u.platform_fee_paid, u.qr_token, u.pass_type, u.avatar_url,
              u.email_verified, u.created_at,
              c.name as club_name, c.slug as club_slug
       FROM users u
       LEFT JOIN clubs c ON u.club_id = c.id
       WHERE u.id = $1`,
      [session.userId]
    );

    if (result.rows.length === 0) return unauthorized('User not found');

    const res = success({ user: result.rows[0] });
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (err) {
    console.error('Get me error:', err);
    return serverError();
  }
}

// POST /api/auth/logout
export async function POST() {
  const response = success({ message: 'Logged out successfully' });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
