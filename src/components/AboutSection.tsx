'use client';

import React from 'react';
import {
  Laptop,
  MonitorPlay,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Rocket,
  Award,
} from 'lucide-react';

export default function AboutSection() {
  const rounds = [
    {
      number: 'ROUND 1',
      title: 'Online Idea / Project Submission',
      badge: 'Registration Open',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description:
        'Submit your innovative idea or project title online and take the first step toward the HackPick Grand Finale.',
      icon: Laptop,
      details: [
        { label: 'Registration Fee', value: '₹149 per team' },
        { label: 'Registration Opens', value: 'October 8, 2026' },
        { label: 'Last Date', value: 'October 20, 2026' },
        { label: 'Round 1 Results', value: 'November 2, 2026' },
      ],
      advancement: 'Top 100 Teams advance to Round 2',
      highlight: true,
    },
    {
      number: 'ROUND 2',
      title: 'Top 100 Online PPT Presentation',
      badge: 'Evaluation Stage',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      description:
        'The Top 100 teams will present their ideas/projects through an online PPT presentation before the evaluation panel.',
      icon: MonitorPlay,
      details: [
        { label: 'Mode', value: 'Online Presentation' },
        { label: 'Schedule', value: 'Saturday/Sunday (Nov 2026)' },
        { label: 'Round 2 Results', value: 'By the end of November 2026' },
      ],
      advancement: 'Top 25 Teams advance to the Grand Finale',
      highlight: false,
    },
    {
      number: 'ROUND 3',
      title: 'Top 25 Offline Grand Finale',
      badge: 'Championship Round',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description:
        'The Top 25 teams will compete in the final offline presentation round and showcase their solutions before the jury.',
      icon: MapPin,
      details: [
        { label: 'Grand Finale Date', value: 'December 5, 2026' },
        { label: 'Final Venue', value: 'Revealed to Selected Top 25 Teams' },
      ],
      advancement: 'Top 3 Winners & Best Performing Team Awarded',
      highlight: false,
    },
  ];

  const eligibility = [
    'Innovative ideas',
    'Technology-driven projects',
    'Real-world problem-solving solutions',
    'Prototypes or working models',
    'A passion for innovation and entrepreneurship',
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-bold mb-3">
            <Rocket className="w-3.5 h-3.5" />
            <span>ABOUT HACKPICK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b192c] font-heading">
            Transform Ideas Into <span className="text-gradient">Impactful Solutions</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            <strong>HackPick</strong> is a National Level Hackathon that gives students and innovators an opportunity to transform ideas into impactful solutions, compete through multiple stages, and gain recognition, prizes, and career opportunities.
          </p>
        </div>

        {/* 3 Rounds Cards */}
        <div id="rounds" className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b192c] font-heading">
              Competition <span className="text-sky-600">Stages</span>
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              A 3-stage journey designed to find and elevate India&apos;s most promising projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rounds.map((round, idx) => {
              const Icon = round.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 sm:p-7 bg-white border flex flex-col justify-between transition-all duration-200 ${
                    round.highlight
                      ? 'border-sky-300 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black tracking-widest text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                        {round.number}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${round.badgeColor}`}>
                        {round.badge}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h4 className="text-lg font-bold text-[#0b192c] mb-2">
                      {round.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {round.description}
                    </p>

                    {/* Stage key dates */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs">
                      {round.details.map((d, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">{d.label}:</span>
                          <span className="text-[#0b192c] font-bold">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50/80 px-3 py-1.5 rounded-lg w-full justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      <span>{round.advancement}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Who Can Participate Section */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-2xl bg-sky-100/70 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-10 h-10" />
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
                <span>Eligibility Criteria</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0b192c] font-heading mb-3">
                🎓 Who Can Participate?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                HackPick is open to all students, collegiate builders, and aspiring innovators with:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {eligibility.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
