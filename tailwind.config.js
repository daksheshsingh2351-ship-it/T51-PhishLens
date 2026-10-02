/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#050B14',
        'brand-navy-light': '#0A1526',
        'brand-navy-lighter': '#112240',
        'brand-cyan': '#00E5FF',
        'brand-cyan-dim': 'rgba(0, 229, 255, 0.2)',
        'brand-green': '#00C853',
        'brand-amber': '#FFAB00',
        'brand-red': '#FF1744',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #112240 1px, transparent 1px), linear-gradient(to bottom, #112240 1px, transparent 1px)",
      },
      animation: {
        'radar': 'radar 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
