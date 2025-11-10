/* NEW FILE: tailwind.config.js */
/* This file configures your entire design system */

const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Enable dark mode using the 'class' strategy
  darkMode: 'class',

  // 2. Tell Tailwind where to look for classes
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // 3. Define the theme
  theme: {
    extend: {
      // 4. Set up your font families to match index.css
      fontFamily: {
        sans: ['Poppins', ...fontFamily.sans],
        logo: ['Great Vibes', 'cursive'],
      },

      // 5. Define the color palette using CSS variables
      // This allows index.css to control the light/dark values
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          ...generateColorShades('primary'),
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
          ...generateColorShades('secondary'),
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

// Helper function to generate shades for primary/secondary
function generateColorShades(colorName) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const obj = {};
  for (const shade of shades) {
    obj[shade] = `hsl(var(--${colorName}-${shade}) / <alpha-value>)`;
  }
  return obj;
}