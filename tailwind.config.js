/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
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
      backgroundImage: {
        "tacos-claro": "url('/img/fondoClaro.png')",
        "tacos-oscuro": "url('/img/fondoOscuro.png')",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        shake: "shake 0.2s ease-in-out 0s 7", // Se sacude 2 veces rápido
      },
    },
  },
  plugins: [],
};
