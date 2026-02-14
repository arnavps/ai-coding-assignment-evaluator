/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-obsidian': '#121212',
        'obsidian-secondary': '#1E1E1E',
        'text-primary': '#E0E0E0',
        'text-secondary': 'rgba(176, 176, 176, 0.87)',
        'text-header': 'rgba(224, 224, 224, 0.87)',
        'text-secondary-muted': 'rgba(176, 176, 176, 0.60)',
        'text-disabled': 'rgba(176, 176, 176, 0.38)',
        'border-default': '#2D2D2D',
        'success': '#00FF94',
        'warning': '#FFD600',
        'error': '#FF0055',
        'accent-electric-cyan': '#00FFFF',
        'accent-neon-green': '#39FF14',
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
