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
      },
    },
  },
}
