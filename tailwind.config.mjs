import { FIT_MENU } from './src/consts'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins'],
        poppins: ['Poppins'],
        'roboto-serif': ['Roboto Serif Variable']
      },
      colors: {
        white: '#FDFDFD',
        gray: {
          100: '#F4F4F5',
          200: '#EAEAEA',
          700: '#5D5D5D',
          900: '#333333'
        },
        blue: {
          50: '#F0F2F8',
          100: '#E9F0F5',
          500: '#0089D6',
          700: '#49799D'
        },
        red: {
          500: '#FF6D54'
        },
        orange: {
          500: '#F6AE2D'
        },
        lime: {
          500: '#A3E635'
        }
      },
      width: {
        25: '6.25rem'
      },
      height: {
        25: '6.25rem'
      },
      padding: {
        'side-vent': '214px'
      },
      margin: {
        'side-vent': '214px'
      },
      screens: {
        fitmenu: `${FIT_MENU}px`,
        xxs: '400px',
        xs: '520px'
      }
    }
  },

  plugins: []
}
