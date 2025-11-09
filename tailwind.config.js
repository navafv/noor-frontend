/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // You MUST use 'extend' to add to the default theme
    extend: {
      colors: {
        'noor-pink': '#ec4899',
        'noor-pink-dark': '#be185d',
        'noor-heading': '#333333',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'logo': ['Great Vibes', 'cursive'],
      }
    }
  },
  plugins: [],
}