'use client';

import React from 'react';
import {
  GraduationCap,
  Cloud,
  HeartPulse,
  ShieldAlert,
  Wallet,
  Dna,
  Cpu,
  Bot,
  Sprout,
  Lightbulb,
  ArrowUpRight,
} from 'lucide-react';

export interface DomainItem {
  id: string;
  name: string;
  icon: React.ElementType;
  tagline: string;
  ideas: string;
  bgLight: string;
  iconColor: string;
  borderColor: string;
}

export const DOMAINS: DomainItem[] = [
  {
    id: 'edu tech',
    name: 'Edu Tech',
    icon: GraduationCap,
    tagline: 'Transforming Education & Learning',
    ideas: 'Adaptive learning, AR/VR classrooms, AI tutoring, skill tracking & vernacular education.',
    bgLight: 'bg-sky-50',
    iconColor: 'text-sky-600',
    borderColor: 'border-sky-200 group-hover:border-sky-400',
  },
  {
    id: 'saas',
    name: 'SaaS',
    icon: Cloud,
    tagline: 'Software as a Service & Cloud Tools',
    ideas: 'Workflow automations, B2B productivity, micro-SaaS, real-time analytics & client portals.',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200 group-hover:border-blue-400',
  },
  {
    id: 'heath care',
    name: 'Health Care',
    icon: HeartPulse,
    tagline: 'Digital Health & Patient Care',
    ideas: 'Telemedicine, patient triage, AI diagnostics, smart prescription tools & hospital management.',
    bgLight: 'bg-rose-50',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200 group-hover:border-rose-400',
  },
  {
    id: 'cyber security',
    name: 'Cyber Security',
    icon: ShieldAlert,
    tagline: 'Defending Systems & Privacy',
    ideas: 'Threat detection, phishing shields, zero-trust protocols, authentication & vulnerability tools.',
    bgLight: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200 group-hover:border-amber-400',
  },
  {
    id: 'fintech',
    name: 'FinTech',
    icon: Wallet,
    tagline: 'Next-Gen Financial Technologies',
    ideas: 'Smart expense management, fraud detection, micro-investing, UPI innovations & credit scoring.',
    bgLight: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200 group-hover:border-emerald-400',
  },
  {
    id: 'bio medical',
    name: 'Bio Medical',
    icon: Dna,
    tagline: 'Biotechnology & Medical Devices',
    ideas: 'Wearable biosensors, genomic data tools, assistive tech, smart prosthetics & vital monitoring.',
    bgLight: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200 group-hover:border-purple-400',
  },
  {
    id: 'hardware',
    name: 'Hardware & IoT',
    icon: Cpu,
    tagline: 'Embedded Systems & Smart Devices',
    ideas: 'IoT sensor hubs, smart cities, edge computing, smart metering, robotics & industrial gadgets.',
    bgLight: 'bg-orange-50',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200 group-hover:border-orange-400',
  },
  {
    id: 'automations',
    name: 'Automations',
    icon: Bot,
    tagline: 'AI Agents & Process Automation',
    ideas: 'Autonomous robotic agents, RPA, smart customer bots, document processing & auto-schedulers.',
    bgLight: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-200 group-hover:border-teal-400',
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: Sprout,
    tagline: 'AgriTech & Sustainable Farming',
    ideas: 'Soil quality AI, crop disease scanners, precision irrigation, weather alerts & farm-to-fork chain.',
    bgLight: 'bg-lime-50',
    iconColor: 'text-lime-700',
    borderColor: 'border-lime-200 group-hover:border-lime-400',
  },
  {
    id: 'open innovation',
    name: 'Open Innovation',
    icon: Lightbulb,
    tagline: 'Wildcard Solutions & Breakthroughs',
    ideas: 'Climate tech, smart mobility, logistics, disaster management or any creative idea of your choice!',
    bgLight: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-600',
    borderColor: 'border-fuchsia-200 group-hover:border-fuchsia-400',
  },
];

interface DomainsSectionProps {
  onSelectDomain?: (domainId: string) => void;
}

export default function DomainsSection({ onSelectDomain }: DomainsSectionProps) {
  const handleSelect = (domainId: string) => {
    if (onSelectDomain) {
      onSelectDomain(domainId);
    }
    const regSection = document.getElementById('register');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="domains" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold mb-3">
            <span>INNOVATION TRACKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b192c] font-heading tracking-tight">
            10 Challenging <span className="text-gradient">Domains</span>
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Pick the arena where your idea shines best. Click any domain below to jump directly into registration!
          </p>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                onClick={() => handleSelect(domain.id)}
                className={`group cursor-pointer p-5 rounded-2xl bg-white border ${domain.borderColor} hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-2xs`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${domain.bgLight} border border-slate-200/60 ${domain.iconColor} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sky-600 text-xs font-bold flex items-center gap-0.5">
                      Select <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0b192c] group-hover:text-sky-600 transition-colors">
                    {domain.name}
                  </h3>
                  <div className="text-xs text-sky-700 font-semibold mt-0.5 mb-2.5">
                    {domain.tagline}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {domain.ideas}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-sky-600 font-bold">
                  <span>Register in track</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
