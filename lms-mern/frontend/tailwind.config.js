/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dbe7fe',
          200: '#bfd4fe',
          300: '#93b7fd',
          400: '#6090f9',
          500: '#3d6bf3',
          600: '#2749e8',
          700: '#2038d4',
          800: '#212fab',
          900: '#212c87',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px 0 rgba(30, 41, 59, 0.06)',
      },
    },
  },
  plugins: [],
};
