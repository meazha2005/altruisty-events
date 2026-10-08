'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  User,
  Lightbulb,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Copy,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Printer,
  Calendar,
  Phone,
  Mail,
  School,
  BookOpen,
} from 'lucide-react';
import { RazorpayOptions } from '@/types/razorpay';

export interface MemberState {
  name: string;
  email: string;
  phone: string;
  college_name: string;
  dept: string;
  year_of_study: string;
}

const YEAR_OPTIONS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Pre-final)',
  '4th Year (Final Year)',
  'Post Graduate / Masters',
];

const DOMAIN_OPTIONS = [
  { value: 'edu tech', label: 'Edu Tech' },
  { value: 'saas', label: 'SaaS' },
  { value: 'heath care', label: 'Health Care' },
  { value: 'cyber security', label: 'Cyber Security' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'bio medical', label: 'Bio Medical' },
  { value: 'hardware', label: 'Hardware & IoT' },
  { value: 'automations', label: 'Automations & AI' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'open innovation', label: 'Open Innovation' },
];

interface RegistrationFormProps {
  selectedDomain?: string;
}

export default function RegistrationForm({ selectedDomain }: RegistrationFormProps) {
  const [teamSize, setTeamSize] = useState<number>(2);
  const [teamName, setTeamName] = useState<string>('');
  const [ideaTitle, setIdeaTitle] = useState<string>('');
  const [domain, setDomain] = useState<string>('edu tech');
  const [description, setDescription] = useState<string>('');

  // Initial Members Array (Up to 4 members)
  const [members, setMembers] = useState<MemberState[]>([
    { name: '', email: '', phone: '', college_name: '', dept: '', year_of_study: '3rd Year (Pre-final)' },
    { name: '', email: '', phone: '', college_name: '', dept: '', year_of_study: '3rd Year (Pre-final)' },
    { name: '', email: '', phone: '', college_name: '', dept: '', year_of_study: '3rd Year (Pre-final)' },
    { name: '', email: '', phone: '', college_name: '', dept: '', year_of_study: '3rd Year (Pre-final)' },
  ]);

  // Sync selectedDomain if passed from external section
  useEffect(() => {
    if (selectedDomain) {
      setDomain(selectedDomain);
    }
  }, [selectedDomain]);

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    teamId: string;
    teamName: string;
    paymentId: string;
    amount: number;
    emailSent: boolean;
  } | null>(null);

  // Helper to update individual member field
  const handleMemberChange = (index: number, field: keyof MemberState, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      if (field === 'phone') {
        // Enforce numeric only and max 10 digits
        const numeric = value.replace(/\D/g, '').slice(0, 10);
        updated[index] = { ...updated[index], [field]: numeric };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  // "Same as Leader" individual field copy
  const copyFromLeader = (targetIndex: number, field: 'college_name' | 'dept' | 'year_of_study') => {
    const leaderVal = members[0][field];
    if (!leaderVal) {
      alert(`Please fill Leader's ${field.replace('_', ' ')} first!`);
      return;
    }
    setMembers((prev) => {
      const updated = [...prev];
      updated[targetIndex] = { ...updated[targetIndex], [field]: leaderVal };
      return updated;
    });
  };

  // "Copy all academic details from Leader" (college, dept, year)
  const copyAllFromLeader = (targetIndex: number) => {
    const leader = members[0];
    if (!leader.college_name && !leader.dept) {
      alert("Please fill Leader's College Name and Department first!");
      return;
    }
    setMembers((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        college_name: leader.college_name,
        dept: leader.dept,
        year_of_study: leader.year_of_study,
      };
      return updated;
    });
  };

  // Validate form client-side
  const validateForm = (): string | null => {
    if (!teamName.trim()) return 'Please enter a Team Name.';
    if (!ideaTitle.trim()) return 'Please enter your Idea Title.';
    if (!domain) return 'Please select an Innovation Domain.';
    if (!description.trim() || description.trim().length < 20) {
      return 'Please enter a description for your idea (at least 20 characters).';
    }

    const emails = new Set<string>();
    const phones = new Set<string>();

    for (let i = 0; i < teamSize; i++) {
      const m = members[i];
      const label = i === 0 ? 'Team Leader' : `Member ${i + 1}`;

      if (!m.name.trim()) return `Please enter the name for ${label}.`;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!m.email.trim() || !emailRegex.test(m.email.trim())) {
        return `Please enter a valid email address for ${label}.`;
      }

      if (emails.has(m.email.trim().toLowerCase())) {
        return `Duplicate email found: ${m.email} is already entered for another member.`;
      }
      emails.add(m.email.trim().toLowerCase());

      if (m.phone.length !== 10) {
        return `Phone number for ${label} must be exactly 10 digits.`;
      }

      if (phones.has(m.phone)) {
        return `Duplicate phone number found for ${label}.`;
      }
      phones.add(m.phone);

      if (!m.college_name.trim()) return `Please enter College Name for ${label}.`;
      if (!m.dept.trim()) return `Please enter Department for ${label}.`;
      if (!m.year_of_study.trim()) return `Please select Year of Study for ${label}.`;
    }

    return null;
  };

  // Submit and launch Razorpay checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const error = validateForm();
    if (error) {
      setFormError(error);
      window.scrollTo({ top: document.getElementById('register')?.offsetTop || 0, behavior: 'smooth' });
      return;
    }

    if (typeof window.Razorpay === 'undefined') {
      setFormError('Payment gateway script is loading. Please verify internet connection or refresh.');
      return;
    }

    setLoading(true);

    try {
      const activeMembers = members.slice(0, teamSize);

      // Step 1: Create Order on backend (₹149 = 14900 paise)
      const res = await fetch('/api/register/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: teamName.trim(),
          teamSize,
          ideaTitle: ideaTitle.trim(),
          domain,
          description: description.trim(),
          members: activeMembers,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment.');
      }

      // Step 2: Launch Razorpay Modal
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'HACKPICK 2026',
        description: `Team Registration Fee (₹149) - ${teamName}`,
        image: '/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: members[0].name,
          email: members[0].email,
          contact: members[0].phone,
        },
        theme: {
          color: '#0284c7', // Brand cyan/blue
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (paymentResponse) => {
          try {
            // Step 3: Verify Payment Signature on backend
            const verifyRes = await fetch('/api/register/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                teamId: orderData.teamId,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            // Success! Trigger celebratory confetti
            confetti({
              particleCount: 140,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#00b4d8', '#0284c7', '#2563eb', '#10b981'],
            });

            setSuccessData({
              teamId: verifyData.teamId,
              teamName: verifyData.teamName || teamName,
              paymentId: verifyData.paymentId,
              amount: verifyData.amount || 149,
              emailSent: verifyData.emailSent,
            });
          } catch (verifyErr: unknown) {
            const msg = verifyErr instanceof Error ? verifyErr.message : 'Verification failed';
            setFormError(`Payment received but verification encountered an issue: ${msg}. Please contact altruistybusiess@gmail.com with your payment reference.`);
          } finally {
            setLoading(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setFormError(msg);
      setLoading(false);
    }
  };

  return (
    <section id="register" className="py-20 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ROUND 1 REGISTRATION PORTAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b192c] font-heading">
            Register Your <span className="text-gradient">Team</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Registration Fee: <span className="text-emerald-600 font-extrabold">₹149 / Team</span> (Covers all 2 to 4 members)
          </p>
        </div>

        {/* Success Modal / Ticket View */}
        {successData ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-white border border-emerald-200 shadow-xl text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
              Registration & Payment Successful
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-[#0b192c] mt-4 font-heading">
              Welcome to HACKPICK 2026!
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              Your team <strong className="text-sky-600">{successData.teamName}</strong> has been successfully registered for Round 1. Confirmation emails have been sent to all registered team members.
            </p>

            {/* Pass / Receipt Card */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Team Registration ID</div>
                  <div className="text-xl sm:text-2xl font-mono font-black text-sky-700 tracking-wider">
                    {successData.teamId}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(successData.teamId);
                    alert('Team ID copied to clipboard!');
                  }}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy ID
                </button>
              </div>

              <div className="py-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Team Name:</span>
                  <span className="font-bold text-[#0b192c]">{successData.teamName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Razorpay Payment ID:</span>
                  <span className="font-mono text-slate-700">{successData.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="text-emerald-600 font-extrabold">₹{successData.amount} (Paid)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confirmation Email:</span>
                  <span className={successData.emailSent ? 'text-sky-700 font-bold' : 'text-amber-700 font-bold'}>
                    {successData.emailSent ? '✓ Sent to all team members' : 'Queued for delivery'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 border border-slate-300 shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-sky-600" /> Print Receipt / Save PDF
                </button>
                <button
                  onClick={() => {
                    setSuccessData(null);
                    setTeamName('');
                    setIdeaTitle('');
                    setDescription('');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white text-center shadow-xs"
                >
                  Register Another Team
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Error Banner */}
            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold">Please check: </span>
                  {formError}
                </div>
              </div>
            )}

            {/* PART 1: TEAM & PROJECT INFO */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5 text-sky-700 font-bold text-lg mb-6 pb-3 border-b border-slate-100">
                <Lightbulb className="w-5 h-5 text-sky-600" />
                <span>1. Project & Team Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Team Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Team Name <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ByteBusters, Nexus Innovators"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                  />
                </div>

                {/* Team Size Selector (2 to 4) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Team Size (2 to 4 Members) <span className="text-sky-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4].map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setTeamSize(size)}
                        className={`py-3 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                          teamSize === size
                            ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>{size} Members</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Total ₹149 entry fee covers all {teamSize} members.
                  </p>
                </div>

                {/* Domain Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Innovation Domain <span className="text-sky-600">*</span>
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-500 text-sm capitalize"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Idea Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Idea Title <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI-driven Crop Disease Diagnostic Scanner"
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Description of the Idea Title <span className="text-sky-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your project: problem statement, technical approach, key features, and impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm resize-y"
                  />
                  <div className="text-[11px] text-slate-400 text-right mt-1">
                    Minimum 20 characters
                  </div>
                </div>

              </div>
            </div>

            {/* PART 2: LEADER & MEMBER DETAILS */}
            <div className="space-y-6">
              
              {/* Member 1: Leader */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-300 shadow-sm relative overflow-hidden ring-1 ring-sky-500/10">
                <div className="absolute top-0 right-0 bg-sky-100 py-1 px-4 rounded-bl-xl text-[11px] font-bold text-sky-800 uppercase tracking-wider border-b border-l border-sky-200">
                  👑 Team Leader
                </div>

                <div className="flex items-center gap-2.5 text-sky-700 font-bold text-lg mb-6 pb-3 border-b border-slate-100">
                  <User className="w-5 h-5 text-sky-600" />
                  <span>Leader (Member 1 Details)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Leader Name <span className="text-sky-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={members[0].name}
                      onChange={(e) => handleMemberChange(0, 'name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-sky-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={members[0].email}
                      onChange={(e) => handleMemberChange(0, 'email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                    />
                  </div>

                  {/* Phone (10 digits) */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Phone (10 Nos.) <span className="text-sky-600">*</span>
                      </label>
                      <span className={`text-[11px] font-mono font-semibold ${members[0].phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {members[0].phone.length}/10
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={members[0].phone}
                        onChange={(e) => handleMemberChange(0, 'phone', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* College Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      College Name <span className="text-sky-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anna University / IIT Madras"
                      value={members[0].college_name}
                      onChange={(e) => handleMemberChange(0, 'college_name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Department (Dept) <span className="text-sky-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science and Engineering"
                      value={members[0].dept}
                      onChange={(e) => handleMemberChange(0, 'dept', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                    />
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Year of Study <span className="text-sky-600">*</span>
                    </label>
                    <select
                      value={members[0].year_of_study}
                      onChange={(e) => handleMemberChange(0, 'year_of_study', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-500 text-sm"
                    >
                      {YEAR_OPTIONS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Members 2 to 4 */}
              {[1, 2, 3].slice(0, teamSize - 1).map((idx) => {
                const memberNumber = idx + 1;
                const m = members[idx];

                return (
                  <div
                    key={memberNumber}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
                  >
                    {/* Header with Quick Fill Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 text-[#0b192c] font-bold text-lg">
                        <User className="w-5 h-5 text-slate-400" />
                        <span>Member {memberNumber} Details</span>
                      </div>

                      {/* One-click fill all from leader button */}
                      <button
                        type="button"
                        onClick={() => copyAllFromLeader(idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all self-start sm:self-auto"
                      >
                        <Copy className="w-3.5 h-3.5 text-sky-600" />
                        <span>Copy College, Dept & Year from Leader</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Member {memberNumber} Name <span className="text-sky-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Full name"
                          value={m.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Member {memberNumber} Email <span className="text-sky-600">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="Email address"
                          value={m.email}
                          onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                        />
                      </div>

                      {/* Phone (10 digits) */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Phone (10 Nos.) <span className="text-sky-600">*</span>
                          </label>
                          <span className={`text-[11px] font-mono font-semibold ${m.phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {m.phone.length}/10
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={m.phone}
                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm font-mono"
                          />
                        </div>
                      </div>

                      {/* College Name with "Same as leader" button */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            College Name <span className="text-sky-600">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => copyFromLeader(idx, 'college_name')}
                            className="text-[11px] font-bold text-sky-600 hover:text-sky-800 underline flex items-center gap-1"
                          >
                            Same as Leader
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="College name"
                          value={m.college_name}
                          onChange={(e) => handleMemberChange(idx, 'college_name', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                        />
                      </div>

                      {/* Department with "Same as leader" button */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Department <span className="text-sky-600">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => copyFromLeader(idx, 'dept')}
                            className="text-[11px] font-bold text-sky-600 hover:text-sky-800 underline flex items-center gap-1"
                          >
                            Same as Leader
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Department"
                          value={m.dept}
                          onChange={(e) => handleMemberChange(idx, 'dept', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                        />
                      </div>

                      {/* Year of Study with "Same as leader" button */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Year of Study <span className="text-sky-600">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => copyFromLeader(idx, 'year_of_study')}
                            className="text-[11px] font-bold text-sky-600 hover:text-sky-800 underline flex items-center gap-1"
                          >
                            Same as Leader
                          </button>
                        </div>
                        <select
                          value={m.year_of_study}
                          onChange={(e) => handleMemberChange(idx, 'year_of_study', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-500 text-sm"
                        >
                          {YEAR_OPTIONS.map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* PART 3: PAYMENT SUMMARY & CHECKOUT */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-300 shadow-md">
              <div className="flex items-center gap-2.5 text-sky-700 font-bold text-lg mb-6 pb-3 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-sky-600" />
                <span>3. Payment Summary & Checkout</span>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>HackPick Team Entry Fee ({teamSize} Members)</span>
                  <span className="font-bold text-[#0b192c]">₹149.00</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Platform & Processing Fee</span>
                  <span className="text-emerald-600 font-bold">FREE (Waived)</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-base font-bold text-[#0b192c]">Total Payable Amount</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-sky-700 font-mono">₹149</span>
                    <span className="text-xs text-slate-500 block font-medium">Flat fee per team</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Connecting to Razorpay Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-yellow-300" />
                    <span>Proceed to Pay ₹149 & Complete Registration</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 text-center">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Secure Razorpay Payment
                </span>
                <span>•</span>
                <span>Confirmation Email Sent to All {teamSize} Members</span>
                <span>•</span>
                <span>Support: 8667839838</span>
              </div>

            </div>

          </form>
        )}

      </div>
    </section>
  );
}
