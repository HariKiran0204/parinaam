'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Loader2, Calendar, Users, IndianRupee, Trophy, ChevronRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { isStudentProfileComplete } from '@/lib/institutionPolicy';

interface Club { id: string; name: string; slug: string; color: string; event_count: string; }
interface Event {
  id: string; name: string; event_code: string; tagline: string; short_description: string;
  category: string; venue: string; date_start: string; start_time: string; end_time: string;
  min_team_size: number; max_team_size: number; capacity: number; enrolled: number; fee: number;
  prize_pool: string; poster_url: string; status: string; registration_open: boolean;
  is_popular: boolean; is_featured: boolean;
  club_id: string; club_name: string; club_slug: string; club_color: string;
}

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Coding & Hackathon', 'Robotics', 'Gaming', 'Workshops', 'Quiz & Literary', 'Arts & Media', 'Management', 'Dance', 'Music', 'Film & Media'];

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [events, setEvents]     = useState<Event[]>([]);
  const [clubs, setClubs]       = useState<Club[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [clubFilter, setClubFilter] = useState('');
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);

  // Fetch clubs once
  useEffect(() => {
    fetch('/api/clubs').then(r => r.json()).then(d => { if (d.success) setClubs(d.data.clubs); });
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'published', page: String(page), limit: '18' });
    if (search)     params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (clubFilter) params.set('club_id', clubFilter);

    const res  = await fetch(`/api/events?${params}`);
    const data = await res.json();
    if (data.success) {
      setEvents(data.data.events);
      setTotal(data.data.pagination.total);
    }
    setLoading(false);
  }, [search, category, clubFilter, page]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const clearFilters = () => { setSearchInput(''); setSearch(''); setCategory('All'); setClubFilter(''); setPage(1); };
  const hasFilters = search || category !== 'All' || clubFilter;

  return (
    <div className="min-h-screen bg-[#05030a] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-10 space-y-2">
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">PARINAAM 2026 CATALOG</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">All Events &amp; Competitions</h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            {total > 0 ? `${total} events across 12 clubs` : 'Browse events, view rulebooks, and register your team.'} Filter by club or category to discover what's happening.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-4 mb-8">
          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search events, keywords..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-sm transition-all"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Club pills */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setClubFilter(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${!clubFilter ? 'bg-purple-600 text-white border-purple-600' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'}`}>
              All Clubs
            </button>
            {clubs.map(club => (
              <button key={club.id} onClick={() => { setClubFilter(clubFilter === club.id ? '' : club.id); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${clubFilter === club.id ? 'text-white border-transparent' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'}`}
                style={clubFilter === club.id ? { background: club.color, borderColor: club.color } : {}}>
                {club.name}
                {club.event_count !== '0' && <span className="ml-1 opacity-60">({club.event_count})</span>}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${category === cat ? 'bg-white/15 text-white border-white/30' : 'bg-white/3 text-slate-500 border-white/5 hover:text-slate-300 hover:border-white/15'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Active filter count + clear */}
          {hasFilters && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs">Filtered results: <strong className="text-white">{total}</strong></span>
              <button onClick={clearFilters} className="text-xs text-purple-400 hover:text-purple-300 underline">Clear all filters</button>
            </div>
          )}
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-purple-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-8 max-w-lg mx-auto">
            <Filter size={36} className="mx-auto text-purple-400 mb-3 opacity-60" />
            <p className="text-white font-bold text-lg">{hasFilters ? 'No events matching filters' : 'Club Events Releasing Soon'}</p>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              {hasFilters ? 'Try clearing your search or selecting a different club cluster.' : 'The 12 official club administrators are currently uploading festival workshops and competitions.'}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} user={user} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 18 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30 hover:bg-white/10 transition-all">
              ← Prev
            </button>
            <span className="text-slate-400 text-sm">Page {page} of {Math.ceil(total / 18)}</span>
            <button disabled={page >= Math.ceil(total / 18)} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30 hover:bg-white/10 transition-all">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index, user }: { event: Event; index: number; user: ReturnType<typeof useAuth>['user'] }) {
  const router = useRouter();
  const { isInCart, isConfirmed, toggleCartItem } = useCart();
  const registered = isConfirmed(event.id);
  const inCart = isInCart(event.id);

  const teamLabel = event.min_team_size === event.max_team_size
    ? event.min_team_size === 1 ? 'Individual' : `${event.min_team_size} Members`
    : `${event.min_team_size}–${event.max_team_size} Members`;

  const spotsLeft = event.capacity ? event.capacity - event.enrolled : null;
  const almostFull = spotsLeft !== null && spotsLeft < 20 && spotsLeft > 0;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const isAdmin = user?.role === 'club_admin' || user?.role === 'super_admin';
  const isStudent = user?.role === 'student';
  const isProfileComplete = isStudentProfileComplete(user);

  const isRegistrationOpen = event.status === 'published' ? (event.registration_open ?? true) : Boolean(event.registration_open);

  const handleInterestedClick = () => {
    if (!user) {
      router.push('/auth/login?redirect=/events');
      return;
    }
    if (isStudent && !isProfileComplete) {
      alert('Please complete your platform registration profile before choosing events.');
      router.push('/dashboard/profile');
      return;
    }
    if (isStudent) {
      toggleCartItem(event.id, event.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-purple-900/10"
    >
      {/* Poster */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        {event.poster_url ? (
          <img src={event.poster_url} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl opacity-20" style={{ background: event.club_color }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05030a]/80 to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {event.is_popular && (
            <span className="bg-amber-500/90 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">🔥 Popular</span>
          )}
          {almostFull && (
            <span className="bg-red-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">⚡ {spotsLeft} spots left</span>
          )}
          {isFull && (
            <span className="bg-slate-700/90 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">Full</span>
          )}
        </div>
        {/* Club tag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ background: `${event.club_color}cc` }}>
            {event.club_name}
          </span>
        </div>
        {/* Fee */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${event.fee === 0 ? 'bg-green-500/80 text-white' : 'bg-black/60 text-white border border-white/20'}`}>
            {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-3">
          <p className="text-xs text-slate-500 font-mono mb-1">{event.event_code} · {event.category}</p>
          <h3 className="text-white font-bold text-base leading-snug group-hover:text-purple-200 transition-colors">{event.name}</h3>
          {event.tagline && <p className="text-slate-400 text-xs mt-0.5">{event.tagline}</p>}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={12} className="shrink-0" />
            <span>{teamLabel}</span>
          </div>
          {event.prize_pool && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <Trophy size={12} className="shrink-0" />
              <span className="truncate">{event.prize_pool}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 col-span-2">
              <Calendar size={12} className="shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link href={`/events/${event.id}`}
            className="flex-1 text-center text-sm font-semibold py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all">
            Details
          </Link>
          {!isAdmin && (
            registered ? (
              <span className="flex-1 text-center text-xs font-bold font-mono py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                You're registered!
              </span>
            ) : (
              <button
                onClick={handleInterestedClick}
                disabled={isFull || !isRegistrationOpen}
                className={`flex-1 text-center text-sm font-semibold py-2 rounded-xl transition-all ${
                  isFull || !isRegistrationOpen
                    ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                    : inCart && isStudent
                      ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/20'
                }`}>
                {isFull
                  ? 'Full'
                  : !isRegistrationOpen
                    ? 'Closed'
                    : inCart && isStudent
                      ? '✓ Interested'
                      : "I'm Interested"}
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );

}
