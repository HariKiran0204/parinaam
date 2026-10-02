'use client';

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, Link as LinkIcon, Check } from 'lucide-react';

interface EventImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const PRESET_PHOTOS = [
  {
    name: 'Hackathon & AI',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'RoboWars & Hardware',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Battle of Bands',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Esports Gaming',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Tech Workshop',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Cultural & Arts',
    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
  },
];

export const EventImageUploader: React.FC<EventImageUploaderProps> = ({
  value,
  onChange,
  label = 'Event Cover Photo / Poster',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Process and scale uploaded photo via canvas to keep payload efficient & sharp
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadError('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } else {
          onChange(event.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setUploadError('Failed to load image.');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <X size={12} />
            <span>Remove Photo</span>
          </button>
        )}
      </div>

      {/* Live Preview If Image is Chosen */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-purple-500/50 bg-[#090514] shadow-xl group/preview">
          <img
            src={value}
            alt="Event Poster Preview"
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover/preview:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-emerald-500/50 text-emerald-400 font-mono text-[10px] flex items-center gap-1">
              <Check size={12} /> Photo Attached
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-black/80 border border-white/20 text-slate-300 hover:text-white hover:bg-rose-600 transition-all cursor-pointer"
              title="Remove photo"
            >
              <X size={14} />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="bg-black/80 px-2 py-0.5 rounded border border-white/10 text-[11px]">
              Ready for event display
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-[11px] font-bold shadow-md transition-all cursor-pointer"
            >
              Change Photo
            </button>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div className="bg-[#0e071c]/80 border border-purple-900/60 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Tabs: Upload / Presets / URL */}
          <div className="flex items-center gap-2 border-b border-purple-900/40 pb-3 text-xs font-mono">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                mode === 'upload'
                  ? 'bg-purple-600 text-white shadow-purple-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload size={13} />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('presets')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                mode === 'presets'
                  ? 'bg-purple-600 text-white shadow-purple-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={13} />
              <span>Presets</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                mode === 'url'
                  ? 'bg-purple-600 text-white shadow-purple-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LinkIcon size={13} />
              <span>Image URL</span>
            </button>
          </div>

          {/* Mode 1: Upload from device */}
          {mode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-600/40 hover:border-fuchsia-400 bg-purple-950/20 hover:bg-purple-900/30 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-fuchsia-400 group-hover:scale-110 transition-transform mb-3">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-bold text-white font-mono">
                  {isProcessing ? 'Processing image...' : 'Click to Upload Event Photo'}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Supports PNG, JPG, or WEBP (optimized automatically)
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Presets */}
          {mode === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_PHOTOS.map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => onChange(preset.url)}
                  className="group relative rounded-xl overflow-hidden border border-purple-900/60 hover:border-fuchsia-400 cursor-pointer transition-all bg-black/50"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-2">
                    <span className="text-[10px] font-mono font-bold text-slate-200 group-hover:text-fuchsia-300 truncate">
                      {preset.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mode 3: Image URL */}
          {mode === 'url' && (
            <div className="space-y-2">
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://images.unsplash.com/... or image link"
                className="w-full bg-[#140f2b] border border-purple-900/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-purple-400/40 focus:outline-none focus:border-fuchsia-500 transition-all font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Paste a direct image link from the web to display on the event card.
              </p>
            </div>
          )}

          {uploadError && (
            <p className="text-xs font-mono text-rose-400">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};
