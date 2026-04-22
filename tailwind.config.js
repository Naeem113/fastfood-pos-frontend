/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
 plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.transition-slow': {
          transition: 'all 200ms ease-out',
        },
        '.transition-base': {
          transition: 'all 500ms ease-in-out',
        },
        '.transition-fast': {
          transition: 'all 700ms ease-out',
        },
      });
    }),
  ],
};
