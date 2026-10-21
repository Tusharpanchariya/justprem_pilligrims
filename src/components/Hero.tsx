'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

interface HeroProps {
  onEnquire: () => void;
}

export default function Hero({ onEnquire }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track cursor for custom hover on desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobile) {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Animations driven by scroll progress
  const videoScale = useTransform(smoothProgress, [0, 0.2, 0.4, 0.65], [1, 1.04, 1.08, 0.78]);
  const videoRadius = useTransform(smoothProgress, [0.4, 0.65], ['0px', '28px']);
  const portalBgOpacity = useTransform(smoothProgress, [0.35, 0.65], [0, 1]);

  const initialContentY = useTransform(smoothProgress, [0, 0.2, 0.35], [0, -30, -80]);
  const initialContentOpacity = useTransform(smoothProgress, [0, 0.2, 0.35], [1, 0.8, 0]);

  const portalContentOpacity = useTransform(smoothProgress, [0.55, 0.75, 0.95], [0, 1, 1]);
  const portalContentY = useTransform(smoothProgress, [0.55, 0.75], [40, 0]);

  const progressLineHeight = useTransform(smoothProgress, [0, 0.9], ['0%', '100%']);

  // Reduced motion accessible fallback
  if (shouldReduceMotion) {
    return (
      <div className="relative w-full min-h-[100svh] bg-[#12100E] text-[#FAF8F5] flex items-center justify-center pt-28 pb-16 px-6">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            poster="/places_images/Poon-Hill-5058.jpg"
          >
            <source src="/hero_page_assets/hero_page.mp4?v=2" type="video/mp4" />
            <source src="/hero_page_assets/hero_page .mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/75 via-[#141210]/40 to-[#141210]/60 pointer-events-none" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[#E6E0D2] font-medium">
            <span>PEOPLE</span>
            <span>&middot;</span>
            <span>PLACES</span>
            <span>&middot;</span>
            <span>PRACTICES</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#FAF8F5] font-light leading-[1.02] mb-6">
            COME AS YOU ARE.
            <br />
            <span className="italic text-[#E6E0D2]">WALK WITH US.</span>
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-[#FAF8F5]/85 font-light tracking-wide max-w-xl mx-auto mb-10 leading-relaxed">
            Retreats, pilgrimages, music and meaningful experiences around the world.
          </p>

          <a
            href="#journeys"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#FAF8F5]/40 bg-[#FAF8F5]/10 backdrop-blur-md text-xs uppercase font-medium tracking-[0.22em] text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#2D3528] transition-all shadow-lg"
          >
            <span>Explore the Journey</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[220vh] bg-[#12100E] text-[#FAF8F5] select-none"
    >
      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between pt-20 md:pt-24">

        {/* WARM IVORY BACKGROUND LAYER (reveals during Portal transition Phase 3) */}
        <motion.div
          style={{ opacity: portalBgOpacity }}
          className="absolute inset-0 z-0 bg-[#F5F1E8] transition-colors duration-700 pointer-events-none"
        />

        {/* 1. HERO BACKGROUND VIDEO & PORTAL FRAME */}
        <div className="absolute inset-0 z-1 flex items-center justify-center pointer-events-none p-0 md:p-6">
          <motion.div
            style={{
              scale: videoScale,
              borderRadius: videoRadius,
            }}
            className="relative w-full h-full overflow-hidden shadow-[0_30px_70px_-15px_rgba(45,53,40,0.3)] transition-shadow duration-700"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              poster="/places_images/Poon-Hill-5058.jpg"
            >
              <source src="/hero_page_assets/hero_page.mp4?v=2" type="video/mp4" />
              <source src="/hero_page_assets/hero_page .mp4" type="video/mp4" />
            </video>

            {/* Cinematic Overlay & Warm Film Treatment */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/60 via-transparent to-[#141210]/40 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(18,16,14,0.45)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[#F5F1E8]/5 mix-blend-overlay pointer-events-none" />
          </motion.div>
        </div>

        {/* 3. HERO INITIAL CENTER CONTENT (Phases 1-2) */}
        <motion.div
          style={{
            y: initialContentY,
            opacity: initialContentOpacity,
          }}
          className="relative z-10 my-auto flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[#E6E0D2] font-medium"
          >
            <span>PEOPLE</span>
            <span>&middot;</span>
            <span>PLACES</span>
            <span>&middot;</span>
            <span>PRACTICES</span>
          </motion.div>

          {/* Main Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#FAF8F5] font-light leading-[1.02]"
            >
              COME AS YOU ARE.
              <br />
              <span className="italic text-[#E6E0D2]">WALK WITH US.</span>
            </motion.h1>
          </div>

          {/* Subtitle / Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="font-sans text-sm sm:text-base md:text-lg text-[#FAF8F5]/85 font-light tracking-wide max-w-xl mb-10 leading-relaxed"
          >
            Retreats, pilgrimages, music and meaningful experiences around the world.
          </motion.p>

          {/* Explore CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            onMouseEnter={() => {
              setCursorHovered(true);
              setCursorText('ENTER');
            }}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <a
              href="#journeys"
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#FAF8F5]/40 bg-[#FAF8F5]/10 backdrop-blur-md text-xs uppercase font-medium tracking-[0.22em] text-[#FAF8F5] transition-all duration-500 ease-out hover:bg-[#FAF8F5] hover:text-[#2D3528] shadow-lg"
            >
              <span>Explore the Journey</span>
              <span className="transition-transform duration-500 group-hover:translate-x-2">&rarr;</span>
            </a>
          </motion.div>
        </motion.div>

        {/* 4. PORTAL REVEAL CONTENT (Phases 4-5 Warm Ivory World) */}
        <motion.div
          style={{
            opacity: portalContentOpacity,
            y: portalContentY,
          }}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12 text-center max-w-4xl mx-auto"
        >
          <div className="pointer-events-auto bg-[#FAF8F5]/92 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-[#E6E0D2]/60 shadow-xl">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#3A4235] font-semibold mb-3 block">
              A GLOBAL COMMUNITY IN MOTION
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2D3528] font-light tracking-tight leading-none mb-6">
              MANY PLACES.
              <br />
              <span className="italic text-[#4A5243]">ONE COMMUNITY.</span>
            </h2>

            <p className="font-sans text-xs md:text-sm text-[#6E675C] font-light max-w-lg mx-auto leading-relaxed mb-8">
              Across places, cultures and traditions, we gather to experience devotion, music, presence and connection.
            </p>

            <a
              href="#journeys"
              className="inline-flex items-center gap-2 text-xs uppercase font-medium tracking-[0.2em] text-[#3A4235] hover:text-[#C27A5B] transition-colors border-b border-[#3A4235]/30 pb-1"
            >
              <span>Discover the journey</span>
              <span>&rarr;</span>
            </a>
          </div>
        </motion.div>

        {/* 5. HERO MICRO INTERACTION (Scroll indicator & progress line) */}
        <motion.div
          style={{ opacity: initialContentOpacity }}
          className="relative z-10 flex flex-col items-center pb-8 gap-2 text-[#E6E0D2]/70"
        >
          <span className="text-[9px] uppercase tracking-[0.3em]">SCROLL TO BEGIN</span>
          <div className="h-4 w-4 animate-bounce text-[#E6E0D2] font-light">&darr;</div>
          <div className="w-[1px] h-10 bg-[#E6E0D2]/20 overflow-hidden rounded-full mt-1">
            <motion.div
              style={{ scaleY: progressLineHeight, transformOrigin: 'top' }}
              className="w-full h-full bg-[#E6E0D2]"
            />
          </div>
        </motion.div>
      </div>

      {/* DESKTOP CUSTOM CURSOR BADGE */}
      {cursorHovered && !isMobile && (
        <motion.div
          className="fixed pointer-events-none z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#FAF8F5] text-[#2D3528] text-[9px] font-bold tracking-widest shadow-2xl border border-[#2D3528]/20"
          style={{
            left: cursorPos.x - 28,
            top: cursorPos.y - 28,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          {cursorText}
        </motion.div>
      )}
    </div>
  );
}
