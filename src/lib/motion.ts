import { Variants } from 'framer-motion';

/**
 * JustPrem Unified Motion System
 * Refined editorial motion tokens, easings, and reusable variants.
 */

// Luxury Editorial Cubic Bezier Curves
export const EDITORIAL_EASING = [0.22, 1, 0.36, 1] as const;
export const LUXURY_EASING = [0.16, 1, 0.3, 1] as const;
export const SMOOTH_EASING = [0.25, 0.1, 0.25, 1.0] as const;

// Transition Durations (in seconds)
export const MOTION_DURATIONS = {
  fast: 0.25,
  ui: 0.35,
  text: 0.75,
  image: 1.1,
  slow: 1.4,
} as const;

/**
 * SectionReveal: For sections entering the viewport
 * Subtle opacity transition + 20-28px upward movement
 */
export const sectionRevealVariants = (reducedMotion = false): Variants => ({
  hidden: {
    opacity: 0,
    y: reducedMotion ? 0 : 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.text,
      ease: EDITORIAL_EASING,
    },
  },
});

/**
 * TextReveal: For headings, subtitles, and descriptions
 */
export const textRevealVariants = (reducedMotion = false, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: reducedMotion ? 0 : 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.text,
      ease: EDITORIAL_EASING,
      delay,
    },
  },
});

/**
 * ImageReveal: Soft clipping-mask and scale reveal
 */
export const imageRevealVariants = (reducedMotion = false, delay = 0.1): Variants => ({
  hidden: {
    clipPath: reducedMotion ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
    scale: reducedMotion ? 1 : 1.04,
    opacity: reducedMotion ? 1 : 0.85,
  },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.image,
      ease: LUXURY_EASING,
      delay,
    },
  },
});

/**
 * Stagger Container: Staggers child item reveals
 */
export const staggerContainerVariants = (staggerChildren = 0.12, delayChildren = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Color Palette Tokens for Reference
 */
export const PALETTE = {
  warmIvory: '#F5F1E8',
  softSand: '#E8DFD0',
  softSage: '#DDE0D3',
  mutedOlive: '#70765A',
  deepEarth: '#38392E',
  terracotta: '#AC765E',
  naturalStone: '#C9C1B2',
  charcoalInk: '#292B22',
} as const;
