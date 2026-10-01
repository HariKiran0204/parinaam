import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface MockUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string | null;
  role: 'student' | 'club_admin' | 'super_admin';
  club_id?: string | null;
  college_name?: string | null;
  is_amrita_student: boolean;
  roll_number?: string | null;
  department?: string | null;
  year_of_study?: string | null;
  city?: string | null;
  id_card_url?: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_note?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  platform_fee_paid: boolean;
  platform_payment_id?: string | null;
  platform_fee_paid_at?: string | null;
  qr_token: string;
  pass_type: string;
  avatar_url?: string | null;
  email_verified: boolean;
  email_verify_token?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockClub {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon_url?: string | null;
  banner_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockEvent {
  id: string;
  club_id: string;
  created_by: string;
  name: string;
  event_code: string;
  tagline: string;
  short_description: string;
  full_description: string;
  category: string;
  tags: string[];
  venue: string;
  date_start: string;
  date_end: string;
  start_time: string;
  end_time: string;
  day_number: number;
  min_team_size: number;
  max_team_size: number;
  capacity: number;
  enrolled: number;
  fee: number;
  prize_pool: string;
  eligibility: string;
  rules: string[];
  rounds: any[];
  coordinators: any[];
  poster_url: string;
  rulebook_url: string;
  status: string;
  registration_open: boolean;
  is_popular: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Fixed Password hash for 'Admin@123'
const ADMIN_PASSWORD_HASH = '$2b$10$oVTYvxiKT8AVrgLI6FDkduvkxf7ZAOMPBLpJYn4PvqSgUO7lcUUIS';

// 12 CLUBS
const CLUBS_DATA: MockClub[] = [
  { id: 'club-1', name: 'Chakravyuha', slug: 'chakravyuha', description: 'Technical, Hackathons & Coding Events', color: '#6366f1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-2', name: 'Prachurya', slug: 'prachurya', description: 'Cultural, Fine Arts & Literary Competitions', color: '#f59e0b', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-3', name: 'ReLU', slug: 'relu', description: 'AI/ML, Data Analytics & Deep Learning Hackathons', color: '#10b981', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-4', name: 'Avisruta', slug: 'avisruta', description: 'Battle of Bands, Solo Vocals & Instrumental', color: '#8b5cf6', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-5', name: 'Salesforce AgentBlazer', slug: 'salesforce-agentblazer', description: 'Cloud Computing, Enterprise Solutions & Case Studies', color: '#3b82f6', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-6', name: 'Saptaswara', slug: 'saptaswara', description: 'Performing Arts, Classical Music & Choir', color: '#ec4899', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-7', name: 'Robotics', slug: 'robotics', description: 'RoboWars, Line Follower & Drone Challenges', color: '#f97316', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-8', name: 'IEEE', slug: 'ieee', description: 'Electrical & Electronics Circuit Battles', color: '#06b6d4', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-9', name: 'Avinya', slug: 'avinya', description: 'Innovation, Shark Tank & Entrepreneurship', color: '#84cc16', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-10', name: 'Adivika', slug: 'adivika', description: 'Street Play, Drama, Mime & Heritage Arts', color: '#e11d48', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-11', name: 'Nrityasparsh', slug: 'nrityasparsh', description: 'Dance Battles, Solo, Duet & Group Choreography', color: '#a855f7', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'club-12', name: 'Drisya', slug: 'drisya', description: 'Film Making, Photography, Reels & Visual Media', color: '#14b8a6', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Initial seeded users
const USERS_DATA: MockUser[] = [
  // Super Admin
  {
    id: 'usr-superadmin',
    email: 'superadmin@parinaam.fest',
    password_hash: ADMIN_PASSWORD_HASH,
    full_name: 'Parinaam Super Admin',
    phone: '+91 9999900000',
    role: 'super_admin',
    club_id: null,
    college_name: 'Amrita Vishwa Vidyapeetham, Amaravati',
    is_amrita_student: true,
    verification_status: 'verified',
    platform_fee_paid: true,
    qr_token: 'qr-superadmin-token-001',
    pass_type: 'ALL ACCESS VIP PASS',
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // 12 Club Admins
  ...CLUBS_DATA.map((club, idx) => ({
    id: `usr-admin-${club.slug}`,
    email: `admin.${club.slug}@parinaam.fest`,
    password_hash: ADMIN_PASSWORD_HASH,
    full_name: `${club.name} Admin`,
    phone: `+91 98888000${(idx + 1).toString().padStart(2, '0')}`,
    role: 'club_admin' as const,
    club_id: club.id,
    college_name: 'Amrita Vishwa Vidyapeetham, Amaravati',
    is_amrita_student: true,
    verification_status: 'verified' as const,
    platform_fee_paid: true,
    qr_token: `qr-admin-${club.slug}-001`,
    pass_type: 'ORGANIZER PASS',
    email_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),
];

// Initial starter events (empty so club admins add real events)
const EVENTS_DATA: MockEvent[] = [];

// Global in-memory storage singleton
class MockDbEngine {
  users: MockUser[] = [...USERS_DATA];
  clubs: MockClub[] = [...CLUBS_DATA];
  events: MockEvent[] = [...EVENTS_DATA];
  registrations: any[] = [];
  attendance: any[] = [];
  payments: any[] = [];
  config: Record<string, string> = {
    platform_fee: '99',
    fest_name: 'PARINAAM 2026',
    fest_dates: 'October 11-12, 2026',
    registration_open: 'true',
    amrita_domain: 'av.students.amrita.edu',
  };

  async executeQuery(text: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    const q = text.trim();
    const qLower = q.toLowerCase();

    // 1. SELECT user by email
    if (qLower.includes('from users') && (qLower.includes('email =') || qLower.includes('email='))) {
      const email = params[0]?.toString().toLowerCase().trim();
      const user = this.users.find(u => u.email.toLowerCase() === email);
      if (!user) return { rows: [], rowCount: 0 };
      const club = this.clubs.find(c => c.id === user.club_id);
      const row = {
        ...user,
        club_name: club?.name || null,
        club_slug: club?.slug || null,
      };
      return { rows: [row], rowCount: 1 };
    }

    // 2. SELECT user by id
    if (qLower.includes('from users') && (qLower.includes('id = $') || qLower.includes('id=$') || qLower.includes('where id =') || qLower.includes('where u.id ='))) {
      const id = params[0]?.toString();
      const user = this.users.find(u => u.id === id);
      if (!user) return { rows: [], rowCount: 0 };
      const club = this.clubs.find(c => c.id === user.club_id);
      const row = {
        ...user,
        club_name: club?.name || null,
        club_slug: club?.slug || null,
      };
      return { rows: [row], rowCount: 1 };
    }

    // 3. SELECT user by qr_token
    if (qLower.includes('from users where qr_token =')) {
      const token = params[0]?.toString();
      const user = this.users.find(u => u.qr_token === token);
      const rows = user ? [{ ...user }] : [];
      return { rows, rowCount: rows.length };
    }

    // 4. INSERT into users
    if (qLower.startsWith('insert into users')) {
      const [
        email, passwordHash, full_name, phone,
        college_name, is_amrita_student, roll_number, department,
        year_of_study, city, verification_status, qr_token,
        email_verify_token, email_verified
      ] = params;

      const newUser: MockUser = {
        id: uuidv4(),
        email: email?.toString().toLowerCase().trim(),
        password_hash: passwordHash,
        full_name,
        phone: phone || null,
        role: 'student',
        club_id: null,
        college_name: college_name || (is_amrita_student ? 'Amrita Vishwa Vidyapeetham' : null),
        is_amrita_student: Boolean(is_amrita_student),
        roll_number: roll_number || null,
        department: department || null,
        year_of_study: year_of_study || null,
        city: city || null,
        verification_status: verification_status || (is_amrita_student ? 'verified' : 'pending'),
        platform_fee_paid: Boolean(is_amrita_student),
        qr_token: qr_token || uuidv4().replace(/-/g, ''),
        pass_type: 'DELEGATE PASS',
        email_verified: Boolean(email_verified),
        email_verify_token: email_verify_token || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.users.push(newUser);
      return {
        rows: [{
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          is_amrita_student: newUser.is_amrita_student,
          verification_status: newUser.verification_status,
          qr_token: newUser.qr_token,
          platform_fee_paid: newUser.platform_fee_paid,
        }],
        rowCount: 1,
      };
    }

    // 5. SELECT clubs
    if (qLower.includes('from clubs') && !qLower.includes('where id =')) {
      const rows = this.clubs.map(c => {
        const clubEvents = this.events.filter(e => e.club_id === c.id);
        return {
          ...c,
          event_count: clubEvents.length.toString(),
          total_enrolled: clubEvents.reduce((acc, e) => acc + (e.enrolled || 0), 0).toString(),
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 6. SELECT single club
    if (qLower.includes('from clubs where id =') || qLower.includes('select slug from clubs where id =')) {
      const clubId = params[0];
      const club = this.clubs.find(c => c.id === clubId);
      const rows = club ? [{ ...club }] : [];
      return { rows, rowCount: rows.length };
    }

    // 7. SELECT events with club join
    if (qLower.includes('from events e') || (qLower.includes('from events') && !qLower.includes('update events'))) {
      if (qLower.includes('where e.id =') || qLower.includes('where id =')) {
        const eventId = params[0];
        const event = this.events.find(e => e.id === eventId);
        if (!event) return { rows: [], rowCount: 0 };
        const club = this.clubs.find(c => c.id === event.club_id);
        const row = {
          ...event,
          club_name: club?.name || 'Club',
          club_slug: club?.slug || 'club',
          club_color: club?.color || '#6366f1',
          creator_name: 'Club Coordinator',
        };
        return { rows: [row], rowCount: 1 };
      }

      // Filtered events
      let filtered = [...this.events];
      if (params.length > 0) {
        // If club_id filter is in query
        if (qLower.includes('club_id =')) {
          filtered = filtered.filter(e => e.club_id === params[0]);
        }
      }

      const rows = filtered.map(e => {
        const club = this.clubs.find(c => c.id === e.club_id);
        return {
          ...e,
          club_name: club?.name || 'Club',
          club_slug: club?.slug || 'club',
          club_color: club?.color || '#6366f1',
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 8. INSERT event
    if (qLower.startsWith('insert into events')) {
      const [
        club_id, created_by, name, event_code, tagline,
        short_description, full_description, category, tags,
        venue, date_start, date_end, start_time, end_time,
        day_number, min_team_size, max_team_size, capacity,
        fee, prize_pool, eligibility, rules, rounds,
        coordinators, poster_url, rulebook_url, status,
        registration_open, is_popular, is_featured
      ] = params;

      const newEvent: MockEvent = {
        id: `evt-${uuidv4().slice(0, 8)}`,
        club_id,
        created_by,
        name,
        event_code: event_code || `EVT-${Date.now()}`,
        tagline: tagline || '',
        short_description: short_description || '',
        full_description: full_description || '',
        category: category || 'General',
        tags: tags || [],
        venue: venue || 'Campus Venue',
        date_start: date_start || '2026-10-11',
        date_end: date_end || '2026-10-12',
        start_time: start_time || '10:00:00',
        end_time: end_time || '17:00:00',
        day_number: day_number || 1,
        min_team_size: min_team_size || 1,
        max_team_size: max_team_size || 1,
        capacity: capacity || 100,
        enrolled: 0,
        fee: fee || 0,
        prize_pool: prize_pool || '',
        eligibility: eligibility || '',
        rules: rules ? JSON.parse(rules) : [],
        rounds: rounds ? JSON.parse(rounds) : [],
        coordinators: coordinators ? JSON.parse(coordinators) : [],
        poster_url: poster_url || '',
        rulebook_url: rulebook_url || '',
        status: status || 'published',
        registration_open: registration_open !== false,
        is_popular: Boolean(is_popular),
        is_featured: Boolean(is_featured),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.events.unshift(newEvent);
      return { rows: [newEvent], rowCount: 1 };
    }

    // 9. PLATFORM CONFIG
    if (qLower.includes('from platform_config')) {
      const rows = Object.entries(this.config).map(([key, value]) => ({
        key,
        value,
        description: `${key} setting`,
      }));
      return { rows, rowCount: rows.length };
    }

    // 10. ADMIN STATS & PAYMENTS
    if (qLower.includes('sum(amount_paise)') || qLower.includes('from payments')) {
      const totalPaise = this.payments.reduce((acc, p) => acc + (p.status === 'captured' ? p.amount_paise : 0), 0);
      return { rows: [{ total: totalPaise.toString() }], rowCount: 1 };
    }

    // 10b. ADMIN USER STATS
    if (qLower.includes('amrita_count') || qLower.includes('external_count')) {
      const students = this.users.filter(u => u.role === 'student');
      const amrita = students.filter(u => u.is_amrita_student).length;
      const external = students.filter(u => !u.is_amrita_student).length;
      const pending = students.filter(u => u.verification_status === 'pending').length;
      const verified = students.filter(u => u.verification_status === 'verified').length;
      return {
        rows: [{
          total: students.length.toString(),
          amrita_count: amrita.toString(),
          external_count: external.toString(),
          pending_count: pending.toString(),
          verified_count: verified.toString(),
        }],
        rowCount: 1,
      };
    }

    if (qLower.includes('count(*)') || qLower.includes('count(u.id)')) {
      if (qLower.includes('from users')) {
        const count = qLower.includes("role = 'student'")
          ? this.users.filter(u => u.role === 'student').length
          : qLower.includes("verification_status = 'pending'")
          ? this.users.filter(u => u.verification_status === 'pending').length
          : this.users.length;
        return { rows: [{ count: count.toString() }], rowCount: 1 };
      }
      if (qLower.includes('from events')) {
        return { rows: [{ count: this.events.length.toString() }], rowCount: 1 };
      }
      if (qLower.includes('from registrations')) {
        const count = qLower.includes("status = 'confirmed'")
          ? this.registrations.filter(r => r.status === 'CONFIRMED').length
          : this.registrations.length;
        return { rows: [{ count: count.toString() }], rowCount: 1 };
      }
      return { rows: [{ count: '0' }], rowCount: 1 };
    }

    // 11. RECENT REGISTRATIONS JOIN
    if (qLower.includes('from registrations r') && qLower.includes('join users u')) {
      const rows = this.registrations.map(r => {
        const user = this.users.find(u => u.id === r.user_id);
        const event = this.events.find(e => e.id === r.event_id);
        const club = event ? this.clubs.find(c => c.id === event.club_id) : undefined;
        return {
          id: r.id,
          registered_at: r.registered_at,
          status: r.status,
          full_name: user?.full_name || user?.email || 'Student',
          college_name: user?.college_name || 'Amrita Vishwa Vidyapeetham',
          event_name: event?.name || 'Festival Event',
          club_name: club?.name || 'Club',
        };
      });
      return { rows: rows.slice(0, 10), rowCount: Math.min(rows.length, 10) };
    }

    // 12. CLUB STATS JOIN
    if (qLower.includes('from clubs c') && qLower.includes('left join events e')) {
      const rows = this.clubs.map(c => {
        const clubEvents = this.events.filter(e => e.club_id === c.id);
        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          color: c.color,
          total_events: clubEvents.length.toString(),
          published_events: clubEvents.filter(e => e.status === 'published').length.toString(),
          total_registrations: '0',
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 13. ADMIN USERS LIST
    if (qLower.includes('from users u left join clubs c') || qLower.includes('from users u')) {
      let filtered = [...this.users];
      const rows = filtered.map(u => {
        const club = this.clubs.find(c => c.id === u.club_id);
        return {
          id: u.id,
          full_name: u.full_name,
          email: u.email,
          phone: u.phone || '',
          role: u.role,
          college_name: u.college_name || (u.is_amrita_student ? 'Amrita Vishwa Vidyapeetham, Amaravati' : 'External College'),
          is_amrita_student: u.is_amrita_student,
          roll_number: u.roll_number || '',
          department: u.department || '',
          year_of_study: u.year_of_study || '',
          city: u.city || '',
          verification_status: u.verification_status,
          verification_note: u.verification_note || '',
          platform_fee_paid: u.platform_fee_paid,
          id_card_url: u.id_card_url || '',
          created_at: u.created_at || new Date().toISOString(),
          club_name: club?.name || null,
          confirmed_registrations: '0',
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 14. DELETE FROM USERS
    if (qLower.startsWith('delete from users')) {
      const id = params[0]?.toString();
      const idx = this.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        this.users.splice(idx, 1);
        this.registrations = this.registrations.filter(r => r.user_id !== id);
        this.attendance = this.attendance.filter(a => a.user_id !== id);
        this.payments = this.payments.filter(p => p.user_id !== id);
        return { rows: [], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 15. DELETE FROM OTHER TABLES
    if (qLower.startsWith('delete from registrations')) {
      const id = params[0]?.toString();
      this.registrations = this.registrations.filter(r => r.user_id !== id && r.id !== id);
      return { rows: [], rowCount: 1 };
    }
    if (qLower.startsWith('delete from attendance')) {
      const id = params[0]?.toString();
      this.attendance = this.attendance.filter(a => a.user_id !== id && a.id !== id);
      return { rows: [], rowCount: 1 };
    }
    if (qLower.startsWith('delete from payments')) {
      const id = params[0]?.toString();
      this.payments = this.payments.filter(p => p.user_id !== id && p.id !== id);
      return { rows: [], rowCount: 1 };
    }

    // 16. UPDATE USERS
    if (qLower.startsWith('update users set') || qLower.startsWith('update users')) {
      const target = this.users.find(u => u.id === params[params.length - 1] || u.id === params[0]);
      if (target) {
        if (qLower.includes('verification_status =')) {
          target.verification_status = params[0] || target.verification_status;
          target.verification_note = params[1] || '';
          if (params[0] === 'verified') target.platform_fee_paid = true;
        }
        return { rows: [target], rowCount: 1 };
      }
    }

    // Generic fallback for updates & deletes
    return { rows: [], rowCount: 0 };
  }
}

// Global variable ensures single instance across Next.js reloads
declare global {
  var __parinaam_mock_db: MockDbEngine | undefined;
}

export const mockDb = global.__parinaam_mock_db || new MockDbEngine();
if (process.env.NODE_ENV !== 'production') {
  global.__parinaam_mock_db = mockDb;
}
