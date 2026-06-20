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
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional clean typography
      }
    },
  },
  plugins: [],
}
