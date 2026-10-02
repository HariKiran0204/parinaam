'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, Calendar, IndianRupee, TicketCheck, Shield,
  AlertTriangle, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye,
  Building2, Settings, ExternalLink, Sparkles, ArrowRight,
  TrendingUp, Check, X, QrCode, Megaphone, School, RefreshCw
} from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface Overview {
  total_students: number;
  amrita_students: number;
  external_students: number;
  pending_verification: number;
  total_events: number;
  total_registrations: number;
  confirmed_registrations: number;
  total_checkins: number;
  total_revenue_inr: number;
}

interface BranchStat {
  department: string;
  count: string;
}

interface YearStat {
  year_of_study: string;
  count: string;
}

interface ClubStat {
  name: string;
  slug?: string;
  color: string;
  published_events: string;
  total_registrations: string;
}

interface RecentUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  college_name: string;
  is_amrita_student: boolean;
  roll_number: string;
  department: string;
  year_of_study: string;
  verification_status: string;
  platform_fee_paid: boolean;
  pass_type: string;
  created_at: string;
}

interface RecentRegistration {
  id: string;
  full_name: string;
  college_name: string;
  is_amrita_student: boolean;
  department: string;
  year_of_study: string;
  event_name: string;
  club_name: string;
  registered_at: string;
  status: string;
}

interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  college_name: string;
  id_card_url: string;
  created_at: string;
  roll_number: string;
  department: string;
  year_of_study: string;
}

interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  event_count?: string;
  total_enrolled?: string;
}

const BRANCH_LIST = ['CSE', 'CSE-AIE', 'AIDS', 'CCE', 'ECE', 'QUANTUM'];

function formatDateTimeIST(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return dateStr;
  }
}

export default function SuperAdminDashboard() {
  const { user } = useRequireRole('super_admin');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [branchStats, setBranchStats] = useState<BranchStat[]>([]);
  const [yearStats, setYearStats] = useState<YearStat[]>([]);
  const [clubStats, setClubStats] = useState<ClubStat[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [tab, setTab] = useState<'overview' | 'analytics' | 'clubs' | 'verify' | 'broadcast'>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Live feed pagination & filter
  const [feedType, setFeedType] = useState<'users' | 'events'>('users');
  const [feedPage, setFeedPage] = useState(1);
  const [feedPageSize, setFeedPageSize] = useState(10);

  // KYC queue pagination
  const [kycPage, setKycPage] = useState(1);
  const [kycPageSize, setKycPageSize] = useState(6);

  // Broadcast ticker state
  const [broadcastText, setBroadcastText] = useState('Welcome to PARINAAM 2026! Registrations are officially open for all 12 Clubs.');
  const [broadcastSaved, setBroadcastSaved] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, clubsRes, pendingRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/clubs').then(r => r.json()),
        fetch('/api/admin/users?verification_status=pending&role=student').then(r => r.json()),
      ]);

      if (statsRes.success) {
        setOverview(statsRes.data.overview);
        setBranchStats(statsRes.data.branch_stats || []);
        setYearStats(statsRes.data.year_stats || []);
        setClubStats(statsRes.data.club_stats || []);
        setRecentUsers(statsRes.data.recent_users || []);
        setRecentRegistrations(statsRes.data.recent_registrations || []);
      }
      if (clubsRes.success) setClubs(clubsRes.data.clubs || []);
      if (pendingRes.success) setPendingUsers(pendingRes.data.users || []);
    } catch (e) {
      console.error('Failed to load superadmin data:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const handleVerify = async (userId: string, status: 'verified' | 'rejected', note?: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    loadData();
  };

  if (!user) return null;

  const totalRegistered = overview?.total_students || 0;

  // Pagination helpers
  const activeFeedList = feedType === 'users' ? recentUsers : recentRegistrations;
  const feedTotal = activeFeedList.length;
  const feedTotalPages = Math.max(1, Math.ceil(feedTotal / feedPageSize));
  const paginatedFeed = activeFeedList.slice((feedPage - 1) * feedPageSize, feedPage * feedPageSize);

  const kycTotal = pendingUsers.length;
  const kycTotalPages = Math.max(1, Math.ceil(kycTotal / kycPageSize));
  const paginatedKyc = pendingUsers.slice((kycPage - 1) * kycPageSize, kycPage * kycPageSize);

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-purple-500/30">
                <Shield size={12} /> Super Admin Command HQ
              </span>
              <span className="text-xs text-slate-500">• Amrita Amaravati</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Festival Central Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Live metrics, participant analytics, 12 club controls & venue check-ins
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <Link
              href="/superadmin/scan"
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/30"
            >
              <QrCode size={14} /> QR Scanner
            </Link>
            <Link
              href="/superadmin/users"
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Users size={14} /> View All Users
            </Link>
            <Link
              href="/superadmin/settings"
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Settings size={14} /> Platform Config
            </Link>
          </div>
        </div>

        {/* Pending verification alert */}
        {overview && overview.pending_verification > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-3.5 cursor-pointer hover:bg-amber-500/15 transition-colors"
            onClick={() => setTab('verify')}
          >
            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
            <p className="text-amber-300 text-sm">
              <strong>{overview.pending_verification}</strong> external student{overview.pending_verification !== 1 ? 's' : ''} awaiting ID card review for ticket access
            </p>
            <span className="text-xs text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full font-semibold ml-auto flex items-center gap-1">
              Review Queue ({pendingUsers.length}) →
            </span>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 mb-8 w-fit flex-wrap">
          {[
            { id: 'overview', label: 'Command Overview' },
            { id: 'analytics', label: 'Branch & Year Analytics' },
            { id: 'clubs', label: `12 Club Portals (${clubs.length})` },
            { id: 'verify', label: `KYC Review Queue (${pendingUsers.length})` },
            { id: 'broadcast', label: 'Ticker & Broadcasts' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Primary KPI Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Students', value: overview?.total_students ?? '—', sub: 'All Registered', color: 'text-purple-400', href: '/superadmin/users' },
                { label: 'Amrita Amaravati', value: overview?.amrita_students ?? '—', sub: 'Free Passes', color: 'text-fuchsia-400', href: '/superadmin/users' },
                { label: 'External Students', value: overview?.external_students ?? '—', sub: 'National Reach', color: 'text-cyan-400', href: '/superadmin/users' },
                { label: 'Active Events', value: overview?.total_events ?? '—', sub: 'Across 12 Clubs', color: 'text-blue-400', href: '/events' },
                { label: 'Gate Check-ins', value: overview?.total_checkins ?? '—', sub: 'QR Scans Done', color: 'text-emerald-400', href: '/superadmin/scan' },
                { label: 'Total Revenue', value: `₹${overview?.total_revenue_inr ?? 0}`, sub: 'Paid Workshops', color: 'text-amber-400', href: '/superadmin/users' },
              ].map(kpi => (
                <Link key={kpi.label} href={kpi.href} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-2xl p-4 transition-all block">
                  <p className="text-slate-400 text-xs font-medium">{kpi.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{kpi.sub}</p>
                </Link>
              ))}
            </div>

            {/* Middle Grid: Ratio & Club Breakdown */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Institution Distribution Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <School size={16} className="text-purple-400" /> Institution Ratio
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{totalRegistered} Total</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-purple-300 font-medium">Amrita Students (Free)</span>
                      <span className="text-white font-mono font-bold">
                        {overview?.amrita_students ?? 0} ({totalRegistered > 0 ? Math.round(((overview?.amrita_students ?? 0) / totalRegistered) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${totalRegistered > 0 ? Math.min(100, Math.round(((overview?.amrita_students ?? 0) / totalRegistered) * 100)) : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cyan-300 font-medium">External Students</span>
                      <span className="text-white font-mono font-bold">
                        {overview?.external_students ?? 0} ({totalRegistered > 0 ? Math.round(((overview?.external_students ?? 0) / totalRegistered) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${totalRegistered > 0 ? Math.min(100, Math.round(((overview?.external_students ?? 0) / totalRegistered) * 100)) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Pending KYC Reviews</span>
                  <span className="font-bold text-amber-400">{overview?.pending_verification ?? 0}</span>
                </div>
              </div>

              {/* Club Activity Ranking */}
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 size={16} className="text-purple-400" /> Club Registrations Leaderboard
                  </h3>
                  <button
                    onClick={() => setTab('clubs')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View All 12 Clubs →
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {clubStats.slice(0, 6).map((club, idx) => (
                    <div
                      key={club.name}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white">{club.name}</p>
                          <p className="text-[10px] text-slate-500">{club.published_events} events published</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-purple-300">
                          {club.total_registrations}
                        </span>
                        <p className="text-[9px] text-slate-500">enrolled</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users size={16} className="text-purple-400" /> Live Registrations & Participant Stream
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time feed of participants signing up and claiming passes on Parinaam
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Feed Toggle */}
                  <div className="flex bg-black/40 border border-white/10 rounded-xl p-0.5 text-xs">
                    <button
                      onClick={() => { setFeedType('users'); setFeedPage(1); }}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        feedType === 'users'
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Student Signups ({recentUsers.length})
                    </button>
                    <button
                      onClick={() => { setFeedType('events'); setFeedPage(1); }}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        feedType === 'events'
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Event Enrollments ({recentRegistrations.length})
                    </button>
                  </div>

                  <Link
                    href="/superadmin/users"
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium px-2 py-1"
                  >
                    All Users ({totalRegistered}) →
                  </Link>
                </div>
              </div>

              {/* Feed Table */}
              <div className="overflow-x-auto">
                {feedType === 'users' ? (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase tracking-wider">
                        <th className="py-2.5">Participant</th>
                        <th className="py-2.5">Campus / Roll No</th>
                        <th className="py-2.5">Academic</th>
                        <th className="py-2.5">KYC Status</th>
                        <th className="py-2.5">Pass Status</th>
                        <th className="py-2.5 text-right">Registered At (IST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No student user signups recorded yet.
                          </td>
                        </tr>
                      ) : (
                        paginatedFeed.map((u: any) => (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                  {((u.full_name || u.email || 'S').charAt(0)).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-white">{u.full_name || 'Student'}</p>
                                  <p className="text-[11px] text-slate-400">{u.email}</p>
                                  {u.phone && <p className="text-[10px] text-slate-500 font-mono">{u.phone}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              {u.is_amrita_student ? (
                                <span className="inline-flex items-center text-[10px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-md">
                                  Amrita Amaravati
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs truncate max-w-[150px] block">
                                  {u.college_name || 'External College'}
                                </span>
                              )}
                              {u.roll_number && (
                                <p className="font-mono text-[10px] text-slate-400 mt-0.5">{u.roll_number}</p>
                              )}
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {u.department ? (
                                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 text-[10px]">
                                    {u.department}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-[10px]">—</span>
                                )}
                                {u.year_of_study && (
                                  <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400 text-[10px]">
                                    Yr {u.year_of_study}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3">
                              {u.verification_status === 'verified' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  <CheckCircle size={10} /> Verified
                                </span>
                              ) : u.verification_status === 'rejected' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                                  <XCircle size={10} /> Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                  <AlertTriangle size={10} /> Waiting Approval
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              {u.verification_status !== 'verified' ? (
                                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                  Pending Approval
                                </span>
                              ) : u.is_amrita_student ? (
                                <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                                  Free Pass
                                </span>
                              ) : u.platform_fee_paid ? (
                                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                  Paid Pass
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">Unpaid</span>
                              )}
                            </td>
                            <td className="py-3 text-right text-slate-400 font-mono text-[11px]">
                              {formatDateTimeIST(u.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase tracking-wider">
                        <th className="py-2.5">Student</th>
                        <th className="py-2.5">Institution</th>
                        <th className="py-2.5">Branch & Year</th>
                        <th className="py-2.5">Event Enrolled</th>
                        <th className="py-2.5 text-right">Timestamp (IST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">
                            No event enrollments recorded yet.
                          </td>
                        </tr>
                      ) : (
                        paginatedFeed.map((r: any) => (
                          <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 font-semibold text-white">{r.full_name}</td>
                            <td className="py-3 text-slate-400">
                              {r.is_amrita_student ? 'Amrita Amaravati' : r.college_name}
                            </td>
                            <td className="py-3">
                              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 text-[10px]">
                                {r.department || '—'} {r.year_of_study ? `(Yr ${r.year_of_study})` : ''}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="font-semibold text-purple-300">{r.event_name}</span>
                              <span className="text-slate-500 text-[10px] block">{r.club_name}</span>
                            </td>
                            <td className="py-3 text-right text-slate-400 font-mono text-[11px]">
                              {formatDateTimeIST(r.registered_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Feed Pagination */}
              {feedTotal > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400">
                    Showing <strong className="text-white">{Math.min(feedTotal, (feedPage - 1) * feedPageSize + 1)}</strong> to{' '}
                    <strong className="text-white">{Math.min(feedTotal, feedPage * feedPageSize)}</strong> of{' '}
                    <strong className="text-white">{feedTotal}</strong> records
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Per page:</span>
                    {[5, 10, 20].map(sz => (
                      <button
                        key={sz}
                        onClick={() => { setFeedPageSize(sz); setFeedPage(1); }}
                        className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                          feedPageSize === sz
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}

                    <div className="flex items-center gap-1 ml-2">
                      <button
                        disabled={feedPage <= 1}
                        onClick={() => setFeedPage(p => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="px-2 text-slate-300 font-medium font-mono text-[11px]">
                        {feedPage} / {feedTotalPages}
                      </span>
                      <button
                        disabled={feedPage >= feedTotalPages}
                        onClick={() => setFeedPage(p => Math.min(feedTotalPages, p + 1))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED ANALYTICS */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Branch Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-400" /> Branch / Department Distribution
                </h3>

                <div className="space-y-3">
                  {BRANCH_LIST.map(branch => {
                    const match = branchStats.find(b => b.department?.toUpperCase() === branch.toUpperCase());
                    const count = parseInt(match?.count || '0');
                    const pct = totalRegistered > 0 ? Math.round((count / totalRegistered) * 100) : 0;

                    return (
                      <div key={branch}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-200">{branch}</span>
                          <span className="font-mono text-slate-400">{count} students ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Year of Study Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" /> Year of Study Distribution
                </h3>

                <div className="space-y-4">
                  {['1', '2', '3', '4'].map(yr => {
                    const match = yearStats.find(y => y.year_of_study === yr || y.year_of_study === `${yr}st Year` || y.year_of_study === `${yr}nd Year` || y.year_of_study === `${yr}rd Year` || y.year_of_study === `${yr}th Year`);
                    const count = parseInt(match?.count || '0');
                    const pct = totalRegistered > 0 ? Math.round((count / totalRegistered) * 100) : 0;

                    return (
                      <div key={yr}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-200">Year {yr}</span>
                          <span className="font-mono text-slate-400">{count} students ({pct}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 12 CLUB PORTALS */}
        {tab === 'clubs' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map(club => (
                <div
                  key={club.id}
                  className="bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-2xl p-5 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: club.color || '#9333ea' }}
                      />
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        /admin/{club.slug}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {club.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {club.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">
                      Events: <strong className="text-white">{club.event_count || '0'}</strong>
                    </span>
                    <Link
                      href={`/admin/${club.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white bg-purple-600/20 hover:bg-purple-600 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Enter Portal <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KYC QUEUE */}
        {tab === 'verify' && (
          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <CheckCircle size={36} className="mx-auto text-emerald-400 mb-2" />
                <h4 className="text-base font-bold text-white">KYC Queue Clear</h4>
                <p className="text-xs text-slate-400 mt-1">No pending student ID card approvals at this moment.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {paginatedKyc.map(u => (
                    <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{u.full_name || 'Student'}</h4>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                              Pending Review
                            </span>
                          </div>
                          <p className="text-xs text-purple-300 font-mono mt-0.5">{u.email}</p>
                          {u.phone && <p className="text-xs text-slate-400 font-mono mt-0.5">📞 {u.phone}</p>}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 shrink-0 text-right">
                          {formatDateTimeIST(u.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-black/30 p-3 rounded-xl border border-white/5">
                        <div>
                          <span className="text-slate-500 text-[10px] block">College / University</span>
                          <span className="font-semibold text-slate-200 truncate block">{u.college_name || 'External'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Roll / Student ID</span>
                          <span className="font-mono text-purple-300 truncate block">{u.roll_number || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Branch</span>
                          <span className="font-medium text-slate-200">{u.department || '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Year of Study</span>
                          <span className="font-medium text-slate-200">{u.year_of_study ? `Year ${u.year_of_study}` : '—'}</span>
                        </div>
                      </div>

                      {u.id_card_url && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Uploaded College ID Card:</span>
                            <button
                              onClick={() => setZoomedImage(u.id_card_url)}
                              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                            >
                              <Eye size={12} /> Zoom ID Card
                            </button>
                          </div>
                          <div
                            onClick={() => setZoomedImage(u.id_card_url)}
                            className="rounded-xl overflow-hidden border border-white/10 bg-black/60 cursor-pointer hover:border-purple-500/40 transition-colors"
                          >
                            <img
                              src={u.id_card_url}
                              alt="Student ID"
                              className="w-full h-44 object-contain"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleVerify(u.id, 'verified')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/20"
                        >
                          <Check size={14} /> Approve & Grant Pass
                        </button>
                        <button
                          onClick={() => handleVerify(u.id, 'rejected')}
                          className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* KYC Pagination */}
                {kycTotal > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Showing <strong className="text-white">{Math.min(kycTotal, (kycPage - 1) * kycPageSize + 1)}</strong> to{' '}
                      <strong className="text-white">{Math.min(kycTotal, kycPage * kycPageSize)}</strong> of{' '}
                      <strong className="text-white">{kycTotal}</strong> verification requests
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        disabled={kycPage <= 1}
                        onClick={() => setKycPage(p => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="px-2 text-slate-300 font-medium font-mono text-[11px]">
                        Page {kycPage} of {kycTotalPages}
                      </span>
                      <button
                        disabled={kycPage >= kycTotalPages}
                        onClick={() => setKycPage(p => Math.min(kycTotalPages, p + 1))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Photo Zoom Modal */}
            {zoomedImage && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setZoomedImage(null)}
              >
                <div className="relative max-w-3xl max-h-[85vh] bg-[#0e071c] p-2 rounded-2xl border border-white/20">
                  <button
                    onClick={() => setZoomedImage(null)}
                    className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/90"
                  >
                    <X size={18} />
                  </button>
                  <img
                    src={zoomedImage}
                    alt="Zoomed Student ID"
                    className="max-w-full max-h-[80vh] object-contain rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BROADCAST */}
        {tab === 'broadcast' && (
          <div className="max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone size={18} className="text-purple-400" /> Live Marquee Announcement
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                This message scrolls dynamically in the global top notification bar across the website.
              </p>
            </div>

            <textarea
              value={broadcastText}
              onChange={e => setBroadcastText(e.target.value)}
              rows={3}
              className="w-full bg-[#0e0b1a] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={() => {
                setBroadcastSaved(true);
                setTimeout(() => setBroadcastSaved(false), 2500);
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/40"
            >
              {broadcastSaved ? '✓ Broadcast Updated' : 'Publish Announcement'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
