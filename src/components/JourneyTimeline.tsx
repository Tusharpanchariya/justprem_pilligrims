'use client';

import { useState, useRef, useEffect } from 'react';
import { images } from '@/data/images';

const destinations = [
  { num: '01', name: 'Kathmandu', desc: 'Ancient temples &middot; sacred beginnings &middot; living culture', img: '/places_images/kathmandu2.jpg' },
  { num: '02', name: 'Pokhara', desc: 'Lakeside serenity &middot; gateway to the mountains', img: '/places_images/pokhara2.jpg' },
  { num: '03', name: 'Tadapani', desc: 'Dense rhododendron forests &middot; mountain vistas', img: images.pj2 },
  { num: '04', name: 'Chhomrong', desc: 'Stone steps &middot; heart of the Annapurna sanctuary', img: '/places_images/chomrong.webp' },
  { num: '05', name: 'Poon Hill', desc: 'Golden sunrise &middot; panoramic Himalayan peaks', img: '/places_images/poonhill.jpg' },
  { num: '06', name: 'Tatopani', desc: 'Natural hot springs &middot; deep river valleys', img: '/places_images/tatopani.jpg' },
  { num: '07', name: 'Marpha', desc: 'Apple orchards &middot; whitewashed stone houses', img: '/places_images/marpha.jpg' },
  { num: '08', name: 'Jomsom', desc: 'Windswept landscapes &middot; the Kali Gandaki gorge', img: images.pj7 },
  { num: '09', name: 'Kagbeni', desc: 'Ancient fortress &middot; gateway to Upper Mustang', img: images.pj8 },
  { num: '10', name: 'Muktinath', desc: 'Sacred Retreat &middot; spiritual liberation', img: '/places_images/muktinath.jpg' },
];

export default function JourneyTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

      if (!isPaused && scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;

        if (maxScroll > 0) {
          // Smooth auto scroll step (adjust speed here: 0.05px/ms approx)
          el.scrollLeft += delta * 0.05;

          // If reached the end, reset smoothly back to start
          if (el.scrollLeft >= maxScroll - 1) {
            el.scrollLeft = 0;
          }
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 332;
    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

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
        </div>

        {/* Desktop Horizontal Slider */}
        <div
          className="hidden lg:block relative group/slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseDown={() => setIsPaused(true)}
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
                  onClick={() => scrollToIndex(i)}
                  className={`group relative w-[300px] flex-shrink-0 cursor-pointer transition-all duration-500`}
                >
                  {/* Image Card Container (No dark overlays, bright clear photos) */}
                  <div className="relative mb-6 h-[210px] rounded border border-antique-gold/20 shadow-2xl overflow-hidden group-hover:border-antique-gold/60 transition-all duration-500">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="img-zoom h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Active Highlight Glow Border */}
                    {isActive && (
                      <div className="absolute inset-0 border border-antique-gold/50 pointer-events-none" />
                    )}
                  </div>

                  {/* Marker Dot along timeline line */}
                  <div className="relative mb-6 flex justify-center items-center">
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-antique-gold/40 -z-10" />
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-300 ${isActive
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
                      className="text-center text-[10.5px] uppercase leading-relaxed tracking-wider text-stone/60 group-hover:text-stone/90 transition-colors duration-300"
                      dangerouslySetInnerHTML={{ __html: d.desc }}
                    />
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex
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
                className={`reveal ${i < 5 ? 'reveal-delay-' + i : ''} flex gap-5`}
              >
                <div className="relative flex-shrink-0 z-10">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-antique-gold/40 bg-charcoal text-antique-gold shadow-lg">
                    <span className="font-serif text-sm font-light">
                      {d.num}
                    </span>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="group relative mb-3 h-[180px] overflow-hidden rounded border border-antique-gold/20 shadow-xl">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="img-zoom h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mb-1 font-serif text-xl font-light text-ivory">
                    {d.name}
                  </h3>
                  <p
                    className="text-[10.5px] uppercase leading-relaxed tracking-wider text-stone/60"
                    dangerouslySetInnerHTML={{ __html: d.desc }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


