/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
           fontFamily: {
            serif: ['Instrument Serif', 'serif'],
            sans:  ['Outfit', 'sans-serif'],
          },
      colors: {
        primary: '#1d1d1f',
        'primary-hover': '#1f2937',
        secondary: '#f59e0b',

                base:    '#0c0c0b',
            surface: '#111110',
            card:    '#161614',
            edge:    '#1e1e1a',
            edge2:   '#2a2a24',
            muted:   '#44443c',
            subtle:  '#7a7a6e',
            txt:     '#e8e4dc',
            gold:    '#c8a96e',
            rose:    '#e07a7a',
            sage:    '#3ecf8e',
            sky:     '#4488cc',
      },
      keyframes: {
    float: {
      '0%, 100%': { transform: 'translate(0, 0)' },
      '50%': { transform: 'translate(10px, -15px)' },
    },
    floatSlow: {
      '0%, 100%': { transform: 'translate(0, 0)' },
      '50%': { transform: 'translate(15px, -25px)' },
    },
    floatSlower: {
      '0%, 100%': { transform: 'translate(0, 0)' },
      '50%': { transform: 'translate(-10px, 20px)' },
    },
     fadeUp: {
              from: { opacity: '0', transform: 'translateY(18px)' },
              to:   { opacity: '1', transform: 'translateY(0)' },
            },
            pdot: {
              '0%,100%': { opacity: '1' },
              '50%':     { opacity: '0.2' },
            },
  },
  animation: {
    float: 'float 10s ease-in-out infinite',
    'float-slow': 'floatSlow 18s ease-in-out infinite',
    'float-slower': 'floatSlower 24s ease-in-out infinite',

     'fade-up':   'fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both',
            'fade-up-2': 'fadeUp 0.55s 0.08s cubic-bezier(0.22,1,0.36,1) both',
            'fade-up-3': 'fadeUp 0.55s 0.16s cubic-bezier(0.22,1,0.36,1) both',
            'fade-up-4': 'fadeUp 0.55s 0.24s cubic-bezier(0.22,1,0.36,1) both',
            'fade-up-5': 'fadeUp 0.55s 0.32s cubic-bezier(0.22,1,0.36,1) both',
            'pdot':      'pdot 2.4s ease-in-out infinite',
  }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.transition-slow': {
          transition: 'all 700ms ease-out',
        },
        '.transition-base': {
          transition: 'all 500ms ease-in-out',
        },
        '.transition-fast': {
          transition: 'all 300ms ease-out',
        },
      });
    }),
  ],
};
