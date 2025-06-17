/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff3c6f",
        "primary-dull": "#b92f57",
        accent: "#ff9800",
        surface: "#1E1E1E",
        "text-muted": "#B0B0B0",
        background: "#121212",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
}
