/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundcolor: {
          DEFAULT: "#F3F4F6", // bg-gray-100 ok
        },
        accentcolor: {
          DEFAULT: "#0fb07b", // bg-emerald-500 ok
          light: "#ecfdf5", // bg-emerald-50 ok 
        }, 
        card: "#FFFFFF", // bg-white ok
        dark: "#1f2937", // text-gray-800. ok
        light: "#4b5563", // text-gray-600. ok
        red: "#EF4444", // text-red-600. ok
        button: "#10B981", // bg-emerald-500 
        buttonHover: "#047857", // hover:bg-emerald-700
        
        gray: {
          200: "#E5E7EB", // bg-gray-200
          700: "#374151", // bg-gray-700
        },
      }
    },
  },
  plugins: [],
}

