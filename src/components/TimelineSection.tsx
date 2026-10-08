'use client';

import React from 'react';
import { Calendar, CheckCircle2, Clock, Trophy, Laptop, MapPin, Flag, ChevronRight } from 'lucide-react';

export default function TimelineSection() {
  const timelineStages = [
    {
      stage: 'Registration Opens',
      date: 'October 8, 2026',
      desc: 'Online registration begins for teams of 2 to 4 members with ₹149 entry fee.',
      status: 'Current',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      stage: 'Registration Closes',
      date: 'October 20, 2026',
      desc: 'Final deadline for Round 1 online idea submission and payment.',
      status: 'Upcoming',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      stage: 'Round 1 Results',
      date: 'November 2, 2026',
      desc: 'Evaluation panel selects the Top 100 teams to advance to Round 2.',
      status: 'Upcoming',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      stage: 'Round 2 – Online Presentation',
      date: 'November 2026 – Weekend',
      desc: 'Top 100 teams deliver online PPT presentations before the expert jury.',
      status: 'Upcoming',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      stage: 'Round 2 Results',
      date: 'By November End',
      desc: 'Top 25 shortlisted finalist teams qualify for the Offline Grand Finale.',
      status: 'Upcoming',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      stage: 'Round 3 – Grand Finale',
      date: 'December 5, 2026',
      desc: 'Top 25 teams compete in the final offline showdown.',
      status: 'Upcoming',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      stage: 'Final Venue',
      date: 'Revealed to Top 25 Teams',
      desc: 'Exclusive physical venue details shared directly with the Top 25 finalist teams.',
      status: 'Special',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  ];

  return (
    <section id="timeline" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-bold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>EVENT TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b192c] font-heading">
            🗓️ Official <span className="text-gradient">Event Schedule</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Mark your calendar. Every milestone from submission to the grand stage.
          </p>
        </div>

        {/* Timeline Table / Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Stage</th>
                  <th className="py-4 px-6">Date / Schedule</th>
                  <th className="py-4 px-6">Details</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {timelineStages.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0b192c] whitespace-nowrap">
                      {item.stage}
                    </td>
                    <td className="py-4 px-6 font-semibold text-sky-700 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 min-w-[240px]">
                      {item.desc}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-sky-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              💡 <strong>Note:</strong> Selected teams will receive round-by-round briefing kits via their registered emails.
            </div>
            <a
              href="#register"
              className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              Register your team before Oct 20 <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
