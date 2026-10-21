'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

import Hero from '@/components/Hero';
import CreateRetreatSection from '@/components/CreateRetreatSection';
import SacredOfferingsSection from '@/components/SacredOfferingsSection';
import ManyPathsSection from '@/components/ManyPathsSection';
import CommunityStoriesSection from '@/components/CommunityStoriesSection';
import TestimonialsEditorialSection from '@/components/TestimonialsEditorialSection';
import GalleryShowcaseSection from '@/components/GalleryShowcaseSection';
import ClosingInvitationSection from '@/components/ClosingInvitationSection';

export default function HomePage() {
  useScrollReveal();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  return (
    <div className="relative min-h-screen bg-[#F5F1E8] text-[#2B3124] selection:bg-[#70765A]/25 selection:text-[#2B3124]">
      {/* 0. NAVIGATION WITH EDITORIAL MORPH */}
      <Navbar onEnquire={openEnquiry} />

      <main>
        {/* SECTION 1: CINEMATIC HERO & SCROLL PORTAL */}
        <Hero onEnquire={openEnquiry} />

        {/* SECTION 2: CREATE YOUR OWN PILGRIMAGE & RETREAT */}
        <CreateRetreatSection onEnquire={openEnquiry} />

        {/* SECTION 3: OUR SACRED OFFERINGS */}
        <SacredOfferingsSection onEnquire={openEnquiry} />

        {/* SECTION 4: MANY PATHS. ONE COMMUNITY. */}
        <ManyPathsSection onEnquire={openEnquiry} />

        {/* SECTION 5: COMMUNITY STORIES / THE SANGHA */}
        <CommunityStoriesSection />

        {/* SECTION 6: WORDS FROM THE PATH / TESTIMONIALS */}
        <TestimonialsEditorialSection />

        {/* SECTION 7: MOMENTS FROM THE PATH / GALLERY SHOWCASE */}
        <GalleryShowcaseSection />

        {/* SECTION 8: CLOSING INVITATION */}
        <ClosingInvitationSection onEnquire={openEnquiry} />
      </main>

      {/* FOOTER */}
      <Footer onEnquire={openEnquiry} />

      {/* ENQUIRY MODAL */}
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
