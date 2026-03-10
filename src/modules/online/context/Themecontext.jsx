import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // 1. Primero revisamos si el usuario ya eligió antes
    const stored = localStorage.getItem("sabores-theme");
    if (stored) return stored === "dark";
    // 2. Si no, respetamos la preferencia del sistema como default inicial
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Con darkMode: 'class' en tailwind.config.js,
    // Tailwind activa todos los dark: cuando <html> tiene la clase "dark"
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Guardamos la elección para que persista entre sesiones
    localStorage.setItem("sabores-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
};
