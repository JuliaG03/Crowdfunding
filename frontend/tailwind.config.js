/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accentcolor1: '#31493c',
        accentcolor2: '#7A9E7E',
        fontcolor: '#e8f1f2',
        backgroundcolor: '#001A23',
        extracolor: '#B3EFB2'
      }
    },
  },
  plugins: [],
}

