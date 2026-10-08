'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Sparkles, UserCheck, Trophy } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 border border-sky-100 flex items-center justify-center shadow-sm group-hover:border-sky-300 transition-all">
              <Image
                src="/logo.png"
                alt="HackPick Logo"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-[#0b192c] font-heading">
                  HACK<span className="text-sky-600">PICK</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                  2026
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                National Level Hackathon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#about" className="hover:text-sky-600 transition-colors">
              About
            </a>
            <a href="#rounds" className="hover:text-sky-600 transition-colors">
              Rounds & Timeline
            </a>
            <a href="#prizes" className="hover:text-sky-600 transition-colors flex items-center gap-1 text-amber-600">
              <Trophy className="w-3.5 h-3.5" />
              Prizes (₹24K+)
            </a>
            <a href="#domains" className="hover:text-sky-600 transition-colors">
              10 Domains
            </a>
            <a href="#faqs" className="hover:text-sky-600 transition-colors">
              FAQs
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-black bg-slate-100 border border-slate-200"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
            >
              About HackPick
            </a>
            <a
              href="#rounds"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
            >
              Rounds & Timeline
            </a>
            <a
              href="#prizes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-amber-700 hover:bg-amber-50 font-medium flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" /> Prizes & Recognition
            </a>
            <a
              href="#domains"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
            >
              Innovation Tracks (10 Domains)
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
            >
              Frequently Asked Questions
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-sky-700 hover:bg-sky-50 font-medium flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> Organizer Admin Portal
            </Link>
          </div>

          <div className="pt-2">
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-md"
            >
              <span>Register Now • ₹149 Only</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
