'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'student' | 'club_admin' | 'super_admin';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  club_id?: string;
  club_name?: string;
  club_slug?: string;
  college_name?: string;
  is_amrita_student: boolean;
  roll_number?: string;
  department?: string;
  year_of_study?: string;
  city?: string;
  id_card_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  platform_fee_paid: boolean;
  qr_token?: string;
  pass_type?: string;
  avatar_url?: string;
  email_verified: boolean;
  created_at?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; needs_id_upload?: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  student_type?: 'amrita' | 'other';
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  college_name?: string;
  roll_number?: string;
  department?: string;
  year_of_study?: string;
  city?: string;
  id_card_url?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (formData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        return {
          success: true,
          needs_id_upload: data.data.needs_id_upload,
        };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/me', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Role guards
export function useRequireAuth(redirectTo = '/auth/login') {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.push(redirectTo);
  }, [user, loading, router, redirectTo]);
  return { user, loading };
}

export function useRequireRole(role: UserRole | UserRole[], redirectTo = '/') {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      const roles = Array.isArray(role) ? role : [role];
      if (!roles.includes(user.role)) router.push(redirectTo);
    }
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router, role, redirectTo]);
  return { user, loading };
}
