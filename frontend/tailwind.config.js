/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        text: 'var(--text)',
        textSecondary: 'var(--text-secondary)',
        border: 'var(--border)',
      }
    },
  },
  plugins: [],
}
