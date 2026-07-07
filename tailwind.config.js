/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode via a class
  theme: {
    extend: {
      colors: {
        surya: {
          primary: '#0B3D91', // Deep Blue
          secondary: '#F4B400', // Gold
          success: '#22c55e', // Green
          warning: '#f97316', // Orange
          danger: '#ef4444', // Red
          bgLight: '#f8fafc',
          bgDark: '#0f172a',
          surfaceLight: '#ffffff',
          surfaceDark: '#1e293b',
        },
        ceo: {
          navy: '#071A35',
          'navy-light': '#0d284f',
          gold: '#D4AF37',
          'gold-hover': '#C19D2F',
          dark: '#030c1a',
        },
        'primary-gold': '#D4AF37',
        'accent-blue': '#3B82F6',
        'accent-emerald': '#10B981',
        'bg-primary': '#07111F',
        'bg-secondary': '#0D1B2A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional clean typography
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
