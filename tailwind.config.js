/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  important: true, // This ensures Tailwind classes take precedence
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // This prevents Tailwind from resetting Material styles
  }
}

