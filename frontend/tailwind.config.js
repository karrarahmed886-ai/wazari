/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        head: ['Tajawal', 'sans-serif'],
      },
      colors: {
        primary: '#4B5BEA',
        primaryHover: '#3A4AD9',
        success: '#22c55e',
        successHover: '#16a34a',
        gold: '#FFD700',
        goldHover: '#E6C200',
        darkBg: '#13112E',
        cardBg: '#1C1A3F',
        darkLighter: '#201D47',
        // light mode colors
        lightBg: '#F3F4F6',
        lightCardBg: '#FFFFFF',
        lightText: '#1F2937',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}
