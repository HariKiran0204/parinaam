'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Eye, AlertCircle } from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';
import { EventImageUploader } from '@/components/admin/EventImageUploader';

export default function EditEventPage() {
	const { id, clubSlug } = useParams<{ id: string; clubSlug: string }>();
	const { user } = useRequireRole(['club_admin', 'super_admin']);
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [form, setForm] = useState({
		name: '', tagline: '', short_description: '', full_description: '',
		venue: '', date_start: '', date_end: '', start_time: '', end_time: '',
		fee: '0', capacity: '', prize_pool: '', eligibility: '',
		poster_url: '', status: 'draft', registration_open: false, is_popular: false,
	});

	useEffect(() => {
		fetch(`/api/events/${id}`).then(r => r.json()).then(d => {
			if (d.success) {
				const ev = d.data.event;
				setForm({
					name: ev.name || '',
					tagline: ev.tagline || '',
					short_description: ev.short_description || '',
					full_description: ev.full_description || '',
					venue: ev.venue || '',
					date_start: ev.date_start ? ev.date_start.split('T')[0] : '',
					date_end: ev.date_end ? ev.date_end.split('T')[0] : '',
					start_time: ev.start_time ? ev.start_time.slice(0, 5) : '',
					end_time: ev.end_time ? ev.end_time.slice(0, 5) : '',
					fee: String(ev.fee ?? 0),
					capacity: ev.capacity ? String(ev.capacity) : '',
					prize_pool: ev.prize_pool || '',
					eligibility: ev.eligibility || '',
					poster_url: ev.poster_url || '',
					status: ev.status || 'draft',
					registration_open: ev.registration_open ?? false,
					is_popular: ev.is_popular ?? false,
				});
			}
		}).finally(() => setLoading(false));
	}, [id]);

	const set = (key: string, value: unknown) => setForm(form => ({ ...form, [key]: value }));

	const handleSave = async (publish?: boolean) => {
		setSaving(true);
		setError('');
		const payload: Record<string, unknown> = {
			...form,
			fee: parseInt(form.fee) || 0,
			capacity: form.capacity ? parseInt(form.capacity) : null,
		};
		if (publish !== undefined) {
			payload.status = publish ? 'published' : 'draft';
			payload.registration_open = publish;
		}

		const res = await fetch(`/api/events/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		const data = await res.json();
		setSaving(false);
		if (data.success) router.push(`/admin/${clubSlug}`);
		else setError(data.error || 'Save failed');
	};

	if (!user || loading) return (
		<div className="min-h-screen bg-[#05030a] pt-28 flex items-center justify-center">
			<Loader2 size={32} className="animate-spin text-purple-500" />
		</div>
	);

	const inp = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all';
	const txta = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all resize-none';

	return (
		<div className="min-h-screen bg-[#05030a] pt-20 pb-16">
			<div className="max-w-3xl mx-auto px-4">
				<div className="flex items-center justify-between mb-6">
					<div>
						<Link href={`/admin/${clubSlug}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-1">
							<ArrowLeft size={14} /> Back to Club Admin
						</Link>
						<h1 className="text-xl font-bold text-white">Edit Event</h1>
					</div>
					<div className="flex gap-2">
						<button onClick={() => handleSave()} disabled={saving}
							className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-xl disabled:opacity-50">
							<Save size={14} /> Save
						</button>
						<button onClick={() => handleSave(form.status !== 'published')} disabled={saving}
							className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-all ${
								form.status === 'published'
									? 'bg-red-600/30 border border-red-500/40 text-red-300 hover:bg-red-600/40'
									: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
							}`}>
							<Eye size={14} /> {form.status === 'published' ? 'Unpublish' : 'Publish'}
						</button>
					</div>
				</div>

				{error && (
					<div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
						<AlertCircle size={14} /> {error}
					</div>
				)}

				<div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
					<F label="Event Name *"><input value={form.name} onChange={e => set('name', e.target.value)} className={inp} /></F>
					<F label="Tagline"><input value={form.tagline} onChange={e => set('tagline', e.target.value)} className={inp} /></F>
					<F label="Short Description"><textarea value={form.short_description} onChange={e => set('short_description', e.target.value)} rows={2} className={txta} /></F>
					<F label="Full Description"><textarea value={form.full_description} onChange={e => set('full_description', e.target.value)} rows={5} className={txta} /></F>
					<F label="Venue"><input value={form.venue} onChange={e => set('venue', e.target.value)} className={inp} /></F>
					<div className="grid grid-cols-2 gap-4">
						<F label="Start Date"><input type="date" value={form.date_start} onChange={e => set('date_start', e.target.value)} className={inp} /></F>
						<F label="End Date"><input type="date" value={form.date_end} onChange={e => set('date_end', e.target.value)} className={inp} /></F>
						<F label="Start Time"><input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} className={inp} /></F>
						<F label="End Time"><input type="time" value={form.end_time} onChange={e => set('end_time', e.target.value)} className={inp} /></F>
						<F label="Fee (₹)"><input type="number" min="0" value={form.fee} onChange={e => set('fee', e.target.value)} className={inp} /></F>
						<F label="Capacity"><input type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="Unlimited" className={inp} /></F>
					</div>
					<F label="Prize Pool"><input value={form.prize_pool} onChange={e => set('prize_pool', e.target.value)} placeholder="e.g. ₹50,000" className={inp} /></F>
					<F label="Eligibility"><textarea value={form.eligibility} onChange={e => set('eligibility', e.target.value)} rows={2} className={txta} /></F>
					<EventImageUploader value={form.poster_url} onChange={url => set('poster_url', url)} />

					<div className="space-y-3 pt-2">
						{[
							{ key: 'registration_open', label: 'Registration Open', desc: 'Allow students to register' },
							{ key: 'is_popular', label: 'Mark as Popular', desc: 'Featured in popular section' },
						].map(toggle => (
							<div key={toggle.key} className="flex items-center justify-between bg-white/3 border border-white/10 rounded-xl px-4 py-3">
								<div>
									<p className="text-white text-sm font-medium">{toggle.label}</p>
									<p className="text-slate-500 text-xs">{toggle.desc}</p>
								</div>
								<button onClick={() => set(toggle.key, !form[toggle.key as keyof typeof form])}
									className={`w-12 h-6 rounded-full transition-all relative ${form[toggle.key as keyof typeof form] ? 'bg-purple-600' : 'bg-white/10'}`}>
									<div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form[toggle.key as keyof typeof form] ? 'left-7' : 'left-1'}`} />
								</button>
							</div>
						))}
					</div>

					<div className="pt-2">
						<button onClick={() => handleSave()} disabled={saving}
							className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
							{saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
			{children}
		</div>
	);
}
