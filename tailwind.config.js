const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Adelle Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'privy-navy': '#160B45',
        'box-color': '#FFFFF0',
        'duck-light-yellow': '#FFF8DC',
        'privy-blueish': '#D4D9FC',
        'privy-pink': '#FF8271',
        'duck-body': '#FFDD59',
        'duck-beak': '#FFB421',
        'duck-eye': '#594D43',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
