'use client';

import React from 'react';
import { FestEvent } from '../../types';
import { Calendar, Clock, MapPin, Users, Trophy, ChevronRight, Check, Heart, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useFest } from '../../context/FestContext';
import { useCart } from '../../context/CartContext';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isStudentProfileComplete } from '@/lib/institutionPolicy';

interface EventCardProps {
  event: FestEvent;
  onSelect: (event: FestEvent) => void;
  onRegisterQuick?: (event: FestEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { isInCart, isConfirmed, toggleCartItem } = useCart();
  const registered = isConfirmed(event.id);
  const inCart = isInCart(event.id);

  const isStudent = user?.role === 'student';
  const isProfileComplete = isStudentProfileComplete(user);
  const isAdmin = user?.role === 'club_admin' || user?.role === 'super_admin';

  const handleInterestedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="bg-[#0b0716] border border-purple-900/50 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-purple-500/70 transition-all duration-300 group mi-glow-card">
      
      {/* Image & Badges Banner — Uncropped Showcase */}
      <div className="relative h-48 w-full overflow-hidden bg-black/95 flex items-center justify-center border-b border-purple-900/30">
        <img
          src={event.image}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-125 pointer-events-none"
        />
        <img
          src={event.image}
          alt={event.name}
          className="relative z-10 w-full h-full object-contain p-1.5 group-hover:scale-[1.02] transition-transform duration-300 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0716] via-transparent to-transparent pointer-events-none z-10" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-mono font-bold uppercase bg-black/80 backdrop-blur-sm text-purple-300 px-2.5 py-1 rounded-lg border border-purple-800/80">
            {event.category}
          </span>
          {event.isPopular && (
            <span className="text-[10px] font-mono font-bold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
              Flagship
            </span>
          )}
        </div>

        {/* Prize Pool Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/90 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{event.prizePool}</span>
        </div>

        {/* "I'm Interested" Heart/Cart Toggle Badge — Rendered ONLY for non-confirmed guests/students */}
        {!isAdmin && !registered && (
          <button
            onClick={handleInterestedClick}
            className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all border shadow-lg ${
              inCart && isStudent
                ? 'bg-pink-600 text-white border-pink-500 scale-105'
                : 'bg-black/70 backdrop-blur-sm text-slate-300 border-white/20 hover:text-pink-400 hover:border-pink-500/50'
            }`}
            title={!user ? "Sign in to add to cart" : inCart ? "In your Interested Cart" : "I'm Interested — Add to Cart"}
          >
            <Heart size={15} className={inCart && isStudent ? 'fill-white' : ''} />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{event.eventCode}</span>
            <span className="text-purple-300 font-bold">{formatCurrency(event.fee)}</span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug font-display">
            {event.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        {/* Key Details */}
        <div className="space-y-1.5 text-xs text-slate-300 font-mono pt-2 border-t border-purple-950">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{event.date} • {event.startTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{event.teamSize}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-purple-950 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect(event)}
            className="flex-1 py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-xs font-semibold text-purple-200 border border-purple-900/60 transition-colors flex items-center justify-center gap-1"
          >
            <span>Rules & Info</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {!isAdmin && (
            registered ? (
              <span className="py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>You're registered!</span>
              </span>
            ) : (
              <button
                onClick={handleInterestedClick}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  inCart && isStudent
                    ? 'bg-pink-600/30 text-pink-300 border border-pink-500/50'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-glow'
                }`}
              >
                {inCart && isStudent ? (
                  <>
                    <Check size={13} />
                    <span>✓ Interested</span>
                  </>
                ) : (
                  <>
                    <Heart size={13} />
                    <span>I'm Interested</span>
                  </>
                )}
              </button>
            )
          )}
        </div>
      </div>

    </div>
  );
};


