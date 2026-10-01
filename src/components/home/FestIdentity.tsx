'use client';

import React from 'react';
import { Terminal, Cpu, Music, Gamepad2 } from 'lucide-react';

export const FestIdentity = () => {
  const pillars = [
    {
      icon: Terminal,
      title: 'HackArena 3.0',
      description: '36 hours of non-stop algorithmic building, cloud deployment, and direct VC pitching.',
      tag: 'Flagship Hackathon',
      highlight: '₹1.5L Prize',
    },
    {
      icon: Cpu,
      title: 'RoboWars Deathmatch',
      description: 'Bulletproof steel enclosure matches where custom heavyweight combat bots battle for total dominance.',
      tag: 'Heavyweight Arena',
      highlight: '₹1.2L Prize',
    },
    {
      icon: Music,
      title: 'Battle of Bands & Live Concerts',
      description: 'National band competitions, choreography clashes, and headline music acts on the main lawn.',
      tag: 'Grand Stage',
      highlight: '₹1.0L Prize',
    },
    {
      icon: Gamepad2,
      title: 'Esports LAN Arena',
      description: 'High-refresh Valorant & BGMI tournaments on stage with live shoutcasting.',
      tag: 'LAN Stadium',
      highlight: '₹1.0L Prize',
    },
  ];

  return (
    <section className="py-20 bg-[#060812] border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Manifesto Header */}
        <div className="max-w-3xl space-y-4 mb-16">

          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
            Two days. One campus.<br />
            <span className="text-slate-400 font-semibold">Thousands of stories.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2 font-normal">
            Parinaam 2026 brings together students from over 150 engineering, science, and arts institutions across India. Whether you are debugging at 3:00 AM in the innovation hall or performing under stage spotlights, this is where India's brightest talent converges.
          </p>
        </div>

        {/* 4 Flagship Arena Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-purple-500/50 transition-all duration-200 group mi-glow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {pillar.highlight}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    {pillar.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors font-display">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
