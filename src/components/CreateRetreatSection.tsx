'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface CreateRetreatSectionProps {
  onEnquire: () => void;
}

export default function CreateRetreatSection({ onEnquire }: CreateRetreatSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants configured with luxury editorial easing
  const easing = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="create-retreat"
      className="relative w-full bg-[#F3EFE5] text-[#292B22] overflow-hidden py-24 sm:py-32 lg:py-40 border-b border-[#E8E0D2]/70"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & Call-To-Action */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
            
            {/* 1. Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: easing }}
              className="mb-6 sm:mb-8"
            >
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#51583D] font-medium block">
                CREATE &middot; GATHER &middot; EXPERIENCE
              </span>
            </motion.div>

            {/* 2. Headline with soft upward mask */}
            <div className="mb-8 sm:mb-10">
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.4rem] font-light text-[#292B22] leading-[1.08] tracking-[-0.015em]">
                <span className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={{ y: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 1 : 0.3 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.9, ease: easing, delay: 0.15 }}
                  >
                    Create your own
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                  <motion.span
                    className="block italic font-normal text-[#292B22]"
                    initial={{ y: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 1 : 0.3 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.9, ease: easing, delay: 0.28 }}
                  >
                    pilgrimage &amp; retreat.
                  </motion.span>
                </span>
              </h2>
            </div>

            {/* 3. Description (Quote-style editorial lead) */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: easing, delay: 0.42 }}
              className="font-serif text-xl sm:text-2xl md:text-[1.6rem] font-light leading-[1.4] text-[#292B22]/90 italic mb-6 max-w-xl"
            >
              &ldquo;A gathering shaped around your intention, your people and the experiences you wish to share.&rdquo;
            </motion.p>

            {/* 4. Supporting paragraph */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: easing, delay: 0.54 }}
              className="font-sans text-sm sm:text-base font-light leading-[1.75] text-[#555246] max-w-xl mb-10 sm:mb-12"
            >
              From intimate retreats to meaningful pilgrimages, we help bring your vision to life, anywhere in the world.
            </motion.p>

            {/* 5. Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: easing, delay: 0.66 }}
            >
              <button
                type="button"
                onClick={onEnquire}
                className="group inline-flex items-center gap-3 border border-[#292B22]/35 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium text-[#292B22] transition-all duration-500 ease-out hover:bg-[#51583D] hover:border-[#51583D] hover:text-[#F3EFE5] shadow-sm min-h-[48px] rounded-sm active:translate-y-0.5"
                aria-label="Enquire about your custom retreat"
              >
                <span>Enquire about your retreat</span>
                <span className="transition-transform duration-500 ease-out group-hover:translate-x-2">
                  &rarr;
                </span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Large, Premium Retreat-Location Photograph */}
          <div className="lg:col-span-5 xl:col-span-6 w-full">
            <div className="relative group">
              
              {/* Outer clipping mask container */}
              <motion.div
                initial={{
                  clipPath: shouldReduceMotion ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                }}
                whileInView={{
                  clipPath: 'inset(0% 0% 0% 0%)',
                }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.15, ease: easing, delay: 0.3 }}
                className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-[#E8E0D2] shadow-[0_20px_50px_-15px_rgba(41,43,34,0.12)] border border-[#E8E0D2]"
              >
                <motion.div
                  initial={{ scale: shouldReduceMotion ? 1 : 1.04 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.25, ease: easing, delay: 0.3 }}
                  className="h-full w-full"
                >
                  <img
                    src="/places_images/chomrong.webp"
                    alt="Serene mountain retreat sanctuary with terraced hills and stone lodges"
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  
                  {/* Subtle warm ambient film treatment layer */}
                  <div className="absolute inset-0 bg-[#F3EFE5]/5 mix-blend-multiply pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#292B22]/20 via-transparent to-transparent pointer-events-none opacity-40 transition-opacity duration-700 group-hover:opacity-20" />
                </motion.div>
              </motion.div>

              {/* Editorial Caption below image */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, ease: easing, delay: 0.8 }}
                className="mt-4 flex items-center justify-between text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#7A7569] font-medium"
              >
                <span>MADE AROUND YOUR VISION</span>
                <span className="text-[#A58E70]/80 tracking-[0.18em] text-[9px] md:text-[10px]">GLOBAL DESTINATIONS</span>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
