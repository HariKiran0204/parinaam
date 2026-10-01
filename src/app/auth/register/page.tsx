'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  GraduationCap,
  Building2,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  School,
  Sparkles,
  ShieldCheck,
  IdCard,
  MapPin,
} from 'lucide-react';
import { useAuth, RegisterData } from '@/context/AuthContext';

const AMRITA_DOMAIN = 'av.students.amrita.edu';
const STEPS = ['Category & Account', 'Student Profile', 'Confirm'];

export default function RegisterPage() {
  const { register, user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [studentType, setStudentType] = useState<'amrita' | 'other'>('amrita');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string>('');
  const [registrationDone, setRegistrationDone] = useState(false);
  const [needsIdUpload, setNeedsIdUpload] = useState(false);

  const [form, setForm] = useState<RegisterData & { confirmPassword: string }>({
    student_type: 'amrita',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    college_name: 'Amrita Vishwa Vidyapeetham, Amaravati',
    roll_number: '',
    department: '',
    year_of_study: '',
    city: '',
    id_card_url: '',
  });

  React.useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleStudentTypeChange = (type: 'amrita' | 'other') => {
    setStudentType(type);
    setError('');
    setForm(f => ({
      ...f,
      student_type: type,
      college_name: type === 'amrita' ? 'Amrita Vishwa Vidyapeetham, Amaravati' : '',
    }));
  };

  const handleIdCardSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP)');
      return;
    }
    setError('');
    setIdCardFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          setIdCardPreview(compressedBase64);
        } else {
          setIdCardPreview(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const isAmritaSelected = studentType === 'amrita';
  const isAmritaEmail = form.email.toLowerCase().endsWith(`@${AMRITA_DOMAIN}`) || 
                        form.email.toLowerCase().endsWith('.amrita.edu') || 
                        form.email.toLowerCase().endsWith('@amrita.edu');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validateStep0 = () => {
    if (!form.email.trim()) return 'Email address is required';
    if (isAmritaSelected && !isAmritaEmail) {
      return `Amrita students must use an official Amrita email (@${AMRITA_DOMAIN})`;
    }
    if (!form.password) return 'Password is required';
    if (form.password.length < 8) return 'Password must be at least 8 characters long';
    if (!form.confirmPassword) return 'Please confirm your password';
    if (form.password !== form.confirmPassword) return 'Passwords do not match. Please ensure both passwords are identical.';
    return '';
  };

  const validateStep1 = () => {
    if (!form.full_name.trim()) return 'Full name is required';
    const cleanPhone = (form.phone ?? '').replace(/\D/g, '');
    if (!cleanPhone) return 'Phone number is required';
    if (cleanPhone.length !== 10) return 'Phone number must be exactly 10 digits';
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) return 'Phone number must start with 6, 7, 8, or 9 (excluding +91)';
    if (isAmritaSelected) {
      if (!(form.roll_number ?? '').trim()) return 'Amrita Roll Number / Student ID is required';
      if (!form.department) return 'Please select your Branch';
    } else {
      if (!(form.college_name ?? '').trim()) return 'College / Institution name is required';
      if (!(form.roll_number ?? '').trim()) return 'Roll / Student ID Number is required';
      if (!(form.department ?? '').trim()) return 'Branch / Department name is required';
      if (!(form.city ?? '').trim()) return 'City / Location is required';
    }
    if (!form.year_of_study) return 'Please select your Year of Study';
    return '';
  };

  const next = () => {
    const err = step === 0 ? validateStep0() : step === 1 ? validateStep1() : '';
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAmritaSelected && !idCardPreview && !idCardFile) {
      setError('Please upload your college/university ID card photo before submitting');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...data } = form;
    const result = await register({
      ...data,
      phone: (data.phone || '').replace(/\D/g, '').slice(0, 10),
      student_type: studentType,
      college_name: isAmritaSelected ? 'Amrita Vishwa Vidyapeetham, Amaravati' : data.college_name,
      id_card_url: idCardPreview || undefined,
    });

    if (result.success) {
      setNeedsIdUpload(result.needs_id_upload ?? false);
      setRegistrationDone(true);
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  if (registrationDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#05030a] relative overflow-hidden py-12">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl relative z-10"
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-purple-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Submitted!</h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <AlertTriangle size={14} /> Waiting for Approval
          </div>

          <p className="text-slate-300 mb-6 text-xs leading-relaxed">
            Your student profile has been created successfully and is currently waiting for approval. Once approved, your digital festival QR pass and event registrations will be activated automatically.
          </p>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm"
          >
            Go to Student Dashboard →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#05030a] relative overflow-hidden py-12">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block group">
            <span className="font-['Pixelify_Sans'] text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              PARINAAM
            </span>
          </Link>
          <p className="text-slate-400 mt-1 text-sm">Fest Registration Portal</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-all ${
                  i === step
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : i < step
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                {i < step ? <CheckCircle size={12} /> : <span className="w-4 text-center">{i + 1}</span>}
                {s}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${i < step ? 'bg-emerald-600/50' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card Container */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); next(); }}>
            <AnimatePresence mode="wait">
              {/* STEP 0: Category Choice + Account Credentials */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Select Your Student Category
                    </label>
                    
                    {/* Student Type Selector Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {/* Option 1: Amrita Student */}
                      <button
                        type="button"
                        onClick={() => handleStudentTypeChange('amrita')}
                        className={`relative text-left p-4 rounded-xl border transition-all ${
                          isAmritaSelected
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-500'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${isAmritaSelected ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-slate-400'}`}>
                            <School size={18} />
                          </div>
                          {isAmritaSelected && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-slate-100">Amrita Student</h4>
                        <p className="text-xs text-slate-400 mt-1">Amrita Vishwa Vidyapeetham</p>
                        <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                          <Sparkles size={10} /> Campus Delegate
                        </div>
                      </button>

                      {/* Option 2: Other College Student */}
                      <button
                        type="button"
                        onClick={() => handleStudentTypeChange('other')}
                        className={`relative text-left p-4 rounded-xl border transition-all ${
                          !isAmritaSelected
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-500'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${!isAmritaSelected ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-slate-400'}`}>
                            <Building2 size={18} />
                          </div>
                          {!isAmritaSelected && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-slate-100">Other College</h4>
                        <p className="text-xs text-slate-400 mt-1">Other Colleges & Universities</p>
                        <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                          <IdCard size={10} /> ID Card Verification
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-4">
                    {/* Email Input */}
                    <Field
                      label={isAmritaSelected ? 'Amrita College Email (@av.students.amrita.edu)' : 'Email Address'}
                      icon={<Mail size={15} />}
                    >
                      <input
                        type="email"
                        placeholder={isAmritaSelected ? 'username@av.students.amrita.edu' : 'you@example.com'}
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        required
                        className={inputCls}
                      />
                    </Field>

                    {/* Dynamic Email Guide / Status */}
                    {isAmritaSelected ? (
                      <div className={`text-xs flex items-start gap-1.5 px-3 py-2 rounded-lg ${
                        isAmritaEmail
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      }`}>
                        {isAmritaEmail ? (
                          <>
                            <CheckCircle size={14} className="shrink-0 mt-0.5 text-emerald-400" />
                            <span>Valid Amrita Student email. Auto-verification enabled.</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} className="shrink-0 mt-0.5 text-purple-400" />
                            <span>Must be your official Amrita college email ending with <strong>@{AMRITA_DOMAIN}</strong></span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-slate-400 border border-white/10">
                        <IdCard size={14} className="shrink-0 text-purple-400" />
                        <span>You can use any valid email. You will be asked to upload your college ID card.</span>
                      </div>
                    )}

                    {/* Passwords */}
                    <Field label="Password (Min. 8 characters)" icon={<Lock size={15} />}>
                      <PasswordInput value={form.password} onChange={v => set('password', v)} placeholder="Create a strong password" />
                    </Field>

                    <Field label="Confirm Password" icon={<Lock size={15} />}>
                      <PasswordInput value={form.confirmPassword} onChange={v => set('confirmPassword', v)} placeholder="Re-enter password" />
                    </Field>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Student Profile Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-white font-semibold text-base">Personal & Academic Details</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      isAmritaSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isAmritaSelected ? 'Amrita Campus' : 'Other College'}
                    </span>
                  </div>

                  <Field label="Full Name (as per Student ID)" icon={<User size={15} />}>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={form.full_name}
                      onChange={e => set('full_name', e.target.value)}
                      required
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Phone Number (10 digits, starts with 6,7,8,9) *" icon={<Phone size={15} />}>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      maxLength={10}
                      onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                      className={inputCls}
                    />
                  </Field>

                  {/* College Name: Locked for Amrita, Input for Other */}
                  {isAmritaSelected ? (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">College / Institution</label>
                      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-sm">
                        <div className="flex items-center gap-2">
                          <School size={16} className="text-purple-400" />
                          <span className="font-medium">Amrita Vishwa Vidyapeetham, Amaravati</span>
                        </div>
                        <span className="text-[10px] bg-purple-500/30 text-purple-300 font-semibold px-2 py-0.5 rounded">
                          Fixed
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Field label="College / University Name *" icon={<Building2 size={15} />}>
                      <input
                        type="text"
                        placeholder="e.g. SRM University, VIT, IIT Madras..."
                        value={form.college_name}
                        onChange={e => set('college_name', e.target.value)}
                        required
                        className={inputCls}
                      />
                    </Field>
                  )}

                  {/* Roll Number */}
                  <Field
                    label={isAmritaSelected ? 'Amrita Roll Number / Student ID *' : 'Roll / Student ID Number *'}
                    icon={<GraduationCap size={15} />}
                  >
                    <input
                      type="text"
                      placeholder={isAmritaSelected ? 'e.g. CB.EN.U4CSE21001 or AV.SC.U4...' : 'e.g. 21BCE1024 / University Roll ID'}
                      value={form.roll_number}
                      onChange={e => set('roll_number', e.target.value)}
                      required
                      className={inputCls}
                    />
                  </Field>

                  {/* Department & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {isAmritaSelected ? (
                      <Field label="Branch (Amaravati Campus) *" icon={null}>
                        <select
                          value={form.department}
                          onChange={e => set('department', e.target.value)}
                          required
                          className={inputCls}
                        >
                          <option value="">Select Branch</option>
                          {['CSE', 'CSE-AIE', 'AIDS', 'CCE', 'ECE', 'QUANTUM'].map(b => (
                            <option key={b} value={b} className="bg-[#0e0b1a] text-slate-100">
                              {b}
                            </option>
                          ))}
                        </select>
                      </Field>
                    ) : (
                      <Field label="Branch / Department *" icon={null}>
                        <input
                          type="text"
                          placeholder="e.g. Mechanical, Information Tech..."
                          value={form.department}
                          onChange={e => set('department', e.target.value)}
                          required
                          className={inputCls}
                        />
                      </Field>
                    )}

                    <Field label="Year of Study *" icon={null}>
                      <select
                        value={form.year_of_study}
                        onChange={e => set('year_of_study', e.target.value)}
                        required
                        className={inputCls}
                      >
                        <option value="">Select Year</option>
                        {['1', '2', '3', '4'].map(y => (
                          <option key={y} value={y} className="bg-[#0e0b1a] text-slate-100">
                            Year {y}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* City / Location: Only for Other College Students, Removed for Amrita */}
                  {!isAmritaSelected && (
                    <Field label="City / Location *" icon={<MapPin size={15} />}>
                      <input
                        type="text"
                        placeholder="e.g. Vijayawada, Chennai, Hyderabad..."
                        value={form.city}
                        onChange={e => set('city', e.target.value)}
                        required
                        className={inputCls}
                      />
                    </Field>
                  )}
                </motion.div>
              )}

              {/* STEP 2: Review & Submit */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-white font-semibold text-lg mb-2">Review & Create Account</h3>

                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Student Category</span>
                      <span className="font-semibold text-purple-400">
                        {isAmritaSelected ? '🎓 Amrita Student' : '🏛️ Other College Student'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Full Name</span>
                      <span className="text-slate-200 font-medium">{form.full_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Email</span>
                      <span className="text-slate-200 truncate max-w-[200px]">{form.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Phone</span>
                      <span className="text-slate-200">{form.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">College</span>
                      <span className="text-slate-200 truncate max-w-[200px]">
                        {isAmritaSelected ? 'Amrita Vishwa Vidyapeetham' : form.college_name}
                      </span>
                    </div>
                    {form.roll_number && (
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Roll Number</span>
                        <span className="text-slate-200">{form.roll_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Dept / Year</span>
                      <span className="text-slate-200">
                        {form.department || '—'} ({form.year_of_study ? `Year ${form.year_of_study}` : '—'})
                      </span>
                    </div>
                    {!isAmritaSelected && form.city && (
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Location</span>
                        <span className="text-slate-200">{form.city}</span>
                      </div>
                    )}
                  </div>

                  {/* External student ID card upload inside Step 2 */}
                  {!isAmritaSelected && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-200">
                          Upload College / University ID Card Photo <span className="text-amber-400">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400">JPG, PNG (Max 5MB)</span>
                      </div>

                      {idCardPreview ? (
                        <div className="relative rounded-2xl border border-purple-500/40 bg-purple-950/20 p-3 overflow-hidden">
                          <div className="flex items-center gap-3">
                            <img
                              src={idCardPreview}
                              alt="ID Preview"
                              className="w-20 h-16 object-cover rounded-xl border border-white/20 bg-black/40 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">
                                {idCardFile?.name || 'College ID Card Selected'}
                              </p>
                              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                <CheckCircle size={12} /> Ready for verification review
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setIdCardFile(null);
                                  setIdCardPreview('');
                                }}
                                className="text-[11px] text-purple-300 hover:text-purple-200 underline mt-1 block"
                              >
                                Replace Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => document.getElementById('register-id-card-upload')?.click()}
                          className="border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-2xl p-5 text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]"
                        >
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto mb-2">
                            <Upload size={18} />
                          </div>
                          <p className="text-xs font-medium text-slate-200">
                            Click to upload college ID card photo
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Clear front-side photo or scan for verification approval
                          </p>
                          <input
                            id="register-id-card-upload"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={handleIdCardSelect}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    isAmritaSelected
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                  }`}>
                    {isAmritaSelected ? (
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-purple-400 shrink-0" />
                        <span>Amrita student profile submitted for verification. Free entry passes apply.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <IdCard size={16} className="text-amber-400 shrink-0" />
                        <span>Your uploaded ID card and details will be reviewed for event registration approval.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep(s => s - 1);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm hover:bg-white/10 transition-all"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/30"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : step < 2 ? (
                  <>
                    <span>Continue</span> <ArrowRight size={15} />
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all';

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{icon}</div>}
        {children}
      </div>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
