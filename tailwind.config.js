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
