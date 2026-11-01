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
          50: 'var(--theme-peach-50, #FFF5F2)',
          100: 'var(--theme-peach-100, #FFE9E4)',
          200: 'var(--theme-peach-200, #FFD2C8)',
          300: 'var(--theme-peach-300, #FFB5A5)',
          400: 'var(--theme-peach-400, #FF8F78)',
          500: 'var(--theme-peach-500, #FF6B4A)',
          600: 'var(--theme-peach-600, #E65100)',
          700: 'var(--theme-peach-700, #C2410C)'
        },
        sakura: {
          50: '#FFF0F5',
          100: '#FFE2EC',
          300: '#FF97BC',
          400: '#FF649C',
          500: '#EC4899',
          600: '#DB2777'
        },
        matcha: {
          50: '#F2FAF4',
          100: '#E3F5E9',
          300: '#94D9A7',
          400: '#5EC17B',
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        },
        lavender: {
          50: '#F8F6FF',
          100: '#EDE9FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED'
        },
        ocean: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7'
        },
        mocha: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309'
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
        cute: '0 8px 24px -4px var(--theme-shadow-cute, rgba(255, 143, 120, 0.15))'
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
