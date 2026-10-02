export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, serverError } from '@/lib/apiResponse';

// POST /api/registrations — register for an event
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'student') return error('Only students can register for events', 403);

    const { event_id, team_name, team_members = [] } = await req.json();
    if (!event_id) return error('Event ID is required');

    // Check user verification
    const userResult = await db.query(
      `SELECT id, is_amrita_student, verification_status, platform_fee_paid FROM users WHERE id = $1`,
      [session.userId]
    );
    const user = userResult.rows[0];
    
    if (user.verification_status !== 'verified') {
      return error('Your account verification is pending Super Admin approval. You will be able to register once verified.', 403);
    }
    if (!user.is_amrita_student && !user.platform_fee_paid) {
      return error('Please complete registration payment before registering for events.', 403);
    }

    // Check event
    const eventResult = await db.query(
      `SELECT id, name, fee, capacity, enrolled, registration_open, status, min_team_size, max_team_size
       FROM events WHERE id = $1`,
      [event_id]
    );
    if (eventResult.rows.length === 0) return error('Event not found', 404);
    const event = eventResult.rows[0];

    if (!event.registration_open || event.status !== 'published') {
      return error('Event registration is closed');
    }

    // Check capacity
    if (event.capacity && event.enrolled >= event.capacity) {
      return error('Event is full. No more registrations available.');
    }

    // Check team size
    const teamCount = team_members.length + 1; // +1 for the registrant
    if (teamCount < event.min_team_size || teamCount > event.max_team_size) {
      return error(`Team size must be between ${event.min_team_size} and ${event.max_team_size}`);
    }

    // Check if already registered
    const existingReg = await db.query(
      `SELECT id, status FROM registrations WHERE user_id = $1 AND event_id = $2`,
      [session.userId, event_id]
    );
    if (existingReg.rows.length > 0) {
      return error('You are already registered for this event', 409);
    }

    // Create registration (PENDING payment if fee > 0)
    const regStatus = event.fee === 0 ? 'CONFIRMED' : 'PENDING';
    const payStatus = event.fee === 0 ? 'paid' : 'pending';

    const regResult = await db.query(
      `INSERT INTO registrations (user_id, event_id, team_name, team_members, amount_paid, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        session.userId, event_id, team_name || null,
        JSON.stringify(team_members), 0, regStatus, payStatus
      ]
    );

    // If free event, increment enrolled count
    if (event.fee === 0) {
      await db.query(`UPDATE events SET enrolled = enrolled + 1 WHERE id = $1`, [event_id]);
    }

    return success({
      registration: regResult.rows[0],
      needs_payment: event.fee > 0,
      amount: event.fee,
    }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return serverError();
  }
}

// GET /api/registrations — student's own registrations
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const result = await db.query(
      `SELECT 
        r.id, r.status, r.payment_status, r.amount_paid, r.team_name,
        r.registered_at, r.confirmed_at,
        COALESCE(e.id, r.event_id) as event_id, 
        COALESCE(e.name, 'Festival Event') as event_name, 
        COALESCE(e.category, 'General') as category, 
        COALESCE(e.venue, 'Amrita Campus') as venue,
        e.date_start, e.start_time, e.poster_url, 
        COALESCE(e.fee, r.amount_paid, 0) as fee,
        COALESCE(c.name, 'PARINAAM Fest') as club_name, 
        COALESCE(c.color, '#9333ea') as club_color,
        a.id as attendance_id, a.scanned_at as checked_in_at
       FROM registrations r
       LEFT JOIN events e ON r.event_id = e.id
       LEFT JOIN clubs c ON e.club_id = c.id
       LEFT JOIN attendance a ON a.user_id = r.user_id AND a.event_id = r.event_id AND a.status = 'SUCCESS'
       WHERE r.user_id = $1
       ORDER BY r.registered_at DESC`,
      [session.userId]
    );

    return success({ registrations: result.rows });
  } catch (err) {
    console.error('Get registrations error:', err);
    return serverError();
  }
}
