/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50:  '#fdf8f0',
          100: '#faebd7',
          200: '#f5d5a8',
          300: '#edba72',
          400: '#e4993d',
          500: '#d97f1f',
          600: '#c46b15',
          700: '#a35213',
          800: '#844217',
          900: '#6c3817',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'count-up': 'countUp 0.3s ease',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.35s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '.6' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,.06), 0 4px 16px 0 rgba(0,0,0,.04)',
        'card-hover': '0 8px 28px 0 rgba(0,0,0,.1)',
        glow: '0 0 0 3px rgba(34,197,94,.18)',
      },
    },
  },
  plugins: [],
}
