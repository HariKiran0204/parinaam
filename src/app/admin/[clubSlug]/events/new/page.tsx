'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info, MapPin, Users, IndianRupee, Trophy, FileText,
  Plus, Trash2, Save, Eye, AlertCircle, Clock,
  CheckCircle, Layers, ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { EventImageUploader } from '@/components/admin/EventImageUploader';
import { isValidEmail } from '@/lib/utils';

const CATEGORIES = [
  'Technical', 'Cultural', 'Coding & Hackathon', 'Robotics',
  'Gaming', 'Workshops', 'Quiz & Literary', 'Arts & Media',
  'Management', 'Dance', 'Music', 'Film & Media', 'Sports', 'Other'
];

const SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: <Info size={15} /> },
  { id: 'schedule', label: 'Schedule', icon: <Clock size={15} /> },
  { id: 'team', label: 'Team & Capacity', icon: <Users size={15} /> },
  { id: 'fees', label: 'Fees & Prizes', icon: <IndianRupee size={15} /> },
  { id: 'rounds', label: 'Rounds', icon: <Layers size={15} /> },
  { id: 'rules', label: 'Rules & Eligibility', icon: <FileText size={15} /> },
  { id: 'coordinators', label: 'Coordinators', icon: <Users size={15} /> },
  { id: 'publish', label: 'Publish', icon: <Eye size={15} /> },
];

interface Round { name: string; description: string; date: string; }
interface Coordinator { name: string; role: string; phone: string; email: string; }

export default function CreateClubEventPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [club, setClub] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '', tagline: '', short_description: '', full_description: '',
    category: '', tags: [] as string[], tagInput: '',
    venue: '', date_start: '', date_end: '', start_time: '', end_time: '',
    day_number: '1',
    min_team_size: '1', max_team_size: '1',
    capacity: '', fee: '0', prize_pool: '',
    eligibility: '',
    rules: [''] as string[],
    rounds: [] as Round[],
    coordinators: [{ name: '', role: '', phone: '', email: '' }] as Coordinator[],
    poster_url: '', rulebook_url: '',
    status: 'draft', registration_open: true, is_popular: false,
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetch('/api/clubs')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const found = d.data.clubs.find((c: any) => c.slug.toLowerCase() === clubSlug.toLowerCase());
          if (found) setClub(found);
        }
      });
  }, [clubSlug, user, authLoading, router]);

  const addTag = () => {
    if (!form.tagInput.trim()) return;
    set('tags', [...form.tags, form.tagInput.trim()]);
    set('tagInput', '');
  };

  const removeTag = (i: number) => set('tags', form.tags.filter((_, idx) => idx !== i));
  const addRule = () => set('rules', [...form.rules, '']);
  const updateRule = (i: number, v: string) => set('rules', form.rules.map((r, idx) => idx === i ? v : r));
  const removeRule = (i: number) => set('rules', form.rules.filter((_, idx) => idx !== i));

  const addRound = () => set('rounds', [...form.rounds, { name: '', description: '', date: '' }]);
  const updateRound = (i: number, k: keyof Round, v: string) =>
    set('rounds', form.rounds.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const removeRound = (i: number) => set('rounds', form.rounds.filter((_, idx) => idx !== i));

  const addCoord = () => set('coordinators', [...form.coordinators, { name: '', role: '', phone: '', email: '' }]);
  const updateCoord = (i: number, k: keyof Coordinator, v: string) =>
    set('coordinators', form.coordinators.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const removeCoord = (i: number) => set('coordinators', form.coordinators.filter((_, idx) => idx !== i));

  const handleSave = async (publish = false) => {
    const missingBasicField = [
      { label: 'Event name', value: form.name },
      { label: 'Tagline', value: form.tagline },
      { label: 'Category', value: form.category },
      { label: 'Short description', value: form.short_description },
      { label: 'Full detailed description', value: form.full_description },
    ].find(field => !field.value.trim());

    if (missingBasicField) {
      setError(`${missingBasicField.label} is required`);
      setActiveSection('basic');
      return;
    }

    // Auto-assign default festival cover if none is chosen
    let effectivePoster = form.poster_url?.trim() || '';
    if (!effectivePoster) {
      effectivePoster = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80';
      set('poster_url', effectivePoster);
    } else {
      // Validate poster URL (supports uploaded photo data:image/ base64, relative / paths, and http/https URLs)
      const isDataUrl = effectivePoster.startsWith('data:image/');
      const isRelative = effectivePoster.startsWith('/');
      if (!isDataUrl && !isRelative) {
        try {
          const parsed = new URL(effectivePoster);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            throw new Error('Invalid poster URL protocol');
          }
        } catch {
          setError('Event poster must be a valid uploaded image, preset photo, or HTTP/HTTPS URL');
          setActiveSection('basic');
          return;
        }
      }
    }

    // Validate coordinator emails
    for (const coord of form.coordinators) {
      if (coord.email?.trim() && !isValidEmail(coord.email.trim())) {
        setError(`Coordinator email '${coord.email}' is not a valid email address`);
        setActiveSection('coordinators');
        return;
      }
    }

    if (publish && !form.date_start.trim()) {
      setError('Event start date is required to publish an event');
      setActiveSection('schedule');
      return;
    }
    if (!club) {
      setError('Club information missing');
      return;
    }

    setError('');
    setSaving(true);

    const payload = {
      ...form,
      poster_url: effectivePoster,
      date_start: form.date_start.trim() || null,
      date_end: form.date_end.trim() || null,
      start_time: form.start_time.trim() || null,
      end_time: form.end_time.trim() || null,
      status: publish ? 'published' : form.status,
      registration_open: publish ? true : (form.registration_open ?? true),
      fee: parseInt(form.fee) || 0,
      min_team_size: parseInt(form.min_team_size) || 1,
      max_team_size: parseInt(form.max_team_size) || 1,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      day_number: parseInt(form.day_number) || 1,
      rules: form.rules.filter(r => r.trim()),
      tags: form.tags,
      rounds: form.rounds.filter(r => r.name.trim()),
      coordinators: form.coordinators.filter(c => c.name.trim()),
      club_id: club.id,
    };

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (data.success) {
      router.push(`/admin/${clubSlug}`);
    } else {
      setError(data.error || 'Failed to create event');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/admin/${clubSlug}`}
              className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 mb-1.5 transition-colors"
            >
              <ArrowLeft size={13} /> Back to {club?.name || clubSlug} Admin
            </Link>
            <h1 className="text-2xl font-bold text-white">Create New Event</h1>
            <p className="text-purple-400 text-xs font-medium mt-0.5">
              Creating under: <strong>{club?.name || clubSlug}</strong>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <Save size={14} /> Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              <Eye size={14} /> Publish Event
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Navigation tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sticky top-24 space-y-1">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeSection === s.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
              >
                {/* Basic Info */}
                {activeSection === 'basic' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Basic Event Info</h2>
                    <FormField label="Event Name *">
                      <input
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="e.g. CodeSprint 2026 / Battle of Bands"
                        className={inp}
                        required
                      />
                    </FormField>
                    <FormField label="Tagline *">
                      <input
                        value={form.tagline}
                        onChange={e => set('tagline', e.target.value)}
                        placeholder="Short catchy one-liner"
                        className={inp}
                        required
                      />
                    </FormField>
                    <FormField label="Category *">
                      <select
                        value={form.category}
                        onChange={e => set('category', e.target.value)}
                        className={sel}
                        required
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c} className="bg-slate-900 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Short Description *">
                      <textarea
                        value={form.short_description}
                        onChange={e => set('short_description', e.target.value)}
                        rows={2}
                        placeholder="Short summary for event cards"
                        className={txta}
                        required
                      />
                    </FormField>
                    <FormField label="Full Detailed Description *">
                      <textarea
                        value={form.full_description}
                        onChange={e => set('full_description', e.target.value)}
                        rows={5}
                        placeholder="Full rules, schedule details, guidelines..."
                        className={txta}
                        required
                      />
                    </FormField>
                    <EventImageUploader
                      value={form.poster_url}
                      onChange={url => set('poster_url', url)}
                    />
                  </>
                )}

                {/* Schedule */}
                {activeSection === 'schedule' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Schedule & Location</h2>
                    <FormField label="Venue / Hall">
                      <input
                        value={form.venue}
                        onChange={e => set('venue', e.target.value)}
                        placeholder="e.g. Amriteshwari Hall / Main Stage"
                        className={inp}
                      />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Start Date">
                        <input
                          type="date"
                          value={form.date_start}
                          onChange={e => set('date_start', e.target.value)}
                          className={inp}
                        />
                      </FormField>
                      <FormField label="End Date">
                        <input
                          type="date"
                          value={form.date_end}
                          onChange={e => set('date_end', e.target.value)}
                          className={inp}
                        />
                      </FormField>
                      <FormField label="Start Time">
                        <input
                          type="time"
                          value={form.start_time}
                          onChange={e => set('start_time', e.target.value)}
                          className={inp}
                        />
                      </FormField>
                      <FormField label="End Time">
                        <input
                          type="time"
                          value={form.end_time}
                          onChange={e => set('end_time', e.target.value)}
                          className={inp}
                        />
                      </FormField>
                    </div>
                    <FormField label="Fest Day">
                      <select
                        value={form.day_number}
                        onChange={e => set('day_number', e.target.value)}
                        className={sel}
                      >
                        <option value="1" className="bg-slate-900 text-white">Day 1 (Oct 11)</option>
                        <option value="2" className="bg-slate-900 text-white">Day 2 (Oct 12)</option>
                      </select>
                    </FormField>
                  </>
                )}

                {/* Team & Capacity */}
                {activeSection === 'team' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Team Size & Capacity</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Min Team Size">
                        <input
                          type="number"
                          min="1"
                          value={form.min_team_size}
                          onChange={e => set('min_team_size', e.target.value)}
                          className={inp}
                        />
                      </FormField>
                      <FormField label="Max Team Size">
                        <input
                          type="number"
                          min="1"
                          value={form.max_team_size}
                          onChange={e => set('max_team_size', e.target.value)}
                          className={inp}
                        />
                      </FormField>
                    </div>
                    <FormField label="Max Attendee / Team Capacity">
                      <input
                        type="number"
                        min="1"
                        value={form.capacity}
                        onChange={e => set('capacity', e.target.value)}
                        placeholder="Leave blank for unlimited"
                        className={inp}
                      />
                    </FormField>
                  </>
                )}

                {/* Fees */}
                {activeSection === 'fees' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Fees & Prize Pool</h2>
                    <FormField label="Registration Fee (₹)">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={form.fee}
                          onChange={e => set('fee', e.target.value)}
                          className={`${inp} pl-7`}
                        />
                      </div>
                    </FormField>
                    <FormField label="Prize Pool">
                      <input
                        value={form.prize_pool}
                        onChange={e => set('prize_pool', e.target.value)}
                        placeholder="e.g. ₹50,000 + Goodies"
                        className={inp}
                      />
                    </FormField>
                  </>
                )}

                {/* Rounds */}
                {activeSection === 'rounds' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Event Rounds</h2>
                    {form.rounds.map((round, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Round {i + 1}</span>
                          <button onClick={() => removeRound(i)} className="text-red-400 hover:text-red-300">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <FormField label="Round Name">
                          <input
                            value={round.name}
                            onChange={e => updateRound(i, 'name', e.target.value)}
                            placeholder="e.g. Round 1: Coding Prelims"
                            className={inp}
                          />
                        </FormField>
                        <FormField label="Round Description">
                          <textarea
                            value={round.description}
                            onChange={e => updateRound(i, 'description', e.target.value)}
                            rows={2}
                            placeholder="Details about this round..."
                            className={txta}
                          />
                        </FormField>
                      </div>
                    ))}
                    <button
                      onClick={addRound}
                      className="flex items-center gap-2 w-full border-2 border-dashed border-white/15 hover:border-purple-500/40 rounded-xl py-3 text-slate-400 hover:text-purple-300 text-sm transition-all justify-center"
                    >
                      <Plus size={15} /> Add Round
                    </button>
                  </>
                )}

                {/* Rules */}
                {activeSection === 'rules' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Rules & Guidelines</h2>
                    <FormField label="Eligibility Criteria">
                      <textarea
                        value={form.eligibility}
                        onChange={e => set('eligibility', e.target.value)}
                        rows={3}
                        placeholder="e.g. Open to all UG & PG students with valid ID."
                        className={txta}
                      />
                    </FormField>
                    <FormField label="Event Rules">
                      <div className="space-y-2">
                        {form.rules.map((rule, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              value={rule}
                              onChange={e => updateRule(i, e.target.value)}
                              placeholder={`Rule ${i + 1}`}
                              className={`${inp} flex-1`}
                            />
                            {form.rules.length > 1 && (
                              <button onClick={() => removeRule(i)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={addRule}
                        className="mt-2 flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium"
                      >
                        <Plus size={14} /> Add Rule
                      </button>
                    </FormField>
                  </>
                )}

                {/* Coordinators */}
                {activeSection === 'coordinators' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Event Coordinators</h2>
                    {form.coordinators.map((c, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Coordinator {i + 1}</span>
                          {form.coordinators.length > 1 && (
                            <button onClick={() => removeCoord(i)} className="text-red-400 hover:text-red-300">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField label="Full Name">
                            <input
                              value={c.name}
                              onChange={e => updateCoord(i, 'name', e.target.value)}
                              placeholder="Name"
                              className={inp}
                            />
                          </FormField>
                          <FormField label="Phone Number">
                            <input
                              value={c.phone}
                              onChange={e => updateCoord(i, 'phone', e.target.value)}
                              placeholder="+91 ..."
                              className={inp}
                            />
                          </FormField>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addCoord}
                      className="flex items-center gap-2 w-full border-2 border-dashed border-white/15 hover:border-purple-500/40 rounded-xl py-3 text-slate-400 hover:text-purple-300 text-sm transition-all justify-center"
                    >
                      <Plus size={15} /> Add Coordinator
                    </button>
                  </>
                )}

                {/* Publish */}
                {activeSection === 'publish' && (
                  <>
                    <h2 className="text-lg font-bold text-white">Ready to Publish?</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-white text-sm font-medium">Open Registrations Immediately</p>
                          <p className="text-slate-500 text-xs">Allow students to enroll as soon as published</p>
                        </div>
                        <button
                          onClick={() => set('registration_open', !form.registration_open)}
                          className={`w-12 h-6 rounded-full transition-all relative ${
                            form.registration_open ? 'bg-purple-600' : 'bg-white/10'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              form.registration_open ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="border-t border-white/10 pt-4 flex gap-3">
                        <button
                          onClick={() => handleSave(false)}
                          disabled={saving}
                          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10"
                        >
                          Save as Draft
                        </button>
                        <button
                          onClick={() => handleSave(true)}
                          disabled={saving}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg"
                        >
                          Publish Now →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all';
const sel =
  'w-full bg-[#0e0b1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-all';
const txta =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all resize-none';

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
