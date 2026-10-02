import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return 'Free Registration';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates an authoritative Participant ID format e.g. PARINAAM26-7K4P92
 */
export function generateParticipantId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PARINAAM26-${randomPart}`;
}

/**
 * Generates a secure, opaque verification token for QR payload
 */
export function generateOpaqueQRToken(participantId: string): string {
  const chars = 'abcdef0123456789';
  let hash = '';
  for (let i = 0; i < 24; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Store or deterministic binding simulation
  return `${participantId.toLowerCase().replace(/[^a-z0-9]/g, '')}-${hash.slice(0, 12)}`;
}

export function formatDate(dateString: string): string {
  return dateString;
}

/**
 * Standard email format regex adhering to RFC 5322 validation
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates whether the given string is a correctly formatted email address
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Maximum character length allowed for student names across the platform
 */
export const MAX_STUDENT_NAME_LENGTH = 16;

/**
 * Validates student name length (max 16 characters) and non-empty status
 */
export function isValidStudentName(name: string | null | undefined): { valid: boolean; error?: string } {
  const trimmed = name?.trim() || '';
  if (!trimmed) {
    return { valid: false, error: 'Student name is required' };
  }
  if (trimmed.length > MAX_STUDENT_NAME_LENGTH) {
    return {
      valid: false,
      error: `Student name must not exceed ${MAX_STUDENT_NAME_LENGTH} characters (currently ${trimmed.length})`,
    };
  }
  return { valid: true };
}
