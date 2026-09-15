/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A18',
        steel: '#2E2E2B',
        safety: '#F5B700',
        safetyDark: '#D89E00',
        hazard: '#E8491D',
        bone: '#F2F0E9',
        line: '#3F3F3B',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      clipPath: {
        tag: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)',
      },
    },
  },
  plugins: [],
};
