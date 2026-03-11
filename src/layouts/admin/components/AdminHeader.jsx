import { Menu, Sun, Moon } from "lucide-react";
import { useAdminTheme } from "../context/AdminThemeContext";

export const AdminHeader = ({ profile, onMenuClick }) => {
  const { isDark, toggleTheme } = useAdminTheme();

  return (
    <header
      className="h-16 shrink-0 relative z-10
      bg-softwhite dark:bg-[#1a1816]
      border-b border-cream dark:border-white/5
      shadow-sm dark:shadow-black/20
      flex items-center justify-between px-4 lg:px-6
      transition-colors duration-300"
    >
      {/* Left — mobile menu toggle */}
      <button
        className="p-2 lg:hidden text-charcoal/50 dark:text-white/40 hover:bg-cream dark:hover:bg-white/5 rounded-xl transition-colors"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      {/* Right — actions + profile */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-charcoal/40 dark:text-white/40 hover:text-charcoal dark:hover:text-white hover:bg-cream dark:hover:bg-white/5 transition-all"
          title={isDark ? "Modo claro" : "Modo oscuro"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-px h-6 bg-cream dark:bg-white/10 mx-1" />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-charcoal dark:text-stone-100 leading-tight">
              {profile?.full_name}
            </p>
            <p className="text-[10px] text-charcoal/40 dark:text-white/30 uppercase tracking-wider font-bold">
              {profile?.role}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-chile/10 dark:bg-chile/20 border-2 border-chile/20 dark:border-chile/30 flex items-center justify-center text-chile font-black text-sm shadow-sm">
            {profile?.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};
