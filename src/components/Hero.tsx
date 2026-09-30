import { useEffect, useState } from 'react';
import mainPageBg from '../../assets/nepal_natureimages/main_page.png';

interface HeroProps {
  onEnquire: () => void;
}

export default function Hero({ onEnquire }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scale = 1 + Math.min(scrollY / 3000, 0.15);
  const opacity = Math.max(1 - scrollY / 600, 0);

  return (
    <section id="hero" className="relative min-h-[90vh] md:min-h-[92vh] w-full overflow-hidden grain flex flex-col justify-start pt-[18vh] md:pt-[22vh]">
      {/* Background image with slow zoom + scroll scale */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.1s linear',
        }}
      >
        <img
          src={mainPageBg}
          alt="Himalayan snow peak at sunrise"
          className="h-full w-full object-cover"
          style={{ animation: 'slowZoom 25s ease-out forwards' }}
          fetchPriority="high"
        />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101012] via-[#101012]/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,transparent_70%)]" />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center px-6 text-center w-full max-w-[90%] md:max-w-[75%] mx-auto"
        style={{ opacity, transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <p className="reveal font-sans text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-[#E6DCC8]/75 mb-8 md:mb-10">
          11 Nights &middot; 12 Days
        </p>

        <h1 className="reveal reveal-delay-1 font-serif font-medium text-[#F1EEE7] text-[clamp(52px,7vw,108px)] leading-[0.95] tracking-[-0.025em] mb-[48px]">
          Heart of the Himalayas
        </h1>

        <p className="reveal reveal-delay-3 font-sans text-[15px] md:text-[18px] font-normal leading-[1.55] max-w-[620px] text-[#F5F2EB]/82 mb-[72px]">
          A sacred journey through Nepal, where ancient paths meet the silence
          of the world's highest mountains.
        </p>



        <div className="reveal reveal-delay-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <button
            onClick={onEnquire}
            className="flex items-center justify-center h-[52px] px-8 md:px-9 border border-[#E6DCC8]/30 bg-black/10 backdrop-blur-sm transition-colors duration-500 hover:bg-white/5 font-sans text-[10px] md:text-[11px] uppercase font-medium tracking-[0.18em] text-ivory"
          >
            Begin the Journey
          </button>
          
          <a
            href="#intro"
            className="group flex items-center gap-2 font-sans text-[10px] md:text-[11px] uppercase font-medium tracking-[0.18em] text-[#EBE7DE]/80 transition-colors duration-500 hover:text-ivory"
          >
            Explore the Pilgrimage
            <span className="inline-block transition-transform duration-500 group-hover:translate-y-0.5">
              &#8595;
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity }}
      >
        <div className="flex h-12 w-[1px] justify-center bg-[#E6DCC8]/30">
          <div className="h-4 w-[1px] animate-bounce bg-[#E6DCC8]/70" />
        </div>
      </div>
    </section>
  );
}
