import { useEffect, useRef, useState } from 'react';
import { images } from '@/data/images';

const words = ['Silence', 'Breath', 'Devotion', 'Movement', 'Presence'];

export default function SpiritualExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const idx = Math.min(words.length - 1, Math.floor(progress * words.length));
      setActiveIndex(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[150vh] w-full overflow-hidden bg-near-black"
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* Background */}
        <img
          src={images.spiritualBg}
          alt="Atmospheric Himalayan mountains"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-near-black via-near-black/70 to-near-black" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-antique-gold/5 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 px-6 text-center">
          <h2 className="mb-24 font-serif text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl lg:text-6xl">
            Come for the mountains.
            <br />
            <span className="italic text-stone/80">
              Stay for what they awaken.
            </span>
          </h2>

          <div className="relative flex h-[120px] items-center justify-center overflow-hidden md:h-[180px] lg:h-[220px]">
            {words.map((word, i) => (
              <span
                key={word}
                className="absolute font-serif font-light text-ivory transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  fontSize: 'clamp(2.5rem, 12vw, 9rem)',
                  opacity: i === activeIndex ? 1 : 0,
                  transform: i === activeIndex
                    ? 'translateY(0) scale(1)'
                    : i < activeIndex
                      ? 'translateY(-60px) scale(0.95)'
                      : 'translateY(60px) scale(0.95)',
                  filter: i === activeIndex ? 'blur(0)' : 'blur(8px)',
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Progress dots */}
          <div className="mt-12 flex justify-center gap-3">
            {words.map((_, i) => (
              <span
                key={i}
                className="h-[1px] transition-all duration-700"
                style={{
                  width: i === activeIndex ? '32px' : '12px',
                  backgroundColor: i <= activeIndex ? '#A9895E' : '#A9895E30',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
