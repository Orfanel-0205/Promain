/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0D9488',
        'primary-dark': '#0F766E',
        'primary-light': '#14B8A6',
      },
      fontSize: {
        body: ['16px', { lineHeight: '24px' }],
        heading: ['20px', { lineHeight: '28px' }],
        'heading-lg': ['24px', { lineHeight: '32px' }],
      },
    },
  },
  plugins: [],
};
