/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#2563eb',
          600: '#1e40af',
          400: '#3b82f6',
          DEFAULT: '#2563eb',
        },
        secondary: {
          500: '#f59e42',
          600: '#b45309',
          400: '#fbbf24',
          DEFAULT: '#f59e42',
        },
        blackGold: {
          900: '#181818', // black
          500: '#FFD700', // gold
          700: '#BFA100',
          50: '#fff',
          accent: '#F5C542', // accent gold from logo
          bg: '#181818',
          gold: '#FFD700',
          goldDark: '#BFA100',
          white: '#fff',
        },
        vibrantGradient: {
          900: '#0D1164', // Deep Navy Blue
          800: '#640D5F', // Rich Purple  
          500: '#EA2264', // Bright Pink
          400: '#F78D60', // Coral Orange
          50: '#fff',
          accent: '#EA2264', // Bright Pink accent
          bg: 'linear-gradient(135deg, #0D1164 0%, #640D5F 35%, #EA2264 70%, #F78D60 100%)',
          navy: '#0D1164',
          purple: '#640D5F',
          pink: '#EA2264',
          coral: '#F78D60',
          white: '#fff',
        },
      },
    },
  },
}
