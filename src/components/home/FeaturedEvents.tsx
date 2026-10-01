'use client';

import React, { useState } from 'react';
import { MOCK_EVENTS } from '../../data/eventsData';
import { EventCard } from '../events/EventCard';
import { EventDetailModal } from '../events/EventDetailModal';
import { FestEvent, EventCategory } from '../../types';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const FeaturedEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All');
  const { user } = useAuth();
  const router = useRouter();

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Coding & Hackathon',
    'Robotics',
    'Gaming',
    'Cultural',
    'Workshops',
  ];

  const filteredEvents = activeCategory === 'All'
    ? MOCK_EVENTS.slice(0, 6)
    : MOCK_EVENTS.filter((e) => e.category === activeCategory);

  const handleQuickRegister = (event: FestEvent) => {
    router.push(user ? '/events' : `/auth/register?event=${event.id}`);
  };

  return (
    <section className="py-20 bg-[#05030a] border-b border-purple-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>COMPETITIONS & CLUSTERS</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              Flagship Events & Competitions
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Explore national 36-hour hackathons, steel robotics combat, LAN esports battles, and battle of bands on stage.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wide"
          >
            <span>View All Competitions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-pixel">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white border-purple-500 shadow-purple-glow'
                  : 'bg-purple-950/40 text-slate-300 border-purple-900/60 hover:border-purple-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 px-6 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 text-purple-400">
              <Sparkles size={26} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Club Events Releasing Soon</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed mb-6">
              Our 12 clubs are currently preparing hackathons, robotics wars, and cultural competitions for Parinaam 2026.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href={user ? '/dashboard/pass' : '/auth/register'}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all"
              >
                {user ? 'See Delegate Pass' : 'Get Delegate Pass'}
              </Link>
              <Link
                href="/schedule"
                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all"
              >
                View Fest Timeline
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(evt) => setSelectedEvent(evt)}
                onRegisterQuick={handleQuickRegister}
              />
            ))}
          </div>
        )}

        {/* Modal for detail view */}
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleQuickRegister}
        />

      </div>
    </section>
  );
};
