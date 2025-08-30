/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // we'll toggle 'dark' class manually
  theme: {
    extend: {
      colors: {
        coder: {
          light: '#f5f5f5',        // background for coder/light mode
          dark: '#0d1117',         // GitHub dark background
          accent: '#ff7f50',       // LeetCode accent
          text: '#c9d1d9',         // code text color
          highlight: '#58a6ff',    // highlights
        },
      },
    },
  },
  plugins: [],
}
