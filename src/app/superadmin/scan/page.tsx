'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, CheckCircle, AlertTriangle, XCircle, Users, RefreshCw,
  ArrowLeft, Camera, UserCheck, Search, Building2, Calendar, MapPin,
  Clock, Shield, Sparkles, Check, ChevronRight
} from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';
import { CameraQrScanner } from '@/components/scanner/CameraQrScanner';

interface RegisteredEvent {
  registration_id: string;
  registration_status: string;
  payment_status: string;
  team_name?: string;
  registered_at: string;
  event_id: string;
  event_name: string;
  event_code: string;
  category: string;
  venue?: string;
  date_start?: string;
  start_time?: string;
  day_number?: number;
  fee?: number;
  club_id: string;
  club_name: string;
  club_slug: string;
  club_color?: string;
  attendance_id?: string;
  checked_in_at?: string;
}

interface ScannedStudent {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  college_name: string;
  is_amrita_student: boolean;
  roll_number?: string;
  department?: string;
  year_of_study?: string;
  verification_status: string;
  platform_fee_paid: boolean;
  pass_type: string;
  qr_token: string;
}

export default function SuperAdminQRScannerPage() {
  const { user } = useRequireRole('super_admin');

  const [scannedStudent, setScannedStudent] = useState<ScannedStudent | null>(null);
  const [scannedEvents, setScannedEvents] = useState<RegisteredEvent[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'duplicate' | 'error'; message: string } | null>(null);

  // Manual token input
  const [manualToken, setManualToken] = useState('');

  // 1. Process Scanned QR Code
  const handleScanLookup = async (token: string) => {
    if (!token || !token.trim()) return;
    const clean = token.trim();
    setLookupLoading(true);
    setNotification(null);

    try {
      // Super admin does not pass club_slug to get all registered events across all clubs
      const res = await fetch(`/api/attendance/scan?qr_token=${encodeURIComponent(clean)}`);
      const data = await res.json();
      setLookupLoading(false);

      if (data.success && data.data) {
        setScannedStudent(data.data.student);
        setScannedEvents(data.data.events || []);

        if (!data.data.events || data.data.events.length === 0) {
          setNotification({
            type: 'error',
            message: `${data.data.student.full_name} is not registered for any festival events yet.`,
          });
        }
      } else {
        setScannedStudent(null);
        setScannedEvents([]);
        setNotification({
          type: 'error',
          message: data.error || 'Student QR pass not found or invalid.',
        });
      }
    } catch {
      setLookupLoading(false);
      setNotification({
        type: 'error',
        message: 'Network error processing pass lookup.',
      });
    }
  };

  // 2. Mark Attendance / Check-in for an event
  const handleMarkAttendance = async (eventId: string, eventName: string) => {
    if (!scannedStudent) return;
    setActionLoadingId(eventId);
    setNotification(null);

    try {
      const res = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qr_token: scannedStudent.qr_token || scannedStudent.id,
          event_id: eventId,
        }),
      });

      const data = await res.json();
      setActionLoadingId(null);

      if (data.success) {
        const isDup = Boolean(data.data.duplicate || data.data.status === 'DUPLICATE');
        setNotification({
          type: isDup ? 'duplicate' : 'success',
          message: data.data.message,
        });

        // Update local status in scannedEvents
        setScannedEvents(prev =>
          prev.map(ev =>
            ev.event_id === eventId
              ? {
                  ...ev,
                  attendance_id: data.data.attendance_id || 'att-confirmed',
                  checked_in_at: data.data.checked_in_at || new Date().toISOString(),
                }
              : ev
          )
        );
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to mark attendance.',
        });
      }
    } catch {
      setActionLoadingId(null);
      setNotification({
        type: 'error',
        message: 'Network error marking attendance.',
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim()) {
      handleScanLookup(manualToken);
      setManualToken('');
    }
  };

  const clearScannedStudent = () => {
    setScannedStudent(null);
    setScannedEvents([]);
    setNotification(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Top Breadcrumb Nav */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/superadmin"
            className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Command HQ
          </Link>

          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Shield size={13} /> Super Admin Universal Scanner
          </span>
        </div>

        {/* Header Headline */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-900/30">
            <QrCode size={28} className="text-purple-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Central Festival QR Check-in Console
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Universal gate scanner — view and verify attendance for all registered events across all 12 clubs
          </p>
        </div>

        {/* Live Notification Banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 shadow-xl ${
                notification.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : notification.type === 'duplicate'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-red-500/15 border-red-500/40 text-red-300'
              }`}
            >
              {notification.type === 'success' && <CheckCircle size={20} className="text-emerald-400 shrink-0" />}
              {notification.type === 'duplicate' && <AlertTriangle size={20} className="text-amber-400 shrink-0" />}
              {notification.type === 'error' && <XCircle size={20} className="text-red-400 shrink-0" />}
              <div className="flex-1 font-semibold text-sm">
                {notification.message}
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-xs opacity-70 hover:opacity-100 px-2 py-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP SECTION: Camera Scanner & Live Result */}
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          
          {/* Left: Live Camera QR Scanner (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <CameraQrScanner onScan={handleScanLookup} />

            {/* Manual Token Paste Alternative */}
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={e => setManualToken(e.target.value)}
                placeholder="Or paste QR Pass token / User ID"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="submit"
                disabled={lookupLoading || !manualToken.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md"
              >
                {lookupLoading ? <RefreshCw size={13} className="animate-spin" /> : <Search size={13} />}
                <span>Lookup</span>
              </button>
            </form>
          </div>

          {/* Right: Scanned Student & All Registered Events across ALL clubs (7 cols) */}
          <div className="lg:col-span-7">
            {lookupLoading ? (
              <div className="h-full min-h-[300px] bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <RefreshCw size={28} className="animate-spin text-purple-400 mb-3" />
                <p className="text-white font-semibold text-sm">Verifying Student QR Pass...</p>
                <p className="text-slate-400 text-xs mt-1">Retrieving all registered events across 12 clubs</p>
              </div>
            ) : scannedStudent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5"
              >
                {/* Header: Student Identity Profile */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                      {((scannedStudent.full_name || scannedStudent.email || 'S').charAt(0)).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{scannedStudent.full_name}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          scannedStudent.verification_status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {scannedStudent.verification_status === 'verified' ? '✓ Verified Student' : 'Pending Verification'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">{scannedStudent.email}</p>
                      <p className="text-[11px] text-purple-300 mt-0.5">
                        🏫 {scannedStudent.is_amrita_student ? 'Amrita Vishwa Vidyapeetham, Amaravati' : scannedStudent.college_name}
                        {scannedStudent.roll_number ? ` • ${scannedStudent.roll_number}` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={clearScannedStudent}
                    className="text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-all shrink-0"
                  >
                    Scan Next Pass
                  </button>
                </div>

                {/* List of Registered Events (All Clubs visible to Super Admin) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Sparkles size={14} /> All Registered Festival Events ({scannedEvents.length})
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                      Super Admin Multi-Club View
                    </span>
                  </div>

                  {scannedEvents.length === 0 ? (
                    <div className="p-6 bg-amber-500/5 border border-dashed border-amber-500/20 rounded-xl text-center">
                      <AlertTriangle size={24} className="mx-auto text-amber-400 mb-2" />
                      <p className="text-sm font-semibold text-white">No Event Registrations</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        This attendee does not have confirmed registrations for any events yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {scannedEvents.map(event => {
                        const isCheckedIn = Boolean(event.attendance_id || event.checked_in_at);
                        const isLoading = actionLoadingId === event.event_id;

                        return (
                          <div
                            key={event.event_id}
                            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isCheckedIn
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-purple-500/40'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[10px] font-mono font-bold text-white bg-purple-600/40 border border-purple-500/40 px-2 py-0.5 rounded">
                                  {event.club_name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                                  {event.event_code || 'EVENT'}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                                  {event.category || 'General'}
                                </span>
                                {isCheckedIn ? (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle size={11} /> Checked In
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                                    Ready to Check In
                                  </span>
                                )}
                              </div>

                              <h5 className="font-bold text-white text-sm truncate">{event.event_name}</h5>

                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                                <span>📍 {event.venue || 'Campus Hall'}</span>
                                {event.day_number && <span>🗓️ Day {event.day_number}</span>}
                                {event.start_time && <span>⏰ {event.start_time}</span>}
                              </div>

                              {isCheckedIn && event.checked_in_at && (
                                <p className="text-[11px] text-emerald-400 font-mono mt-1">
                                  Verified at: {new Date(event.checked_in_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </div>

                            {/* Mark Attendance CTA */}
                            <div className="shrink-0">
                              {isCheckedIn ? (
                                <button
                                  type="button"
                                  disabled
                                  className="w-full sm:w-auto bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-default"
                                >
                                  <Check size={14} /> Attendance Verified
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleMarkAttendance(event.event_id, event.event_name)}
                                  disabled={isLoading}
                                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                  {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <UserCheck size={14} />}
                                  <span>Mark Attendance</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <Camera size={36} className="text-purple-400/60 mb-3" />
                <h3 className="text-base font-bold text-white">Universal Gate Scanner Ready</h3>
                <p className="text-slate-400 text-xs max-w-sm mt-1">
                  Point the camera at any attendee's QR Pass to automatically view all their registered events across all 12 clubs and verify gate entry.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
