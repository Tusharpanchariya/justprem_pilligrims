/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'near-black': '#0D0D0F',
        charcoal: '#141416',
        'blue-black': '#101A20',
        ivory: '#E9E5DC',
        stone: '#CFC9BD',
        'antique-gold': '#A9895E',
        copper: '#9C704E',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'editorial': '0.25em',
        'wide-sm': '0.15em',
        'ultra': '0.5em',
      },
      animation: {
        'fade-up': 'fadeUp 1.2s ease forwards',
        'slow-zoom': 'slowZoom 20s ease-out forwards',
        'drift': 'drift 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1.0)' },
          '100%': { transform: 'scale(1.12)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-2%)' },
        },
      },
    },
  },
  plugins: [],
};
