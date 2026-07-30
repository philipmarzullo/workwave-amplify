/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f1b2d',
          light: '#1a2942',
          dark: '#0a1220',
        },
        accent: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        gold: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        track: {
          joint: '#8b5cf6',
          pestpac: '#ef4444',
          realgreen: '#22c55e',
          winteam: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
