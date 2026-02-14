/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-obsidian': '#0B0B0B',
        'obsidian-secondary': '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'border-default': '#333333',
        'success': '#00FF94',
        'warning': '#FFD600',
        'error': '#FF0055',
      },
      fontFamily: {
        'helvetica': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'garamond': ['Apple Garamond', 'Baskerville', 'serif'],
      },
      animation: {
        'typing': 'typing 2s steps(40, end)',
        'stagger': 'stagger 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        stagger: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
