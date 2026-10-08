'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who is eligible to participate in HackPick?',
      a: 'HackPick is open to all college and university students with innovative ideas, technology-driven projects, real-world solutions, or working prototypes across India. Passion for innovation and problem solving is all you need!',
    },
    {
      q: 'What is the team size and registration fee?',
      a: 'Each team can have 2 to 4 members. The registration fee is a flat ₹149 per team, which covers all registered members.',
    },
    {
      q: 'What are the key stages in the hackathon?',
      a: 'Round 1 is an online idea/project submission (closes Oct 20). The Top 100 teams advance to Round 2 (Online PPT Presentation in November 2026). The Top 25 teams advance to Round 3 (Offline Grand Finale on December 5, 2026).',
    },
    {
      q: 'What prizes and internship opportunities are offered?',
      a: '1st Prize: ₹10,000 Cash Prize. 2nd Prize: ₹8,000 Cash Prize. 3rd Prize: ₹6,000 Cash Prize. The Top 3 Winning Teams will also receive an Internship Opportunity with Stipend & Certificate. The Best Performing Team will also receive an Internship with Stipend!',
    },
    {
      q: 'Can members be from different colleges or departments?',
      a: 'Yes! Cross-college and cross-department teams are completely allowed. We encourage multidisciplinary teams combining technical, design, and domain skills.',
    },
    {
      q: 'How will I receive payment confirmation and next steps?',
      a: 'Immediately after your ₹149 payment is completed through Razorpay, a digital confirmation ticket is displayed on screen, and an official confirmation email is automatically sent to all team members with your unique Team ID.',
    },
  ];

  return (
    <section id="faqs" className="py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b192c] font-heading">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Everything you need to know about HackPick rounds, prizes, and guidelines.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-[#0b192c] hover:text-sky-600 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-sky-600 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
