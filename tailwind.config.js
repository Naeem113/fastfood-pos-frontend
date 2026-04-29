/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1d1d1f',
        'primary-hover': '#1f2937',
        secondary: '#f59e0b',
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
  },
  animation: {
    float: 'float 10s ease-in-out infinite',
    'float-slow': 'floatSlow 18s ease-in-out infinite',
    'float-slower': 'floatSlower 24s ease-in-out infinite',
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
