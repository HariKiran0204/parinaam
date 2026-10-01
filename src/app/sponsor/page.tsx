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
  CreditCard,
  Lock,
  Download,
  HelpCircle,
  Clock,
  MapPin,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const SPONSOR_PACKAGES = [
  {
    id: 'associate',
    tierName: 'ASSOCIATE PARTNER',
    amount: '₹1,00,000+',
    amountNumber: 100000,
    badge: 'BRAND PARTNER',
    color: 'from-amber-700/80 to-red-900/80',
    borderColor: 'border-amber-700/50',
    accentColor: 'text-amber-300',
    ringColor: 'ring-amber-600/40',
    perks: [
      'Logo on standees & banners across all 12 events',
      'Branding at 2–3 club events of your choice',
      'Shout-out on Instagram & LinkedIn posts',
      'Logo on participant digital certificates',
      'Mention during event announcements',
    ],
  },
  {
    id: 'co_sponsor',
    tierName: 'CO-SPONSOR',
    amount: '₹2,50,000+',
    amountNumber: 250000,
    badge: 'CO-SPONSOR',
    color: 'from-red-900/90 to-amber-900/90',
    borderColor: 'border-red-600/50',
    accentColor: 'text-rose-300',
    ringColor: 'ring-rose-500/50',
    perks: [
      'Everything in Associate Partner, plus:',
      'Logo on the main stage backdrop',
      'On-campus stall / booth space, all 3 days',
      'Branding across all 12 events + DJ Night',
      'Dedicated social media feature post',
      'Mention at prize distribution ceremonies',
    ],
  },
  {
    id: 'title_sponsor',
    tierName: 'TITLE SPONSOR',
    amount: '₹5,00,000+',
    amountNumber: 500000,
    badge: 'TITLE PARTNER',
    color: 'from-amber-600/80 to-yellow-600/80',
    borderColor: 'border-amber-400/60',
    accentColor: 'text-amber-400',
    ringColor: 'ring-amber-400/50',
    perks: [
      'Everything in Co-Sponsor, plus:',
      '"Presented by [Brand]" naming rights',
      'Logo on the DJ Night stage — peak footfall',
      'Premium booth placement, all 3 days',
      'Brand activation / speaking slot',
      'Logo on all print, digital & ID-card collateral',
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
    tier: 'co_sponsor',
    budget: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const selectedPackage =
    SPONSOR_PACKAGES.find((pkg) => pkg.id === formData.tier) || SPONSOR_PACKAGES[1];

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

    // Realistic mock submission
    setTimeout(() => {
      const generatedId = `PAR-SPON-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
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
      tier: 'co_sponsor',
      budget: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#05030a] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-14 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold">THE PACKAGES</span>
          </div>
          <span className="bg-red-900/30 text-amber-300 border border-amber-600/30 px-3 py-0.5 rounded-full font-semibold">
            PARINAAM 2026 SPONSORSHIP
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-amber-300">
            <Sparkles size={14} className="text-amber-400" />
            THE PACKAGES
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 bg-clip-text text-transparent">
              Level of Partnership
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Three ways to partner with PARINAAM 2026, from focused club branding to full title-sponsor visibility.
          </p>
        </div>

        {/* Success Confirmation View */}
        {isSubmitted ? (
          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Sponsorship Registration Received!
              </h2>
              <p className="text-sm text-slate-300">
                Thank you, <span className="font-semibold text-white">{formData.contactPerson || 'Partner'}</span>. 
                Your registration for <span className="font-semibold text-amber-300">{formData.companyName}</span> has been logged.
              </p>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-xl p-4 text-left font-mono text-xs space-y-2.5 text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-500">REFERENCE ID:</span>
                <span className="text-emerald-400 font-bold">{submissionId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-slate-500">CHOSEN PACKAGE:</span>
                <span className="text-amber-400 font-bold">
                  {selectedPackage.tierName} ({selectedPackage.amount})
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

            {/* Display-Only Payment Section in Success View */}
            <div className="bg-white/5 border border-amber-500/30 rounded-xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                  <CreditCard size={16} />
                  <span>PAYMENT &amp; INVOICING (PREVIEW ONLY)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DISPLAY ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Package Amount: <strong className="text-white">{selectedPackage.amount}</strong> + applicable university GST receipts.
              </p>
              <div className="p-3 bg-black/40 rounded-lg text-xs text-slate-400 border border-white/5 flex items-center justify-between">
                <span>Payment Gateway Integration:</span>
                <span className="text-amber-300 font-mono text-[11px]">Integration will be added later</span>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 text-left flex items-start gap-3">
              <Clock size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-0.5">MoU &amp; Onboarding</p>
                Our Corporate Relations team will reach out within <strong>24 business hours</strong> with the formal festival proposal deck, tax invoice guidelines, and MoU agreement.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
              >
                Register Another Package
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Return to Fest Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* 3 Packages Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPONSOR_PACKAGES.map((pkg) => {
                const isSelected = formData.tier === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectTier(pkg.id)}
                    className={`cursor-pointer rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between relative bg-white/5 border ${
                      isSelected
                        ? `${pkg.borderColor} ring-2 ${pkg.ringColor} bg-white/[0.08] shadow-2xl`
                        : 'border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
                    }`}
                  >
                    {/* Header Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded bg-black/40 text-amber-200 border border-white/10 uppercase">
                        {pkg.badge}
                      </span>
                      {isSelected ? (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 size={14} /> SELECTED
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">
                          Click to select
                        </span>
                      )}
                    </div>

                    {/* Tier Name & Amount */}
                    <div className="space-y-1 mb-6 border-b border-white/10 pb-4">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                        {pkg.tierName}
                      </h3>
                      <p className={`text-2xl sm:text-3xl font-black ${pkg.accentColor}`}>
                        {pkg.amount}
                      </p>
                    </div>

                    {/* Perks List */}
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300 mb-8 flex-1">
                      {pkg.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                          <span className={perk.includes('Everything in') ? 'font-semibold text-white' : ''}>
                            {perk}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Select Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTier(pkg.id);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-900/40'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ SELECTED PACKAGE' : 'SELECT THIS PACKAGE'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Banner Quote */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-red-950/30 to-black/60 border border-amber-600/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles size={24} />
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                Partner with <strong>PARINAAM 2026</strong> and connect your brand with <em>technology, creativity, automobiles, competitions and entertainment</em>.
              </p>
            </div>

            {/* Registration Form & Corporate Desk */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Card (8 cols) */}
              <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs font-mono text-amber-400 font-bold tracking-wider uppercase block">
                    SPONSOR REGISTRATION FORM
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Register Your Company as a Sponsor
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Selected package:{' '}
                    <strong className="text-amber-300">{selectedPackage.tierName} ({selectedPackage.amount})</strong>. 
                    Fill in your details below.
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
                          placeholder="e.g. Acme Corp / Red Bull"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Contact Person */}
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
                          placeholder="e.g. John Doe / Partnerships Lead"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Work Email */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        OFFICIAL EMAIL *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="sponsor@company.com"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
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
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
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
                          placeholder="e.g. Brand Marketing Manager"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
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
                          placeholder="https://acme.corp"
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Package Selector */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        CHOSEN PACKAGE *
                      </label>
                      <select
                        name="tier"
                        value={formData.tier}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                      >
                        {SPONSOR_PACKAGES.map((pkg) => (
                          <option key={pkg.id} value={pkg.id} className="bg-slate-900 text-white">
                            {pkg.tierName} ({pkg.amount})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Budget Notes */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        BUDGET OR IN-KIND DETAILS
                      </label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder={`Default: ${selectedPackage.amount} (or custom)`}
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Requirements / Message */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      SPECIAL REQUIREMENTS / PREFERRED CLUB EVENTS
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="e.g. Preferred club events to sponsor (Chakravyuha coding, Robotics RoboWars, etc.) or booth requirements..."
                      className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none"
                    />
                  </div>

                  {/* ========================================= */}
                  {/* PAYMENT SECTION (DISPLAY-ONLY AS REQUESTED) */}
                  {/* ========================================= */}
                  <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-black/40 to-red-950/20 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-amber-400" />
                        <span className="text-sm font-bold text-white tracking-wide">
                          Payment Section
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 w-fit">
                        Display Only • Integration Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-slate-500 block font-mono text-[10px]">SELECTED TIER</span>
                        <span className="font-bold text-white">{selectedPackage.tierName}</span>
                      </div>
                      <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-slate-500 block font-mono text-[10px]">CONTRIBUTION</span>
                        <span className="font-extrabold text-amber-400">{selectedPackage.amount}</span>
                      </div>
                      <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-slate-500 block font-mono text-[10px]">GATEWAY STATUS</span>
                        <span className="text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                          <Lock size={12} className="text-amber-400" /> Inactive (Placeholder)
                        </span>
                      </div>
                    </div>

                    {/* Mock Payment Options (Disabled Preview) */}
                    <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 space-y-2 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-slate-300">
                          Supported Gateways (Coming Soon):
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="px-2 py-0.5 bg-white/10 rounded">UPI</span>
                          <span className="px-2 py-0.5 bg-white/10 rounded">Razorpay</span>
                          <span className="px-2 py-0.5 bg-white/10 rounded">NEFT / RTGS</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-amber-200/80 leading-relaxed">
                        ℹ️ <em>Note: Payment gateway integration will be added here in the next update. Registering now records your package interest with the sponsorship team.</em>
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-900/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting Sponsor Registration...
                      </span>
                    ) : (
                      <>
                        <span>Register as a Sponsor</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500 font-mono">
                    Official Amrita Vishwa Vidyapeetham fest partnership protocol.
                  </p>
                </form>
              </div>

              {/* Mock Contacts & Help Desk (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Official Contact Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase">
                    <Phone size={15} />
                    <span>CORPORATE DESK CONTACTS</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Need custom branding, booth dimensions, or invoice inquiries? Contact our team directly:
                  </p>

                  <div className="space-y-3.5">
                    {MOCK_CONTACTS.map((c, i) => (
                      <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-mono text-amber-300 uppercase block font-semibold">
                          {c.role}
                        </span>
                        <h4 className="text-sm font-bold text-white">{c.name}</h4>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p className="flex items-center gap-2">
                            <Phone size={12} className="text-slate-500" />
                            <a href={`tel:${c.phone}`} className="hover:text-amber-400 transition-colors">
                              {c.phone}
                            </a>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail size={12} className="text-slate-500" />
                            <a href={`mailto:${c.email}`} className="hover:text-amber-400 transition-colors">
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
                      <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Amrita Vishwa Vidyapeetham</strong>
                        <br />
                        Amaravati Campus, Kuragallu, Guntur Dt, Andhra Pradesh - 522503
                      </span>
                    </p>
                  </div>
                </div>

                {/* Brochure Card */}
                <div className="bg-gradient-to-br from-amber-950/30 to-black/60 border border-amber-600/30 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-300">
                    <Download size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-white">Download Partnership Deck</h4>
                  <p className="text-xs text-slate-400">
                    Official Parinaam 2026 PDF brochure containing full campus event maps &amp; past sponsors.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Sponsorship Brochure download initiated. The PDF will also be sent to your email.');
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-mono text-amber-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    <span>Download Brochure (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
