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
    id: 'fg1',
    url: '/phots_for_gallery/DSC03924.JPG',
    title: 'Himalayan Trekking Trail',
    category: 'himalayas',
    location: 'Nepal Himalayas',
    description: 'Breathtaking mountain trails winding through high-altitude Himalayan valleys.'
  },
  {
    id: 'fg2',
    url: '/phots_for_gallery/DSC04045.JPG',
    title: 'Devotional Kirtan & Chanting',
    category: 'music',
    location: 'Nepal Retreat',
    description: 'Chanting sacred mantras and devotional music during our mountain immersion.'
  },
  {
    id: 'fg3',
    url: '/phots_for_gallery/DSC04254.JPG',
    title: 'Sacred Mountain Sanctuary',
    category: 'sacred-places',
    location: 'Muktinath Valley, Nepal',
    description: 'Ancient mountain shrines surrounded by majestic high-altitude peaks.'
  },
  {
    id: 'fg4',
    url: '/phots_for_gallery/DSC04529.JPG',
    title: 'Group Meditation & Circle',
    category: 'retreats',
    location: 'Nepal Valley',
    description: 'Morning meditation and satsang circle in the peaceful mountain air.'
  },
  {
    id: 'fg5',
    url: '/phots_for_gallery/DSC04798.JPG',
    title: 'Poon Hill Himalayan Vista',
    category: 'himalayas',
    location: 'Poon Hill, Nepal',
    description: 'Panoramic views of Annapurna snow-capped range bathed in morning light.'
  },
  {
    id: 'fg6',
    url: '/phots_for_gallery/DSC04907.JPG',
    title: 'Cultural Village Walk',
    category: 'people',
    location: 'Nepalese Village',
    description: 'Connecting with warm local communities and traditional Himalayan villagers.'
  },
  {
    id: 'fg7',
    url: '/phots_for_gallery/DSC04914.JPG',
    title: 'Kathmandu Temple Reflections',
    category: 'sacred-places',
    location: 'Kathmandu, Nepal',
    description: 'Intricate wood carvings and serene courtyards of ancient Nepalese temples.'
  },
  {
    id: 'fg8',
    url: '/phots_for_gallery/DSC04916.JPG',
    title: 'Pokhara Lakeside Serenity',
    category: 'retreats',
    location: 'Pokhara, Nepal',
    description: 'Gentle lake waters offering stillness before ascending into the high mountains.'
  },
  {
    id: 'fg9',
    url: '/phots_for_gallery/KAthmandu 3.png',
    title: 'Heritage Courtyard',
    category: 'sacred-places',
    location: 'Kathmandu Valley',
    description: 'Exploring UNESCO world heritage stupas and shrines.'
  },
  {
    id: 'fg10',
    url: '/phots_for_gallery/Kathmandu 2.png',
    title: 'Boudhanath Stupa Serenity',
    category: 'sacred-places',
    location: 'Kathmandu, Nepal',
    description: 'Sacred stupa surrounded by spinning prayer wheels and chanting monks.'
  },
  {
    id: 'fg11',
    url: '/phots_for_gallery/Nepal 4.avif',
    title: 'Alpine Forest Trail',
    category: 'himalayas',
    location: 'Annapurna Conservation Area',
    description: 'Walking through lush pine and rhododendron forests in quiet mindfulness.'
  },
  {
    id: 'fg12',
    url: '/phots_for_gallery/Nepal 5.avif',
    title: 'High Altitude Pass View',
    category: 'himalayas',
    location: 'Mustang Region',
    description: 'Reaching high Himalayan ridges with vast panoramic horizon views.'
  },
  {
    id: 'fg13',
    url: '/phots_for_gallery/Nepal 6.png',
    title: 'Himalayan Sunrise Glow',
    category: 'himalayas',
    location: 'Nepal Peaks',
    description: 'First rays of sun illuminating golden snow ridges across the horizon.'
  },
  {
    id: 'fg14',
    url: '/phots_for_gallery/Nepal 7.png',
    title: 'River Valley Sanctuary',
    category: 'retreats',
    location: 'Himalayan Stream',
    description: 'Resting by pristine glacial streams flowing down sacred mountain slopes.'
  },
  {
    id: 'fg15',
    url: '/phots_for_gallery/Nepalese woman.png',
    title: 'Heart Connection & Hospitality',
    category: 'people',
    location: 'Local Himalayan Home',
    description: 'Authentic encounters and welcoming smiles from local Himalayan wisdom keepers.'
  },
  {
    id: 'fg16',
    url: '/phots_for_gallery/Pokhara 2.png',
    title: 'Phewa Lake Reflections',
    category: 'retreats',
    location: 'Pokhara, Nepal',
    description: 'Tranquil lake waters reflecting snow-capped peaks in silent contemplation.'
  },
  {
    id: 'fg17',
    url: '/phots_for_gallery/Poon hill.jpg',
    title: 'Poon Hill Panorama',
    category: 'himalayas',
    location: 'Poon Hill, Nepal',
    description: 'Standing above the clouds at dawn with 360-degree views of Himalayan giants.'
  },
  {
    id: 'fg18',
    url: '/phots_for_gallery/Temples.png',
    title: 'Ancient Shrine Sanctuary',
    category: 'sacred-places',
    location: 'Pashupatinath, Nepal',
    description: 'Sacred temple complexes along the riverbank filled with timeless devotion.'
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
