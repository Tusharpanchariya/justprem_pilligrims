import { useEffect, useRef, useState } from 'react';
import { images } from '@/data/images';

export default function MountainStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = -rect.height;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const imgY = progress * 120;
  const textOpacity = Math.min(progress * 1.8, 1);

  return (
    <section
      ref={ref}
      className="relative h-[120svh] w-full overflow-hidden grain"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <img
          src={images.panoramaWide}
          alt="Panoramic Himalayan mountain range"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `translateY(${imgY}px) scale(1.1)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-near-black/60 via-near-black/30 to-near-black/80" />

        {/* Text overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: textOpacity }}
        >
          <p className="mb-6 text-[11px] uppercase tracking-ultra text-antique-gold md:text-xs">
            The Doorway
          </p>
          <h2 className="font-serif text-3xl font-light leading-tight text-ivory sm:text-5xl md:text-6xl lg:text-7xl">
            The mountains are not
            <br />
            the destination.
          </h2>
          <p className="mt-8 font-serif text-2xl font-light italic text-stone md:text-4xl lg:text-5xl">
            They are the doorway.
          </p>
        </div>
      </div>
    </section>
  );
}
