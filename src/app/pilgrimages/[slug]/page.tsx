'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import ExperienceDetailView from '@/components/ExperienceDetailView';
import NepalPilgrimageOriginalView from '@/components/NepalPilgrimageOriginalView';
import { getExperienceBySlug } from '@/data/experiences';

interface PilgrimageDetailPageProps {
  params: {
    slug: string;
  };
}

export default function PilgrimageDetailPage({ params }: PilgrimageDetailPageProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  const isNepal =
    params.slug === 'nepal-sacred-himalayas' ||
    params.slug === 'nepal' ||
    params.slug.toLowerCase().includes('nepal');

  if (isNepal) {
    return <NepalPilgrimageOriginalView />;
  }

  const experience = getExperienceBySlug(params.slug);

  if (!experience) {
    return <NepalPilgrimageOriginalView />;
  }

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
