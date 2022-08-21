const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.html', "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      }
    },
    colors: {
      gray: '#E2E8F0'
    }
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    outline: false,
  },
  plugins: [],
}
