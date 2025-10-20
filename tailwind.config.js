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
    ringColor: {
      white: colors.white,
      black: colors.black,
    },
    colors: colors,
    screens: {
      sm: { max: '640px' },
      md: { max: '1200px' },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus', 'active'],
      borderColor: ['hover', 'focus', 'active'],
    }
  },
  corePlugins: {
    outline: false,
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ],
}
