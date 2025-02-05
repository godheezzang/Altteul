/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard Variable', 'sans-serif'],
        firacode: ['Firacode', 'sans-serif'],
      },
      colors: {
        'primary-black': '#242A32',
        'primary-white': '#f6f6f6',
        'primary-orange': '#E06C2D',
        'secondary-orange': '#BB5F2F',
        'gray-01': '#e0e0e0',
        'gray-02': '#a2a2a2',
        'gray-03': '#5C6269',
        'gray-04': '#323840',
        'gray-05': '#2F3740',
        'lang-JV': '#AB805D',
        'lang-PY': '#506C9E',
      },

      // 팀매칭때 유저 좌우 슬라이드 효과
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-5rem)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(5rem)' },
        },
      },
      animation: {
        'slide-left': 'slideLeft 1s ease-out forwards',
        'slide-right': 'slideRight 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
