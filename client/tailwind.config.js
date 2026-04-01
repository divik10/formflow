/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: "#111118",
        card: "#16213e",
        cardAlt: "#1a1a2e",
        accent: "#8b5cf6",
        accentSoft: "#7c3aed",
        textDim: "#a1a1aa",
      },
      boxShadow: {
        glow: "0 0 30px rgba(139, 92, 246, 0.18)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
