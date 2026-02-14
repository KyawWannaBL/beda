export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: "#D4AF37",
          obsidian: "#0B0C10",
        }
      },
      boxShadow: {
        luxury: "0 10px 40px rgba(212,175,55,0.15)"
      }
    },
  },
  plugins: [],
}
