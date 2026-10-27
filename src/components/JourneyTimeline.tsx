'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { images } from '@/data/images';

export interface Destination {
  num: string;
  name: string;
  desc: string;
  img: string;
  elevation?: string;
  story: string;
}

const destinations: Destination[] = [
  {
    num: '01',
    name: 'Kathmandu',
    desc: 'Ancient temples &middot; sacred beginnings &middot; living culture',
    img: '/places_images/kathmandu2.jpg',
    elevation: '~1,400 m',
    story:
      'Kathmandu is the capital city of Nepal and the starting point of our retreat for discovering the country’s rich culture and spiritual heritage. Ancient temples, traditional architecture, and lively local markets will offer us a first glimpse into Nepal’s traditions and everyday life.',
  },
  {
    num: '02',
    name: 'Pokhara',
    desc: 'Lakeside serenity &middot; gateway to the mountains',
    img: '/places_images/pokhara2.jpg',
    elevation: '~822 m',
    story:
      'Pokhara is a picturesque lakeside city with stunning views of the Annapurna range. Set beside Phewa Lake, it offers a peaceful transition from the lively streets of Kathmandu to the Himalayan landscapes ahead. Beyond preparing for our trek towards Muktinath, we can explore local spiritual sites, including the Shiva temple at Pumdikot and the island shrine of Tal Barahi.',
  },
  {
    num: '03',
    name: 'Tadapani',
    desc: 'Dense rhododendron forests &middot; mountain vistas',
    img: images.pj2,
    elevation: '~2,630 m',
    story:
      'Tadapani is a small mountain settlement at around 2,630 metres, surrounded by rhododendron forests and offering beautiful Himalayan views. It’s a peaceful stop along our trekking route and a place to get acquainted with the traditions of the Gurung people. Its name is often translated as “far water,” showing the rich cultural heritage of mountain life in Nepal.',
  },
  {
    num: '04',
    name: 'Chomrong',
    desc: 'Stone steps &middot; heart of the Annapurna sanctuary',
    img: '/places_images/chomrong.webp',
    elevation: '~2,165 m',
    story:
      'Chomrong is a beautiful mountain village at around 2,165 metres, often known as the Gateway to Annapurna Base Camp. With its traditional mountain atmosphere and stunning views of the surrounding Himalayan peaks, it will offer us a chance to rest and experience life in the mountains.',
  },
  {
    num: '05',
    name: 'Poon Hill',
    desc: 'Golden sunrise &middot; panoramic Himalayan peaks',
    img: '/places_images/poonhill.jpg',
    elevation: '~3,210 m',
    story:
      'At around 3,210 metres it is one of Nepal’s most famous Himalayan viewpoints, famous for its breathtaking sunrise over the Annapurna and Dhaulagiri ranges. The early morning climb will reward us with panoramic mountain views as the first rays of sunlight illuminate the snow-capped peaks.',
  },
  {
    num: '06',
    name: 'Tatopani',
    desc: 'Natural hot springs &middot; deep river valleys',
    img: '/places_images/tatopani.jpg',
    elevation: '~1,190 m',
    story:
      'Tatopani, meaning “hot water” in Nepali, is a peaceful mountain village known for its natural hot springs in the Kali Gandaki Valley. Surrounded by lush greenery and mountain scenery, it will offer us a welcome opportunity to relax in the warm mineral waters and rest after days of trekking through the Himalayas.',
  },
  {
    num: '07',
    name: 'Marpha',
    desc: 'Apple orchards &middot; whitewashed stone houses',
    img: '/places_images/marpha.jpg',
    elevation: '~2,670 m',
    story:
      'Marpha is a charming mountain village in the Mustang region, known for its whitewashed houses, narrow stone-paved streets, and traditional Thakali architecture. Surrounded by apple orchards, it is famous for its local apple products and offers a glimpse into the rich cultural heritage and peaceful rhythms of life in the Himalayas.',
  },
  {
    num: '08',
    name: 'Jomsom',
    desc: 'Windswept landscapes &middot; the Kali Gandaki gorge',
    img: images.pj7,
    elevation: '~2,720 m',
    story:
      'Jomsom is a mountain town at around 2,720 metres in Nepal’s Mustang region, known for its strong winds and dramatic landscapes of the Kali Gandaki Valley. An important stop on the way to Muktinath, it offers a glimpse into the region’s unique Tibetan-influenced culture and spiritual traditions.',
  },
  {
    num: '09',
    name: 'Kagbeni',
    desc: 'Ancient fortress &middot; gateway to Upper Mustang',
    img: images.pj8,
    elevation: '~2,800 m',
    story:
      'Kagbeni is an ancient mountain village at around 2,800 metres in the Kali Gandaki Valley, known for its narrow stone streets, traditional mud-brick houses, and historic Buddhist monastery. Once it was an important stop on the ancient salt trade route to Tibet, but also a traditional gateway on the journey to Muktinath, where the landscapes and spiritual heritage of the Himalayas blend.',
  },
  {
    num: '10',
    name: 'Muktinath',
    desc: 'Sacred Retreat &middot; spiritual liberation',
    img: '/places_images/muktinath.jpg',
    elevation: '~3,800 m',
    story:
      'Muktinath Temple, situated at around 3,800 metres in Nepal’s Mustang region, is our final destination and the culmination of our Himalayan retreat. Sacred to both Hindus and Buddhists, it is famous for its 108 water spouts, an eternal flame, and its high-altitude setting. Its name is traditionally interpreted as “Lord of Liberation,” symbolising the spiritual significance of reaching this sacred place.',
  },
];

export default function JourneyTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Drag tracking to distinguish between a click (open pop-up) and a drag (scroll slider)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll > 0) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    }

    const cardWidth = 332;
    const calculatedIndex = Math.min(
      destinations.length - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );
    setActiveIndex(calculatedIndex);
  };

  // Auto-play / continuous movement effect
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animateScroll = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused && !selectedDestination && scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;

        if (maxScroll > 0) {
          el.scrollLeft += delta * 0.05;
          if (el.scrollLeft >= maxScroll - 1) {
            el.scrollLeft = 0;
          }
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, selectedDestination]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Keyboard accessibility and body scroll lock for pop-up modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDestination(null);
      } else if (e.key === 'ArrowRight' && selectedDestination) {
        navigateModal(1);
      } else if (e.key === 'ArrowLeft' && selectedDestination) {
        navigateModal(-1);
      }
    };

    if (selectedDestination) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedDestination]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 332;
    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  const handleCardClick = (d: Destination, index: number) => {
    if (isDraggingRef.current) return;
    setSelectedDestination(d);
    setActiveIndex(index);
  };

  const navigateModal = useCallback(
    (direction: number) => {
      if (!selectedDestination) return;
      const currentIndex = destinations.findIndex((d) => d.num === selectedDestination.num);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + destinations.length) % destinations.length;
      setSelectedDestination(destinations[nextIndex]);
      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex);
    },
    [selectedDestination]
  );

  return (
    <section id="journey" className="relative bg-charcoal px-6 py-28 md:px-12 md:py-40 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] bg-antique-gold/5 blur-[140px] rounded-full" />

      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <h2 className="reveal font-serif text-3xl font-light text-ivory md:text-5xl lg:text-6xl">
            Places We Are Visiting
          </h2>
          <p className="reveal reveal-delay-1 mt-3 font-sans text-[11px] uppercase tracking-[0.22em] text-antique-gold/80">
            Click on any destination to discover its story
          </p>
        </div>

        {/* Desktop Horizontal Slider */}
        <div
          className="hidden lg:block relative group/slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseDown={(e) => {
            setIsPaused(true);
            startXRef.current = e.clientX;
            isDraggingRef.current = false;
          }}
          onMouseMove={(e) => {
            if (e.buttons === 1 && Math.abs(e.clientX - startXRef.current) > 5) {
              isDraggingRef.current = true;
            }
          }}
          onMouseUp={() => setIsPaused(false)}
        >
          {/* Timeline Connector Line */}
          <div className="absolute left-0 right-0 top-[220px] h-[1px] bg-gradient-to-r from-transparent via-antique-gold/25 to-transparent pointer-events-none" />

          {/* Scrollable Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-10 pt-2 px-2 -mx-2 hide-scrollbar cursor-grab active:cursor-grabbing select-none"
          >
            {destinations.map((d, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={d.num}
                  onClick={() => handleCardClick(d, i)}
                  className="group relative w-[300px] flex-shrink-0 cursor-pointer transition-all duration-500"
                >
                  {/* Image Card Container */}
                  <div className="relative mb-6 h-[210px] rounded border border-antique-gold/20 shadow-2xl overflow-hidden group-hover:border-antique-gold/70 group-hover:shadow-[0_10px_30px_rgba(169,137,94,0.18)] transition-all duration-500">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="img-zoom h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Subtle click indicator pill */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#E9E5DC] backdrop-blur-md border border-antique-gold/30 opacity-80 group-hover:opacity-100 group-hover:border-antique-gold transition-all duration-300">
                      <span>Explore</span>
                      <span className="text-antique-gold">&#8594;</span>
                    </div>

                    {/* Active Highlight Glow Border */}
                    {isActive && (
                      <div className="absolute inset-0 border border-antique-gold/50 pointer-events-none" />
                    )}
                  </div>

                  {/* Marker Dot along timeline line */}
                  <div className="relative mb-6 flex justify-center items-center">
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-antique-gold/40 -z-10" />
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-antique-gold ring-4 ring-antique-gold/20 scale-125'
                          : 'bg-charcoal border border-antique-gold/60 group-hover:bg-antique-gold/70'
                      }`}
                    />
                  </div>

                  {/* Text Details */}
                  <div className="text-center px-2">
                    <h3 className="mb-2 font-serif text-2xl font-light tracking-wide text-ivory group-hover:text-antique-gold transition-colors duration-300">
                      {d.name}
                    </h3>
                    <p
                      className="text-center text-[10.5px] uppercase leading-relaxed tracking-wider text-stone/60 group-hover:text-stone/90 transition-colors duration-300 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: d.desc }}
                    />
                    <span className="mt-2.5 inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.18em] text-antique-gold/70 group-hover:text-antique-gold transition-colors">
                      Learn More &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fade edge overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-charcoal to-transparent opacity-80" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-charcoal to-transparent opacity-80" />

          {/* Premium Progress Track */}
          <div className="mt-8 flex items-center gap-4 px-2">
            <div
              className="relative h-[2px] flex-1 bg-stone/20 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                if (!scrollRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                scrollRef.current.scrollTo({ left: clickPos * maxScroll, behavior: 'smooth' });
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-antique-gold/60 to-antique-gold transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(8, scrollProgress)}%` }}
              />
            </div>

            {/* Slide Quick Dots */}
            <div className="flex gap-1.5">
              {destinations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-6 bg-antique-gold'
                      : 'w-1.5 bg-stone/30 hover:bg-antique-gold/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden">
          <div className="relative space-y-10">
            <div className="absolute left-[24px] top-0 bottom-0 w-[1px] bg-antique-gold/20" />
            {destinations.map((d, i) => (
              <div
                key={d.num}
                onClick={() => setSelectedDestination(d)}
                className={`reveal ${i < 5 ? 'reveal-delay-' + i : ''} flex gap-5 cursor-pointer group`}
              >
                <div className="relative flex-shrink-0 z-10">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-antique-gold/40 bg-charcoal text-antique-gold shadow-lg group-hover:border-antique-gold group-hover:bg-antique-gold/10 transition-colors">
                    <span className="font-serif text-sm font-light">{d.num}</span>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="relative mb-3 h-[180px] overflow-hidden rounded border border-antique-gold/20 shadow-xl group-hover:border-antique-gold/60 transition-colors">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="img-zoom h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#E9E5DC] backdrop-blur-md border border-antique-gold/30">
                      <span>Explore</span>
                      <span className="text-antique-gold">&#8594;</span>
                    </div>
                  </div>
                  <h3 className="mb-1 font-serif text-xl font-light text-ivory group-hover:text-antique-gold transition-colors">
                    {d.name}
                  </h3>
                  <p
                    className="text-[10.5px] uppercase leading-relaxed tracking-wider text-stone/60"
                    dangerouslySetInnerHTML={{ __html: d.desc }}
                  />
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.16em] text-antique-gold/80">
                    Learn More &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pop-up Window Modal */}
      {selectedDestination && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
          onClick={() => setSelectedDestination(null)}
        >
          {/* Modal Container Card */}
          <div
            className="relative w-full max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-antique-gold/30 bg-[#121215] text-ivory shadow-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDestination(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-ivory/80 backdrop-blur-md border border-white/10 hover:border-antique-gold/60 hover:text-ivory hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>

            {/* Destination Picture */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal">
              <img
                src={selectedDestination.img}
                alt={selectedDestination.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/20 to-black/30 pointer-events-none" />

              {/* Number and Step Badge */}
              <div className="absolute bottom-3 left-6 font-sans text-[10px] tracking-[0.22em] uppercase text-antique-gold bg-black/70 px-3 py-1 rounded backdrop-blur-sm border border-antique-gold/30">
                Stop {selectedDestination.num} of 10
              </div>
            </div>

            {/* Destination Content */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-ivory tracking-wide">
                  {selectedDestination.name}
                </h3>
                {selectedDestination.elevation && (
                  <span className="font-sans text-[11px] uppercase tracking-widest text-antique-gold/80 px-2.5 py-0.5 rounded bg-antique-gold/10 border border-antique-gold/20">
                    Elevation {selectedDestination.elevation}
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p
                className="text-xs uppercase tracking-wider text-stone/60 font-light"
                dangerouslySetInnerHTML={{ __html: selectedDestination.desc }}
              />

              {/* Elegant divider */}
              <div className="h-[1px] w-14 bg-antique-gold/40" />

              {/* Full Destination Story */}
              <p className="font-serif text-[15.5px] sm:text-[17px] font-normal leading-[1.8] text-[#E4DEC9]/95 pt-1">
                {selectedDestination.story}
              </p>

              {/* Footer with Prev / Next Navigation */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => navigateModal(-1)}
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone/70 hover:text-ivory transition-colors"
                >
                  <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
                  <span>Previous Place</span>
                </button>

                <button
                  onClick={() => setSelectedDestination(null)}
                  className="hidden sm:inline-block px-4 py-1.5 rounded border border-white/15 text-[11px] uppercase tracking-wider text-stone/80 hover:text-ivory hover:border-antique-gold/40 transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={() => navigateModal(1)}
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone/70 hover:text-ivory transition-colors"
                >
                  <span>Next Place</span>
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
