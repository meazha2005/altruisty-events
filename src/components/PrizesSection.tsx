'use client';

import React from 'react';
import { Trophy, Award, Briefcase, DollarSign, Medal, Star, CheckCircle } from 'lucide-react';

export default function PrizesSection() {
  const prizes = [
    {
      place: '1st Prize',
      rankBadge: '🥇 WINNER',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      cardBorder: 'border-amber-300 shadow-amber-500/10 shadow-lg',
      cash: '₹10,000',
      perks: [
        '₹10,000 Direct Cash Prize',
        'Internship Opportunity',
        'Internship with Monthly Stipend',
        'Winner Trophy & Certificate of Excellence',
      ],
      popular: true,
    },
    {
      place: '2nd Prize',
      rankBadge: '🥈 1ST RUNNER UP',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      cardBorder: 'border-slate-200 shadow-sm',
      cash: '₹8,000',
      perks: [
        '₹8,000 Direct Cash Prize',
        'Internship Opportunity',
        'Internship with Monthly Stipend',
        'Certificate of Excellence',
      ],
      popular: false,
    },
    {
      place: '3rd Prize',
      rankBadge: '🥉 2ND RUNNER UP',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      cardBorder: 'border-slate-200 shadow-sm',
      cash: '₹6,000',
      perks: [
        '₹6,000 Direct Cash Prize',
        'Internship Opportunity',
        'Internship with Monthly Stipend',
        'Certificate of Excellence',
      ],
      popular: false,
    },
  ];

  return (
    <section id="prizes" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>EXCELLENCE REWARDED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b192c] font-heading">
            🏆 Prizes & <span className="text-amber-600">Recognition</span>
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Compete on a national platform for lucrative cash rewards, certified accolades, and career-launching stipendiary internships.
          </p>
        </div>

        {/* 3 Main Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {prizes.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-7 bg-white border flex flex-col justify-between transition-all duration-300 relative ${p.cardBorder}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${p.badgeColor}`}>
                    {p.rankBadge}
                  </span>
                  {p.popular && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
                      Champion
                    </span>
                  )}
                </div>

                <div className="text-xl font-bold text-[#0b192c] mb-1">{p.place}</div>

                <div className="my-5">
                  <span className="text-4xl font-black text-[#0b192c] font-mono tracking-tight">
                    {p.cash}
                  </span>
                  <span className="text-xs text-slate-500 block mt-1 font-semibold">
                    Direct Cash Award
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Included Rewards:
                  </div>
                  {p.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <a
                  href="#register"
                  className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold block bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Compete for {p.place} →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Special Award: Best Performing Team */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">Special Category</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Honorable Mention</span>
              </div>
              <h4 className="text-xl font-black text-[#0b192c] font-heading mt-0.5">
                ⭐ Best Performing Team
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                The Best Performing Team evaluated by the jury will also be awarded an exclusive <strong>Internship with Stipend</strong> & Certificate!
              </p>
            </div>
          </div>

          <a
            href="#register"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            Register Your Team (₹149)
          </a>
        </div>

      </div>
    </section>
  );
}
