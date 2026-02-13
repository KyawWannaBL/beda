/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Luxury Palette
        luxury: {
          gold: '#D4AF37',       // Metallic Gold
          obsidian: '#0B0C10',   // Deep Black-Blue
          ivory: '#FAF9F6',      // Off-white
          zinc: '#1F2124',       // Premium Gray
        },
        primary: {
          DEFAULT: '#D4AF37',
          foreground: '#0B0C10',
        },
        background: '#0B0C10',
        foreground: '#FAF9F6',
      },
      fontFamily: {
        // High-end Typography pairing
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'luxury': '2rem', // Ultra-rounded corners for cards
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}