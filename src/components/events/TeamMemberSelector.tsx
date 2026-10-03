'use client';

import React, { useState, useCallback } from 'react';
import { UserPlus, X, Loader2, CheckCircle2, AlertCircle, Search, Users } from 'lucide-react';

export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  roll_number?: string | null;
  is_amrita_student: boolean;
  college_name?: string | null;
}

interface TeamMemberSelectorProps {
  eventId: string;
  minTeamSize: number;
  maxTeamSize: number;
  /** Members selected so far (not including leader themselves) */
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  leaderIsAmrita: boolean;
  disabled?: boolean;
}

export const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  eventId,
  minTeamSize,
  maxTeamSize,
  members,
  onChange,
  leaderIsAmrita,
  disabled = false,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResult, setSearchResult] = useState<TeamMember | null>(null);

  const maxMembersToAdd = maxTeamSize - 1; // leader is always slot #1
  const canAddMore = members.length < maxMembersToAdd;
  const totalWithLeader = members.length + 1;
  const isComplete = totalWithLeader >= minTeamSize && totalWithLeader <= maxTeamSize;

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;
    setSearching(true);
    setSearchError('');
    setSearchResult(null);

    const input = searchInput.trim();
    // Detect if it's an email or roll number
    const isEmail = input.includes('@');
    const param = isEmail ? `email=${encodeURIComponent(input)}` : `roll=${encodeURIComponent(input)}`;

    try {
      const res = await fetch(`/api/users/lookup?${param}`);
      const data = await res.json();

      if (!data.success) {
        setSearchError(data.error || 'Student not found');
        return;
      }

      const found: TeamMember = data.data.user;

      // Check if already added
      if (members.some(m => m.id === found.id)) {
        setSearchError(`${found.full_name} is already in your team.`);
        return;
      }

      // Validate college constraint
      const memberIsAmrita = found.is_amrita_student;
      if (leaderIsAmrita && !memberIsAmrita) {
        setSearchError(`You are an Amrita student. All team members must also be Amrita students. ${found.full_name} is from ${found.college_name || 'an external college'}.`);
        return;
      }
      if (!leaderIsAmrita && memberIsAmrita) {
        setSearchError(`Your team is from an external college. Amrita students (${found.full_name}) cannot join external college teams.`);
        return;
      }

      setSearchResult(found);
    } catch {
      setSearchError('Network error. Please try again.');
    } finally {
      setSearching(false);
    }
  }, [searchInput, members, leaderIsAmrita]);

  const handleAdd = () => {
    if (!searchResult || !canAddMore) return;
    onChange([...members, searchResult]);
    setSearchResult(null);
    setSearchInput('');
    setSearchError('');
  };

  const handleRemove = (id: string) => {
    onChange(members.filter(m => m.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResult) {
        handleAdd();
      } else {
        handleSearch();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-purple-400" />
          <span className="text-sm font-semibold text-white">
            Team Members
          </span>
        </div>
        <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
          isComplete
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          {totalWithLeader}/{maxTeamSize} members (min {minTeamSize})
        </span>
      </div>

      {/* Status bar */}
      {!isComplete && (
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>
            Add {minTeamSize - totalWithLeader > 0 ? `at least ${minTeamSize - totalWithLeader} more member(s)` : 'team members below'} to complete your team.
            You need {minTeamSize}–{maxTeamSize} members total (including yourself as leader).
          </span>
        </div>
      )}

      {isComplete && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>Team is complete! You can proceed to checkout.</span>
        </div>
      )}

      {/* Leader slot */}
      <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
          1
        </div>
        <div>
          <p className="text-xs text-purple-300 font-mono">You (Team Leader)</p>
          <p className="text-xs text-slate-400">
            {leaderIsAmrita ? '🏛️ Amrita Student' : '🎓 External College Student'}
          </p>
        </div>
        <span className="ml-auto text-[10px] bg-purple-600/30 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">LEADER</span>
      </div>

      {/* Added members */}
      {members.map((m, idx) => (
        <div key={m.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {idx + 2}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{m.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{m.email}</p>
            {m.roll_number && (
              <p className="text-[10px] text-purple-300 font-mono">{m.roll_number}</p>
            )}
          </div>
          {!disabled && (
            <button
              onClick={() => handleRemove(m.id)}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
              title="Remove member"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {/* Add member form */}
      {canAddMore && !disabled && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-mono">
            Search by Amrita email (e.g. <span className="text-purple-300">cb.en.u4cse22001@cb.amrita.edu</span>) or roll number:
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={e => { setSearchInput(e.target.value); setSearchResult(null); setSearchError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="Email or roll number..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                disabled={searching}
              />
            </div>
            <button
              onClick={searchResult ? handleAdd : handleSearch}
              disabled={searching || !searchInput.trim()}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 disabled:opacity-40 ${
                searchResult
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {searching ? (
                <Loader2 size={15} className="animate-spin" />
              ) : searchResult ? (
                <><UserPlus size={15} /> Add</>
              ) : (
                <><Search size={15} /> Find</>
              )}
            </button>
          </div>

          {/* Search result preview */}
          {searchResult && !searchError && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{searchResult.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{searchResult.email}</p>
                {searchResult.roll_number && (
                  <p className="text-[10px] text-purple-300 font-mono">{searchResult.roll_number}</p>
                )}
              </div>
              <span className="text-xs text-emerald-300 font-mono">
                {searchResult.is_amrita_student ? '🏛️ Amrita' : '🎓 External'}
              </span>
            </div>
          )}

          {/* Search error */}
          {searchError && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{searchError}</span>
            </div>
          )}
        </div>
      )}

      {!canAddMore && (
        <p className="text-xs text-slate-500 text-center font-mono">
          Maximum team size reached ({maxTeamSize} members).
        </p>
      )}
    </div>
  );
};
