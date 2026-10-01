import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// PATCH /api/admin/users/[id]/verify — approve or reject ID card
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    const { status, note } = await req.json();
    if (!['verified', 'rejected'].includes(status)) {
      return error('Status must be verified or rejected');
    }

    if (status === 'rejected') {
      // Purge/delete rejected unverified student record so they are completely removed
      await db.query(`DELETE FROM attendance WHERE user_id = $1 OR scanned_by = $1`, [id]);
      await db.query(`DELETE FROM registrations WHERE user_id = $1`, [id]);
      await db.query(`DELETE FROM payments WHERE user_id = $1`, [id]);
      await db.query(`DELETE FROM users WHERE id = $1`, [id]);
      return success({ message: 'User rejected and record removed successfully', deleted: true });
    }

    // Approved / Verified: Activate status, platform_fee_paid, and ensure QR token is set
    await db.query(
      `UPDATE users
       SET verification_status = 'verified',
           verification_note   = $1,
           platform_fee_paid   = TRUE,
           verified_at         = NOW(),
           verified_by         = $2,
           qr_token            = COALESCE(NULLIF(qr_token, ''), encode(gen_random_bytes(20), 'hex'))
       WHERE id = $3`,
      [note || null, session.userId, id]
    );

    return success({ message: 'User approved and QR pass activated successfully' });
  } catch (err) {
    console.error('Verify user error:', err);
    return serverError();
  }
}

// PUT /api/admin/users/[id] — super admin edits any student details
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      college_name,
      is_amrita_student,
      roll_number,
      department,
      year_of_study,
      city,
      verification_status,
      platform_fee_paid,
      role,
    } = body;

    await db.query(
      `UPDATE users SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        college_name = COALESCE($4, college_name),
        is_amrita_student = COALESCE($5, is_amrita_student),
        roll_number = COALESCE($6, roll_number),
        department = COALESCE($7, department),
        year_of_study = COALESCE($8, year_of_study),
        city = COALESCE($9, city),
        verification_status = COALESCE($10, verification_status),
        platform_fee_paid = COALESCE($11, platform_fee_paid),
        role = COALESCE($12, role),
        updated_at = NOW()
       WHERE id = $13`,
      [
        full_name,
        email ? email.toLowerCase().trim() : null,
        phone,
        college_name,
        typeof is_amrita_student === 'boolean' ? is_amrita_student : null,
        roll_number,
        department,
        year_of_study,
        city,
        verification_status,
        typeof platform_fee_paid === 'boolean' ? platform_fee_paid : null,
        role,
        id,
      ]
    );

    return success({ message: 'Student profile updated successfully' });
  } catch (err) {
    console.error('Superadmin edit user error:', err);
    return serverError();
  }
}

// DELETE /api/admin/users/[id] — super admin deletes user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    // Prevent superadmin from deleting themselves
    if (session.userId === id) {
      return error('Cannot delete your own superadmin account');
    }

    // Cascade cleanup
    await db.query(`UPDATE events SET created_by = $1 WHERE created_by = $2`, [session.userId, id]);
    await db.query(`UPDATE users SET verified_by = NULL WHERE verified_by = $1`, [id]);
    await db.query(`DELETE FROM attendance WHERE user_id = $1 OR scanned_by = $1`, [id]);
    await db.query(`DELETE FROM registrations WHERE user_id = $1`, [id]);
    await db.query(`DELETE FROM payments WHERE user_id = $1`, [id]);
    await db.query(`DELETE FROM users WHERE id = $1`, [id]);

    return success({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    return serverError();
  }
}
