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
    },
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus'],
    }
  },
  corePlugins: {
    outline: false,
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ],
}
