'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                <Image
                  src="/logo.png"
                  alt="HackPick"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-black text-[#0b192c] font-heading">
                  HACK<span className="text-sky-600">PICK</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  National Level Hackathon
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-xs max-w-md leading-relaxed">
              <strong>HackPick</strong> is a National Level Hackathon organized by <strong>Altruisty Innovation</strong> that gives students and innovators an opportunity to transform ideas into impactful solutions, compete through multiple stages, and gain recognition, prizes, and career opportunities.
            </p>

            <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Razorpay Verified Live Merchant • Secure Payments</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[#0b192c] font-bold text-sm uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#about" className="hover:text-sky-600 transition-colors">
                  About Event
                </a>
              </li>
              <li>
                <a href="#rounds" className="hover:text-sky-600 transition-colors">
                  3 Stages & Rounds
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-sky-600 transition-colors">
                  Prizes & Internships
                </a>
              </li>
              <li>
                <a href="#domains" className="hover:text-sky-600 transition-colors">
                  10 Innovation Domains
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-sky-600 transition-colors">
                  Event Timeline
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-sky-600 transition-colors font-bold text-sky-700">
                  Register Now (₹149)
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-sky-600">
                  Admin Dashboard Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="text-[#0b192c] font-bold text-sm uppercase tracking-wider mb-4">
              Contact Organizers
            </h4>
            <ul className="space-y-3 font-medium">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <a
                  href="tel:8667839838"
                  className="hover:text-sky-600 text-[#0b192c] font-bold transition-colors"
                >
                  8667839838
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:altruistybusiess@gmail.com"
                  className="hover:text-sky-600 text-slate-700 transition-colors break-all"
                >
                  altruistybusiess@gmail.com
                </a>
              </li>
              <li className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Altruisty Innovation • All registered teams receive automated confirmation emails.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 Altruisty Innovation. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for National Student Innovators
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-600 hover:text-[#0b192c] font-semibold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
