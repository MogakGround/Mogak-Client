import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#060812',
        white: '#FFFFFF',
        grayscale: {
          900: '#181B29',
          800: '#202232',
          700: '#2E3040',
          600: '#3E4151',
          500: '#5B5F70',
          400: '#818491',
          300: '#9FA1AC',
          200: '#BEC0C8',
          100: '#D5D7DE',
          50: '#F7F8F9',
        },
        primary: {
          100: '#FF4C3B',
          90: '#FF5E4F',
          80: '#FF7062',
          70: '#FF8276',
          60: '#FF9489',
          50: '#FFA69D',
          40: '#FFB8B1',
          30: '#FFCAC5',
          20: '#FFDBD8',
          10: '#FFEEEC',
          5: '#FFF6F5',
        },
        primaryT: {
          100: 'rgba(255, 76, 59, 1)',
          90: 'rgba(255, 76, 59, 0.9)',
          80: 'rgba(255, 76, 59, 0.8)',
          70: 'rgba(255, 76, 59, 0.7)',
          60: 'rgba(255, 76, 59, 0.6)',
          50: 'rgba(255, 76, 59, 0.5)',
          40: 'rgba(255, 76, 59, 0.4)',
          30: 'rgba(255, 76, 59, 0.3)',
          20: 'rgba(255, 76, 59, 0.2)',
          10: 'rgba(255, 76, 59, 0.1)',
          5: 'rgba(255, 76, 59, 0.05)',
        },
        accent: {
          100: '#03ECD6',
          90: '#1DEEDB',
          80: '#35F0DE',
          70: '#4FF2E3',
          60: '#68F4E6',
          50: '#81F6EB',
          40: '#9AF7EF',
          30: '#B4FAF3',
          20: '#CDFBF7',
          10: '#E6FEFB',
          5: '#F2FFFD',
        },
        accentT: {
          100: 'rgba(3, 236, 214, 1)',
          90: 'rgba(3, 236, 214, 0.9)',
          80: 'rgba(3, 236, 214, 0.8)',
          70: 'rgba(3, 236, 214, 0.7)',
          60: 'rgba(3, 236, 214, 0.6)',
          50: 'rgba(3, 236, 214, 0.5)',
          40: 'rgba(3, 236, 214, 0.4)',
          30: 'rgba(3, 236, 214, 0.3)',
          20: 'rgba(3, 236, 214, 0.2)',
          10: 'rgba(3, 236, 214, 0.1)',
          5: 'rgba(3, 236, 214, 0.05)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
