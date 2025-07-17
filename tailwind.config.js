/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          /* Darker, more subdued grays to match Apollo theme */
          900: '#0e0e13',
          800: '#1d1233',
          700: '#281d46',
        },
        purple: {
          /* Darker, muted purples taken from new gradient */
          900: '#1d1233',
          800: '#27184e',
          700: '#321c6a',
          600: '#5a3db0',
          500: '#6e4bd0',
          400: '#8361e6',
          300: '#9f85f0',
          200: '#bbadf7',
          100: '#d5cafa',
        },
        violet: {
          900: '#2d0a4a',
          800: '#3d1a6e',
          700: '#4e2a8b',
          600: '#5e3ab0',
          500: '#7149d0',
          400: '#8561e6',
          300: '#9f85f0',
          200: '#bbadf7',
          100: '#d5cafa',
        },
        green: {
          400: '#4ade80',
          300: '#86efac',
        },
        yellow: {
          400: '#facc15',
          300: '#fde047',
        },
        blue: {
          400: '#38bdf8',
          300: '#7dd3fc',
        },
        red: {
          400: '#f87171',
          300: '#fca5a5',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'purple': '0 4px 14px 0 rgba(110, 75, 208, 0.25)',
      },
      backdropBlur: {
        'sm': '8px',
      },
    },
  },
  plugins: [],
}
