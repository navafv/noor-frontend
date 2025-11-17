/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using a Rose palette for a stitching/fashion feel
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e', // Main Brand Color
          600: '#e11d48',
          700: '#be123c',
        },
        // Neutral grays for text
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}