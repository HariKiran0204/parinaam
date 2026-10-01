'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_SPONSORS } from '../../data/sponsorsData';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

export const SponsorsSection = () => {
  const titleSponsor = MOCK_SPONSORS.find((s) => s.tier === 'Title Sponsor');
  const poweredBy = MOCK_SPONSORS.find((s) => s.tier === 'Powered By');
  const otherSponsors = MOCK_SPONSORS.filter(
    (s) => s.tier !== 'Title Sponsor' && s.tier !== 'Powered By'
  );

  return (
    <section id="sponsors" className="py-20 bg-[#060911] border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
            FESTIVAL PARTNERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Backed by Industry Leaders
          </h2>
          <p className="text-sm text-slate-400">
            Parinaam 2026 is proudly presented in collaboration with visionary technology, engineering, and student media partners.
          </p>
        </div>

        {/* Tier 1: Title Sponsor */}
        {titleSponsor && (
          <div className="space-y-4 text-center">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
              TITLE SPONSOR
            </span>
            <div className="max-w-md mx-auto p-8 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center gap-6 hover:border-slate-700 transition-all">
              <img
                src={titleSponsor.logo}
                alt={titleSponsor.name}
                className="h-16 w-auto object-contain rounded-lg"
              />
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white">{titleSponsor.name}</h3>
                <a
                  href={titleSponsor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 mt-1"
                >
                  <span>Visit Partner</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tier 2: Powered By & Co-Sponsor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {poweredBy && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                POWERED BY
              </span>
              <img
                src={poweredBy.logo}
                alt={poweredBy.name}
                className="h-10 w-auto object-contain mx-auto rounded"
              />
              <h4 className="text-base font-bold text-white">{poweredBy.name}</h4>
            </div>
          )}

          {otherSponsors.map((sp) => (
            <div key={sp.id} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                {sp.tier}
              </span>
              <img
                src={sp.logo}
                alt={sp.name}
                className="h-10 w-auto object-contain mx-auto rounded"
              />
              <h4 className="text-base font-bold text-white">{sp.name}</h4>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* BUTTON JUST BELOW THE LIST OF SPONSORS (AS REQUESTED) */}
        {/* ========================================================= */}
        <div className="text-center pt-8 border-t border-purple-900/40 max-w-xl mx-auto space-y-4">
          <p className="text-sm sm:text-base text-slate-300 font-medium">
            Interested in showcasing your brand at <span className="text-white font-bold">PARINAAM 2026</span>?
          </p>
          <div>
            <Link
              href="/sponsor"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(217,70,239,0.5)] hover:shadow-[0_0_40px_rgba(217,70,239,0.8)] hover:scale-105 active:scale-[0.98] transition-all cursor-pointer border border-fuchsia-400/40"
            >
              <span>Partner With Us / Register as Sponsor</span>
              <ArrowRight className="w-4 h-4 text-white animate-pulse" />
            </Link>
          </div>
          <p className="text-[11px] font-mono text-purple-300/60">
            Amrita Vishwa Vidyapeetham • Amaravati Campus
          </p>
        </div>

      </div>
    </section>
  );
};
