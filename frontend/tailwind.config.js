/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1128',
          light: '#131D3A',
          dark: '#060C1A',
        },
        accent: {
          DEFAULT: '#8B3DFF',
          dark: '#7030E0',
        },
        magenta: {
          DEFAULT: '#E8005E',
          dark: '#C5004F',
        },
        blue: {
          brand: '#264BEE',
        },
        track: {
          joint: '#8B3DFF',
          pestpac: '#E8005E',
          realgreen: '#22c55e',
          winteam: '#264BEE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Termina', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
