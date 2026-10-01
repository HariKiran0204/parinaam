'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  User,
  Phone,
  Globe,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Trophy,
  Download,
  HelpCircle,
  Clock,
  MapPin,
  Briefcase
} from 'lucide-react';

const SPONSOR_TIERS = [
  {
    id: 'title',
    name: 'Title Sponsor',
    amount: '₹5,00,000+',
    color: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-500/40',
    badge: 'EXCLUSIVE (1 SLOTS)',
    perks: [
      'Top-tier naming: "PARINAAM 2026 presented by [Brand]"',
      'Keynote speech during Grand Inauguration & Valedictory',
      'Mega central exhibition stall (20x20 ft) in Innovation Hub',
      'Brand logo on all 4,000+ delegate smart QR passes & lanyards',
      'Full recruitment access & verified participant resume book',
    ],
  },
  {
    id: 'powered_by',
    name: 'Powered By Partner',
    amount: '₹2,50,000',
    color: 'from-purple-400 to-indigo-500',
    borderColor: 'border-purple-500/40',
    badge: 'POPULAR (2 SLOTS)',
    perks: [
      'Prominent co-branding across all digital & on-campus posters',
      'Hackathon or Flagship Coding Track problem statement naming',
      'Prime exhibition stall (15x15 ft) for live demos',
      'Social media shoutouts across 20k+ student impressions',
      'Direct interaction with shortlisted tech finalists',
    ],
  },
  {
    id: 'gold',
    name: 'Gold Sponsor',
    amount: '₹1,00,000',
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-500/40',
    badge: 'HIGH IMPACT',
    perks: [
      'Official logo on festival mainstage LED screen rotations',
      'Promotional flyer / merchandise included in attendee kit',
      'Dedicated exhibition booth (10x10 ft)',
      'Logo on official Parinaam website & social collaterals',
    ],
  },
  {
    id: 'category',
    name: 'Category / In-Kind Partner',
    amount: '₹25,000 - ₹50,000',
    color: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-500/40',
    badge: 'FLEXIBLE',
    perks: [
      'Exclusive sponsorship of individual club events or Pronite',
      'Cloud credits, developer tools, or food/beverage distribution',
      'Logo display on specific club banners & event certificates',
      'Brand acknowledgement in post-event press releases',
    ],
  },
];

const MOCK_CONTACTS = [
  {
    role: 'Head of Corporate Relations & Sponsorships',
    name: 'Srikanth Verma',
    phone: '+91 98765 43210',
    email: 'sponsorships@parinaam.fest',
    timing: '10:00 AM – 7:00 PM IST',
  },
  {
    role: 'Faculty Fest Convenor',
    name: 'Dr. M. Anand Kumar',
    phone: '+91 863 234 5678',
    email: 'convenor@parinaam.fest',
    timing: 'Amrita Vishwa Vidyapeetham, Amaravati',
  },
  {
    role: 'Industry Outreach Coordinator',
    name: 'Ananya Sen',
    phone: '+91 98112 34567',
    email: 'partners@parinaam.fest',
    timing: 'Corporate Partnerships & MoUs',
  },
];

export default function SponsorRegistrationPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    website: '',
    tier: 'powered_by',
    budget: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectTier = (tierId: string) => {
    setFormData((prev) => ({ ...prev, tier: tierId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock processing delay for realistic UX
    setTimeout(() => {
      const generatedId = `PAR-SPON-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      companyName: '',
      contactPerson: '',
      designation: '',
      email: '',
      phone: '',
      website: '',
      tier: 'powered_by',
      budget: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#05030a] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-3/4 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-purple-400 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-purple-400 font-semibold">SPONSOR PORTAL</span>
          </div>
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
            PARINAAM 2026 PARTNERSHIP
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-300">
            <Sparkles size={14} className="text-purple-400" />
            Connect with 4,000+ Future Tech Leaders
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Partner with <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">PARINAAM 2026</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Elevate your brand at Amrita Vishwa Vidyapeetham&apos;s premier national technical &amp; cultural festival. 
            Showcase your technologies, scout top engineering talent, and engage with visionary students across 35+ national events.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-left">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Users size={18} />
                <span className="text-xs font-mono">ATTENDEES</span>
              </div>
              <p className="text-2xl font-bold text-white">4,000+</p>
              <p className="text-xs text-slate-400">National footfall</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-pink-400 mb-1">
                <Trophy size={18} />
                <span className="text-xs font-mono">FLAGSHIPS</span>
              </div>
              <p className="text-2xl font-bold text-white">35+ Events</p>
              <p className="text-xs text-slate-400">Hackathons, CTF &amp; Wars</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Building2 size={18} />
                <span className="text-xs font-mono">CLUBS</span>
              </div>
              <p className="text-2xl font-bold text-white">12 Domains</p>
              <p className="text-xs text-slate-400">AI, Cyber, Cloud &amp; Arts</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Award size={18} />
                <span className="text-xs font-mono">PRIZE POOL</span>
              </div>
              <p className="text-2xl font-bold text-white">₹5 Lakhs+</p>
              <p className="text-xs text-slate-400">Cash &amp; grants</p>
            </div>
          </div>
        </div>

        {/* Success View */}
        {isSubmitted ? (
          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Sponsorship Request Received!
              </h2>
              <p className="text-sm text-slate-300">
                Thank you, <span className="font-semibold text-white">{formData.contactPerson || 'Partner'}</span>. 
                Your registration for <span className="font-semibold text-purple-300">{formData.companyName}</span> has been logged into our corporate desk.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-left font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-500">REFERENCE ID:</span>
                <span className="text-emerald-400 font-bold">{submissionId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-500">SELECTED TIER:</span>
                <span className="text-white uppercase">
                  {SPONSOR_TIERS.find((t) => t.id === formData.tier)?.name || formData.tier}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-500">OFFICIAL EMAIL:</span>
                <span className="text-white">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CONTACT NUMBER:</span>
                <span className="text-white">{formData.phone}</span>
              </div>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-200 text-left flex items-start gap-3">
              <Clock size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-0.5">Next Steps &amp; MoU Timeline</p>
                Our Head of Corporate Relations will contact you within <strong>24 business hours</strong> with the formal festival proposal deck, tier deliverables, and tax invoice / MoU guidelines.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Submit Another Request
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Return to Fest Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Tiers Grid */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Sponsorship Tiers &amp; Benefits</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Choose a tier that aligns with your company&apos;s visibility and recruitment targets.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 w-fit">
                  <ShieldCheck size={14} />
                  Amrita Tax Exemption &amp; Official Invoicing Available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {SPONSOR_TIERS.map((tier) => {
                  const isSelected = formData.tier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => handleSelectTier(tier.id)}
                      className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative bg-white/5 border ${
                        isSelected
                          ? `${tier.borderColor} ring-2 ring-purple-500/50 bg-white/[0.08]`
                          : 'border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
                      }`}
                    >
                      {/* Top Badge */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          {tier.badge}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={13} /> SELECTED
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-6">
                        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                        <p className={`text-xl font-extrabold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                          {tier.amount}
                        </p>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-300 mb-6 flex-1">
                        {tier.perks.map((perk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold shrink-0">✓</span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTier(tier.id);
                        }}
                        className={`w-full py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200'
                        }`}
                      >
                        {isSelected ? 'TIER SELECTED' : 'CHOOSE TIER'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registration Form & Contact Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Card (8 cols) */}
              <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <span className="text-xs font-mono text-purple-400 font-bold tracking-wider uppercase block">
                    STEP 2: CORPORATE DETAILS
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Register as an Official Sponsor</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out your brand information. Our corporate team will reach out with the agreement and custom deliverables.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        COMPANY / ORGANIZATION *
                      </label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          name="companyName"
                          required
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="e.g. Google Cloud, Razorpay, Red Bull"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Representative Name */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        CONTACT PERSON NAME *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          name="contactPerson"
                          required
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          placeholder="e.g. John Doe / Lead HR"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Work Email */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        OFFICIAL WORK EMAIL *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="partner@company.com"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        PHONE / WHATSAPP NUMBER *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Designation */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        DESIGNATION / ROLE
                      </label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          placeholder="e.g. Marketing Director, University Recruiter"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        COMPANY WEBSITE / LINKEDIN
                      </label>
                      <div className="relative">
                        <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://company.com"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Selected Tier Dropdown */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        SPONSORSHIP TIER *
                      </label>
                      <select
                        name="tier"
                        value={formData.tier}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      >
                        {SPONSOR_TIERS.map((t) => (
                          <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                            {t.name} ({t.amount})
                          </option>
                        ))}
                        <option value="custom" className="bg-slate-900 text-white">
                          Custom Partnership / In-Kind
                        </option>
                      </select>
                    </div>

                    {/* Budget / Contribution Estimate */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        ESTIMATED BUDGET / SUPPORT MODE
                      </label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="e.g. ₹2,00,000 or Swag & Cloud Credits"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message / Objectives */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      COLLABORATION OBJECTIVES / SPECIFIC REQUIREMENTS
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us if you want dedicated booth space, a custom hackathon challenge, or workshop sessions..."
                      className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting Sponsor Registration...
                      </span>
                    ) : (
                      <>
                        <span>Submit Sponsorship Registration</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500 font-mono">
                    By submitting, you agree to receive official sponsorship communications from the Parinaam 2026 Core Organizing Committee.
                  </p>
                </form>
              </div>

              {/* Contact Info & Help Desk (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Official Contact Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
                  <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold tracking-wider uppercase">
                    <Phone size={15} />
                    <span>CORPORATE DESK CONTACTS</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have queries about deliverables, CSR contributions, or custom track sponsorships? Contact our committee directly:
                  </p>

                  <div className="space-y-4">
                    {MOCK_CONTACTS.map((c, i) => (
                      <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-mono text-purple-300 uppercase block font-semibold">
                          {c.role}
                        </span>
                        <h4 className="text-sm font-bold text-white">{c.name}</h4>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p className="flex items-center gap-2">
                            <Phone size={12} className="text-slate-500" />
                            <a href={`tel:${c.phone}`} className="hover:text-purple-400 transition-colors">
                              {c.phone}
                            </a>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail size={12} className="text-slate-500" />
                            <a href={`mailto:${c.email}`} className="hover:text-purple-400 transition-colors">
                              {c.email}
                            </a>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Campus Address */}
                  <div className="pt-2 border-t border-white/10 text-xs text-slate-400 space-y-1">
                    <p className="flex items-start gap-2">
                      <MapPin size={14} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Amrita Vishwa Vidyapeetham</strong>
                        <br />
                        Amaravati Campus, Kuragallu, Guntur Dt, Andhra Pradesh - 522503
                      </span>
                    </p>
                  </div>
                </div>

                {/* Download Brochure Card */}
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-950/40 border border-purple-500/20 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-300">
                    <Download size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sponsorship Deck 2026</h4>
                  <p className="text-xs text-slate-400">
                    Detailed footfall breakdown, past marquee recruiters, and branding layout map.
                  </p>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Sponsorship Brochure (PDF) download request received. The comprehensive PDF deck will be dispatched to your email.');
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-mono text-purple-200 border border-white/10 transition-colors"
                  >
                    <span>Download Brochure (PDF)</span>
                  </a>
                </div>

                {/* Quick FAQ Mini-Box */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <HelpCircle size={15} className="text-purple-400" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <div className="space-y-2 text-slate-400">
                    <p>
                      <strong className="text-slate-200">Can we host a branded hackathon track?</strong>
                      <br />
                      Yes, Title and Powered By partners can sponsor tailored problem statements with designated jury seats.
                    </p>
                    <p>
                      <strong className="text-slate-200">Are student demo booths equipped with power &amp; Wi-Fi?</strong>
                      <br />
                      All sponsor booths receive dedicated 1Gbps high-speed Wi-Fi, power outlets, and display furniture.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
