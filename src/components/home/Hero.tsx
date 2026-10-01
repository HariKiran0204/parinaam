'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FEST_CONFIG } from '../../data/festData';
import { ArrowRight, Calendar, MapPin, Trophy, Ticket, Flame, Building2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Hero = () => {
  const { user } = useAuth();
  // Countdown Timer state to Oct 16, 2026
  const [timeLeft, setTimeLeft] = useState({ days: 16, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const passHref = user
    ? user.role === 'student'
      ? '/dashboard/pass'
      : user.role === 'super_admin'
      ? '/superadmin'
      : `/admin/${user.club_slug || ''}`
    : '/auth/register';

  const passButtonLabel = user ? 'SEE DELEGATE PASS' : 'GET DELEGATE PASS';

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-purple-900/50 overflow-hidden fest-grid-bg bg-[#05030a]">
      
      {/* Mood Indigo Ambient Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[750px] h-[450px] bg-fuchsia-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[650px] h-[550px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Main Grid: Left Title & Info + Right Big Expanded Campus Architectural Hologram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Title Typography & CTAs (col-span-6 for balanced split) */}
          <div className="lg:col-span-6 text-left space-y-6">
            
            {/* Top Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/90 border border-fuchsia-500/50 text-xs font-mono text-purple-200 shadow-purple-glow">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-bold tracking-wider uppercase">AMRITA VISHWA VIDYAPEETHAM • AMARAVATI</span>
              <span className="text-fuchsia-500">•</span>
              <span className="text-amber-400 font-bold">OCT 11–12, 2026</span>
            </div>

            {/* Exact Logo Title Typography (Floating with glowing aura) */}
            <div className="relative py-1">
              <img
                src="/images/parinaam-title-transparent.png"
                alt="PARIनाम 2026 - The Techno-Cultural Fest"
                className="w-full max-w-lg sm:max-w-xl h-auto object-contain filter drop-shadow-[0_0_35px_rgba(217,70,239,0.7)]"
              />
            </div>

            {/* Subtitle Statement */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
              Two days of intense national hackathons, heavyweight steel robotics combat, live concerts, and cultural battles.
            </p>

            {/* Date & Location Pill Summary */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-slate-200 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/70 border border-purple-800/80">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                <span className="font-mono">{FEST_CONFIG.dates}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/70 border border-purple-800/80">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Amaravati Campus</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/70 border border-purple-800/80">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-semibold">{FEST_CONFIG.totalPrizePool} Prize</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <Link
                href={passHref}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base tracking-wide shadow-purple-glow flex items-center justify-center gap-3 transition-all active:scale-95 border border-fuchsia-400/40 text-center"
              >
                <Ticket className="w-5 h-5 text-amber-300" />
                <span>{passButtonLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/events"
                className="px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-fuchsia-800/80 transition-all text-center tracking-wide"
              >
                EXPLORE 35+ COMPETITIONS
              </Link>
            </div>

          </div>

          {/* Right Column: Big & Spacious Campus Architectural Hologram (col-span-6) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center relative w-full">
            
            {/* Atmospheric Multi-layer Glow Spotlight */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-fuchsia-600/35 via-purple-600/25 to-cyan-500/25 rounded-3xl blur-3xl pointer-events-none" />
            
            {/* Expanded Hero Campus Card - Generous Size, Fitting Right */}
            <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e091d]/90 to-[#070410]/95 p-4 sm:p-7 rounded-3xl border border-purple-500/50 shadow-2xl shadow-purple-950/70 mi-glow-card group">
              
              {/* Header Label inside Card */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-purple-900/40 text-xs font-mono">
                <span className="text-purple-300 flex items-center gap-2 font-bold tracking-wide">
                  <Building2 className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                  AMRITA VISHWA VIDYAPEETHAM
                </span>
                <span className="text-amber-400 font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                  AMARAVATI
                </span>
              </div>

              {/* Big High-Definition Glowing Campus Blueprint Artwork */}
              <div className="relative w-full overflow-hidden rounded-2xl bg-[#040208]/90 p-3 sm:p-5 border border-purple-800/40">
                {/* Subtle Grid overlay for architectural blueprint feel */}
                <div className="absolute inset-0 fest-grid-bg opacity-30 pointer-events-none" />
                
                <img
                  src="/images/campus-sketch-glow.png"
                  alt="Amrita Vishwa Vidyapeetham, Amaravati Campus"
                  className="w-full h-auto max-h-[360px] sm:max-h-[420px] object-contain filter drop-shadow-[0_0_30px_rgba(217,70,239,0.85)] group-hover:scale-[1.03] transition-transform duration-500 relative z-10"
                />
              </div>

              {/* Bottom Details Strip */}
              <div className="mt-3.5 px-1 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  MAIN ACADEMIC & INNOVATION COMPLEX
                </span>
                <span className="text-fuchsia-400 font-bold">
                  FESTIVAL VENUE
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Live Ticker & Stats Strip */}
        <div className="pt-10 border-t border-purple-900/50 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-purple-950/50 p-4.5 rounded-2xl border border-purple-900/60 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              Fest Countdown
            </span>
            <div className="flex items-baseline justify-center gap-1.5 font-mono">
              <span className="text-2xl font-bold text-white">{timeLeft.days}d</span>
              <span className="text-2xl font-bold text-white">{timeLeft.hours}h</span>
              <span className="text-2xl font-bold text-[#ff00ff]">{timeLeft.minutes}m</span>
              <span className="text-xs text-slate-400">{timeLeft.seconds}s</span>
            </div>
          </div>

          <div className="bg-purple-950/50 p-4.5 rounded-2xl border border-purple-900/60 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              National Prize Pool
            </span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {FEST_CONFIG.totalPrizePool}
            </span>
          </div>

          <div className="bg-purple-950/50 p-4.5 rounded-2xl border border-purple-900/60 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              Participating Colleges
            </span>
            <span className="text-2xl font-extrabold text-white font-mono">
              {FEST_CONFIG.participatingColleges}
            </span>
          </div>

          <div className="bg-purple-950/50 p-4.5 rounded-2xl border border-purple-900/60 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              Expected Delegates
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {FEST_CONFIG.expectedParticipants}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
