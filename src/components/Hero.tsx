'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Award,
  Users,
  Calendar,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Briefcase,
} from 'lucide-react';

export default function Hero() {
  // Target: October 20, 2026 23:59:59
  const [timeLeft, setTimeLeft] = useState({
    days: 11,
    hours: 23,
    minutes: 45,
    seconds: 12,
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-20T23:59:59').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 bg-white overflow-hidden bg-light-radial">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Altruisty Innovation Presents</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span className="text-slate-900 font-bold">Registration Opens October 8, 2026</span>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Logo Showcase on White */}
          <div className="flex justify-center mb-6">
            <div className="relative group p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-sky-500/5 hover:border-sky-300 transition-all duration-300">
              <div className="relative w-72 sm:w-96 md:w-[480px] h-32 sm:h-44 md:h-52">
                <Image
                  src="/logo.png"
                  alt="HACKPICK - National Level Hackathon"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-102"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Slogan */}
          <div className="inline-block mb-3">
            <span className="text-sm sm:text-base font-extrabold tracking-widest uppercase text-sky-600 bg-sky-50 px-4 py-1 rounded-full border border-sky-200">
              Ideate. Build. Present.
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0b192c] tracking-tight font-heading mb-4">
            National Level <span className="text-gradient">Hackathon 2026</span>
          </h1>

          {/* Subtitle from user prompt */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal mb-8 px-2">
            HackPick is a National Level Hackathon that gives students and innovators an opportunity to transform ideas into impactful solutions, compete through multiple stages, and gain recognition, prizes, and career opportunities.
          </p>

          {/* Key Value Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto mb-10 text-left">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all shadow-xs">
              <div className="flex items-center gap-1.5 text-sky-600 text-xs font-bold mb-1">
                <Users className="w-4 h-4" /> Team Size
              </div>
              <div className="text-base font-extrabold text-[#0b192c]">2 - 4 Members</div>
              <div className="text-[11px] text-slate-500">Any college or dept</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
                <Award className="w-4 h-4" /> Entry Fee
              </div>
              <div className="text-base font-extrabold text-emerald-600">₹149 / Team</div>
              <div className="text-[11px] text-slate-500">Flat fee for whole team</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all shadow-xs">
              <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold mb-1">
                <Trophy className="w-4 h-4" /> Cash Prizes
              </div>
              <div className="text-base font-extrabold text-[#0b192c]">₹24,000+</div>
              <div className="text-[11px] text-slate-500">₹10K, ₹8K, ₹6K Cash</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all shadow-xs">
              <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold mb-1">
                <Briefcase className="w-4 h-4" /> Career
              </div>
              <div className="text-base font-extrabold text-[#0b192c]">Internships</div>
              <div className="text-[11px] text-slate-500">With Monthly Stipend</div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-700 shadow-xl shadow-sky-500/25 flex items-center justify-center gap-3 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 group"
            >
              <span>REGISTER NOW — ₹149 / TEAM</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#rounds"
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore 3 Rounds & Timeline</span>
            </a>
          </div>

          {/* Countdown Clock (Target: Last Date: October 20, 2026) */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Registration Closes On: October 20, 2026</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-xl sm:text-2xl font-black text-[#0b192c] font-mono">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Days
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-xl sm:text-2xl font-black text-[#0b192c] font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Hours
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-xl sm:text-2xl font-black text-[#0b192c] font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Mins
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-xl sm:text-2xl font-black text-sky-600 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Secs
                </span>
              </div>
            </div>
          </div>

          {/* Trust bullets */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Email Confirmation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Secure Live Razorpay Gateway
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Participation Certificates for All
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
