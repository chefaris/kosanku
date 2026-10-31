/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#FFF5F2',
          100: '#FFE9E4',
          300: '#FFB5A5',
          400: '#FF8F78',
          500: '#FF6B4A'
        },
        sakura: {
          50: '#FFF0F5',
          100: '#FFE2EC',
          300: '#FF97BC',
          400: '#FF649C'
        },
        matcha: {
          50: '#F2FAF4',
          100: '#E3F5E9',
          300: '#94D9A7',
          400: '#5EC17B'
        },
        lavender: {
          50: '#F8F6FF',
          100: '#EDE9FE',
          300: '#C4B5FD',
          400: '#A78BFA'
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF9F0',
          200: '#FFF2DF'
        },
        darkcocoa: '#2D283E',
        softgray: '#6B6778'
      },
      boxShadow: {
        cute: '0 8px 24px -4px rgba(255, 143, 120, 0.15)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      fontFamily: {
        heading: ['var(--font-quicksand)', '"Quicksand"', 'sans-serif'],
        body: ['var(--font-plus-jakarta-sans)', '"Plus Jakarta Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};
