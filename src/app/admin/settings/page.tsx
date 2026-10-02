'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2, CheckCircle, Settings } from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface Config { key: string; value: string; description: string; }

export default function AdminSettingsPage() {
  const { user } = useRequireRole('super_admin');
  const [configs, setConfigs] = useState<Config[]>([]);
  const [values,  setValues]  = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/admin/config').then(r=>r.json()).then(d=>{
      if (d.success) {
        setConfigs(d.data.configs);
        const v: Record<string,string> = {};
        d.data.configs.forEach((c: Config) => { v[c.key] = c.value; });
        setValues(v);
      }
    }).finally(()=>setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configs: values }),
    });
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false), 3000);
  };

  if (!user) return null;

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-all";

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/superadmin" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-1">
            <ChevronLeft size={14}/> Back to Command HQ
          </Link>
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-purple-400"/>
            <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Control platform-wide configuration</p>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
            <CheckCircle size={15}/> Settings saved!
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          {loading ? (
            Array.from({length:5}).map((_,i)=>(
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"/>
            ))
          ) : configs.map(c=>(
            <div key={c.key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-200">{formatKey(c.key)}</label>
                <span className="text-xs text-slate-600 font-mono">{c.key}</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{c.description}</p>
              {c.key === 'registration_open' ? (
                <button onClick={()=>setValues(v=>({...v,[c.key]:v[c.key]==='true'?'false':'true'}))}
                  className={`w-12 h-6 rounded-full transition-all relative ${values[c.key]==='true'?'bg-purple-600':'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${values[c.key]==='true'?'left-7':'left-1'}`}/>
                </button>
              ) : (
                <input value={values[c.key]||''} onChange={e=>setValues(v=>({...v,[c.key]:e.target.value}))}
                  className={inp}/>
              )}
            </div>
          ))}

          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 mt-2">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <><Save size={16}/> Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatKey(key: string) {
  if (!key) return '';
  return key.split('_').map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : '')).join(' ');
}
