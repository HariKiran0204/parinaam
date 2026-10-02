import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, serverError } from '@/lib/apiResponse';
import { isValidStudentName } from '@/lib/utils';

// PATCH /api/auth/profile — update logged-in user's profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const body = await req.json();

    if ('full_name' in body && body.full_name !== undefined) {
      const nameCheck = isValidStudentName(body.full_name);
      if (!nameCheck.valid) {
        return error(nameCheck.error || 'Student name is invalid');
      }
    }

    const ALLOWED = ['full_name','phone','college_name','department','year_of_study','city','roll_number'];

    const updates: string[] = [];
    const values: unknown[]  = [];
    let idx = 1;

    for (const key of ALLOWED) {
      if (key in body) {
        updates.push(`${key} = $${idx}`);
        values.push(body[key]);
        idx++;
      }
    }

    if (updates.length === 0) return error('No valid fields to update');

    values.push(session.userId);
    await db.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx}`,
      values
    );

    return success({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    return serverError();
  }
}
