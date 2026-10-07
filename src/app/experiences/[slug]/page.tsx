'use client';

import { useState, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import ExperienceDetailView from '@/components/ExperienceDetailView';
import { getExperienceBySlug, experiences } from '@/data/experiences';

interface ExperienceSlugPageProps {
  params: {
    slug: string;
  };
}

export default function ExperienceSlugPage({ params }: ExperienceSlugPageProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  const experience = getExperienceBySlug(params.slug) || experiences[0];

  return (
    <div className="relative min-h-screen bg-near-black">
      <Navbar onEnquire={openEnquiry} />
      <main>
        <ExperienceDetailView experience={experience} onEnquire={openEnquiry} />
      </main>
      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
