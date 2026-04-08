/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFF8F0',
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FDEBD8',
        },
        terracotta: {
          DEFAULT: '#C0622F',
          light: '#D4845A',
          dark: '#96461E',
        },
        warmgreen: {
          DEFAULT: '#5B7B4E',
          light: '#7A9C6B',
          dark: '#3F5936',
        },
        saffron: {
          DEFAULT: '#F4A623',
          light: '#F7C06E',
          dark: '#C47E0E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
