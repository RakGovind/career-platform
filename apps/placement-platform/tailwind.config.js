/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#373092', // hsl(245, 58%, 51%)
          dark: '#2a2470',    // hsl(245, 58%, 41%)
          light: '#4d3db3',   // hsl(245, 58%, 61%)
        },
      },
    },
  },
  plugins: [],
}
