/** @type {import('tailwindcss').Config} */

const disabledCss = {
  'code::before': false,
  'code::after': false,
};

module.exports = {
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: { css: disabledCss },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
