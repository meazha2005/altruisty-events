'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import PrizesSection from '@/components/PrizesSection';
import DomainsSection from '@/components/DomainsSection';
import TimelineSection from '@/components/TimelineSection';
import RegistrationForm from '@/components/RegistrationForm';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('edu tech');

  const handleSelectDomain = (domainId: string) => {
    setSelectedDomain(domainId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <PrizesSection />
        <DomainsSection onSelectDomain={handleSelectDomain} />
        <TimelineSection />
        <RegistrationForm selectedDomain={selectedDomain} />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
