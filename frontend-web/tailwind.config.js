/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        usm: {
          navy: '#0C2340',
          blue: '#1E3A8A',
          gold: '#E2951F',
          light: '#F8FAFC',
          dark: '#0F172A',
          border: '#E2E8F0'
        }
      }
    },
  },
  plugins: [],
}
