/**
 * Institutional Email & Fee Policy Helper
 * 
 * Centralized business logic for identifying institutional student email domains
 * (e.g. Amrita Vishwa Vidyapeetham) and calculating platform & event registration fees.
 */

// Recognized institutional email domains
export const RECOGNIZED_INSTITUTION_DOMAINS = [
  'av.students.amrita.edu',
  'students.amrita.edu',
  'amrita.edu',
  'cb.amrita.edu',
  'amritanet.edu',
];

// Standard non-Amrita platform registration fee in INR (₹1000 fixed pass)
export const STANDARD_PLATFORM_FEE_INR = 1000;

// Flagship festival events included in the ₹1000 Outside Student Pass
export const OUTSIDE_STUDENT_INCLUDED_EVENTS = [
  'Live Concert and DJ',
  'Garba Night',
  'Auto Expo',
  'Tholu Bommalata',
];

/**
 * Checks if an email address belongs to a recognized institutional domain.
 */
export function isInstitutionalEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const lower = email.toLowerCase().trim();
  return RECOGNIZED_INSTITUTION_DOMAINS.some(domain => lower.endsWith(`@${domain}`) || lower.endsWith(`.${domain}`));
}

export interface FeeUserContext {
  email: string;
  is_amrita_student: boolean;
  platform_fee_paid: boolean;
}

export interface EventFeeItem {
  id: string;
  fee: number;
}

export interface FeeBreakdown {
  eventFeesTotal: number;
  platformFee: number;
  platformFeeWaived: boolean;
  totalFee: number;
}

/**
 * Calculates the exact payable fee breakdown for a user and a list of events.
 * Server-side source of truth for checkout and cart calculation.
 */
export function calculatePayableFees(user: FeeUserContext, events: EventFeeItem[]): FeeBreakdown {
  const isAmrita = user.is_amrita_student || isInstitutionalEmail(user.email);
  
  // Sum event-specific fees (always follow individual event pricing)
  const eventFeesTotal = events.reduce((sum, item) => sum + Math.max(0, Number(item.fee) || 0), 0);
  
  // Platform fee policy:
  // - Waived for Amrita students (₹0)
  // - Waived if non-Amrita student already paid platform fee previously
  // - Standard platform fee (₹150) applied if non-Amrita student registering for the first time
  let platformFee = 0;
  let platformFeeWaived = false;

  if (isAmrita) {
    platformFee = 0;
    platformFeeWaived = true;
  } else if (user.platform_fee_paid) {
    platformFee = 0;
    platformFeeWaived = false;
  } else {
    platformFee = STANDARD_PLATFORM_FEE_INR;
    platformFeeWaived = false;
  }

  const totalFee = eventFeesTotal + platformFee;

  return {
    eventFeesTotal,
    platformFee,
    platformFeeWaived,
    totalFee,
  };
}

export interface ProfileUserContext {
  role?: string;
  phone?: string | null;
  college_name?: string | null;
  department?: string | null;
  year_of_study?: string | null;
  is_amrita_student?: boolean | null;
  id_card_url?: string | null;
  email?: string | null;
}

/**
 * Validates whether a student has completed their platform profile registration.
 * Required before allowing event registrations or cart access.
 */
export function isStudentProfileComplete(user?: ProfileUserContext | null): boolean {
  if (!user) return false;
  // Non-student roles (club_admin, super_admin) are not subject to student profile completion
  if (user.role && user.role !== 'student') return true;

  if (!user.phone || !user.phone.trim()) return false;
  if (!user.college_name || !user.college_name.trim()) return false;
  if (!user.department || !user.department.trim()) return false;
  if (!user.year_of_study || !user.year_of_study.trim()) return false;

  const isAmrita = Boolean(user.is_amrita_student) || isInstitutionalEmail(user.email);
  if (!isAmrita && (!user.id_card_url || !user.id_card_url.trim())) return false;

  return true;
}

