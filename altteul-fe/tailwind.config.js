/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Pretendard Variable', 'sans-serif'],
        },

        // 팀매칭때 유저 좌우 슬라이드 효과
        keyframes: {
          slideLeft: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-5rem)' }
          },
          slideRight: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(5rem)' }
          }
        },
        animation: {
          'slide-left': 'slideLeft 1s ease-out forwards',
          'slide-right': 'slideRight 1s ease-out forwards'
        }
      },
    },
    plugins: [],
  }