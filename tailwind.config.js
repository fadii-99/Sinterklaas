/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'], 
        christmas: ['Berkshire Swash', 'cursive'],
      },
      screens: {
        'sm': '640px', 
        'md': '820px', 
        'lg': '1024px', 
        'xl': '1280px', 
        '2xl': '1536px', 
      },
    },
  },
  plugins: [],
}

