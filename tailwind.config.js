/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          cream: "#F5EFE6",
          softwhite: "#FAF9F6",
          chile: "#9E2A2B",
          hoja: "#386641",
          mostaza: "#BC6C25",
          charcoal: "#2C2C2C",
        },
        fontFamily: {
          serif: ["Playfair Display", "serif"],
          sans: ["Inter", "sans-serif"],
        },
      },
    },
    plugins: [],
  };