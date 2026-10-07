'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import { Sparkles, X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'pilgrimages' | 'retreats' | 'music' | 'himalayas' | 'people' | 'sacred-places';
  location: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    url: 'https://images.pexels.com/photos/38902559/pexels-photo-38902559.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Sunrise Over Annapurna Range',
    category: 'himalayas',
    location: 'Sarangkot, Nepal',
    description: 'Golden morning sunlight breaking over Fishtail Peak during our Nepal Retreat.'
  },
  {
    id: 'g2',
    url: 'https://images.pexels.com/photos/32225795/pexels-photo-32225795.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Boudhanath Stupa Prayer Flags',
    category: 'sacred-places',
    location: 'Kathmandu, Nepal',
    description: 'Hundreds of colorful prayer flags fluttering in the breeze surrounding the ancient white stupa dome.'
  },
  {
    id: 'g3',
    url: 'https://images.pexels.com/photos/32436570/pexels-photo-32436570.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Devotional Kirtan by the Bonfire',
    category: 'music',
    location: 'Harsil Valley, Himalayas',
    description: 'Harmonium and acoustic guitars echoing through the pine forests during the Himalayan Bhakti Retreat.'
  },
  {
    id: 'g4',
    url: 'https://images.pexels.com/photos/31874584/pexels-photo-31874584.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Silent Mountain Walk',
    category: 'retreats',
    location: 'Annapurna Foothills',
    description: 'Participants walking in quiet mindfulness through green rhododendron paths.'
  },
  {
    id: 'g5',
    url: 'https://images.pexels.com/photos/32261503/pexels-photo-32261503.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Red Canyons of Upper Mustang',
    category: 'pilgrimages',
    location: 'Upper Mustang, Nepal',
    description: 'Wind-carved desert rock cliffs leading to the walled royal city of Lo Manthang.'
  },
  {
    id: 'g6',
    url: 'https://images.pexels.com/photos/34792307/pexels-photo-34792307.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Ganga River Meditation at Dawn',
    category: 'retreats',
    location: 'Rishikesh Ganga Beach',
    description: 'Practicing morning pranayama and silent reflection by pristine river waters.'
  },
  {
    id: 'g7',
    url: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Pilgrims Gathering at Pashupati',
    category: 'people',
    location: 'Pashupatinath Temple',
    description: 'Intimate conversation with traditional sadhus and wisdom keepers.'
  },
  {
    id: 'g8',
    url: 'https://images.pexels.com/photos/29622178/pexels-photo-29622178.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Evening Ganga Aarti Lights',
    category: 'sacred-places',
    location: 'Bagmati Riverbank',
    description: 'Rhythmic brass lamp ceremonies illuminating the evening sky.'
  },
  {
    id: 'g9',
    url: 'https://images.pexels.com/photos/36520323/pexels-photo-36520323.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Reflections on Glacial Stream',
    category: 'himalayas',
    location: 'Harsil Valley',
    description: 'Turquoise waters rushing down snow-melt Himalayan rivers.'
  }
];

type CategoryFilter = 'all' | 'pilgrimages' | 'retreats' | 'music' | 'himalayas' | 'people' | 'sacred-places';

export default function GalleryPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="relative min-h-screen bg-near-black text-ivory">
      <Navbar onEnquire={openEnquiry} />

      <main className="pt-28 pb-24">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-antique-gold/30 bg-antique-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-antique-gold mb-6 backdrop-blur-md">
            <Sparkles size={12} />
            <span>Visual Archive</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-ivory tracking-tight">
            The Gallery
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base font-light leading-relaxed text-stone/70">
            A curated photographic collection of sacred places, mountain stillness, devotional music, and authentic human moments across our pilgrimages and retreats.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-b border-antique-gold/15 pb-6">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'pilgrimages', label: 'Pilgrimages' },
              { id: 'retreats', label: 'Retreats' },
              { id: 'music', label: 'Music & Sound' },
              { id: 'himalayas', label: 'Himalayas' },
              { id: 'sacred-places', label: 'Sacred Temples' },
              { id: 'people', label: 'People' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wide font-medium transition-all ${activeCategory === cat.id
                    ? 'bg-antique-gold text-near-black border border-antique-gold font-semibold shadow-md'
                    : 'bg-charcoal/60 text-stone/60 border border-antique-gold/15 hover:text-ivory'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Masonry / Grid Gallery */}
        <section className="mx-auto max-w-[1400px] px-6 md:px-12 mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative cursor-pointer overflow-hidden border border-antique-gold/15 bg-charcoal/40 aspect-[4/3] transition-all hover:border-antique-gold/50"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-cover img-zoom"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/90 via-near-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-ultra text-antique-gold font-medium">
                        {item.location}
                      </span>
                      <h3 className="font-serif text-lg font-light text-ivory">{item.title}</h3>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-antique-gold/20 text-antique-gold flex items-center justify-center border border-antique-gold/30">
                      <ZoomIn size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-near-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fade-up"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-ivory hover:text-antique-gold p-2 z-10"
            aria-label="Close image lightbox"
          >
            <X size={28} />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col md:flex-row bg-charcoal border border-antique-gold/30 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 bg-black flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
            <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-antique-gold/20">
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-antique-gold font-semibold">
                  {selectedImage.location}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-light text-ivory">
                  {selectedImage.title}
                </h3>
                <p className="mt-4 text-xs font-light leading-relaxed text-stone/70">
                  {selectedImage.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-antique-gold/10">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    openEnquiry();
                  }}
                  className="w-full py-3 border border-antique-gold text-center text-xs font-semibold uppercase tracking-wide text-antique-gold hover:bg-antique-gold hover:text-near-black transition-all"
                >
                  Enquire About Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
