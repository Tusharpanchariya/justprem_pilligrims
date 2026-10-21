'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import NepalHero from '@/components/NepalHero';
import Intro from '@/components/Intro';
import MountainStatement from '@/components/MountainStatement';
import JourneyTimeline from '@/components/JourneyTimeline';
import Experiences from '@/components/Experiences';
import DayInHimalayas from '@/components/DayInHimalayas';
import Guides from '@/components/Guides';
import Testimonials from '@/components/Testimonials';
import PhotoJournal from '@/components/PhotoJournal';
import Package from '@/components/Package';
import Included from '@/components/Included';
import NepalFAQ from '@/components/NepalFAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function NepalPilgrimageOriginalView() {
  useScrollReveal();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  return (
    <div className="relative min-h-screen bg-near-black">
      <Navbar onEnquire={openEnquiry} />
      <main>
        <NepalHero onEnquire={openEnquiry} />
        <Intro />
        <JourneyTimeline />
        <Experiences />
        <DayInHimalayas />
        <Guides />
        <MountainStatement />
        <Testimonials />
        <PhotoJournal />
        <Package onEnquire={openEnquiry} />
        <Included />
        <NepalFAQ />
        <FinalCTA onEnquire={openEnquiry} />
      </main>
      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
