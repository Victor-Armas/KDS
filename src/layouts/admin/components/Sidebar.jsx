import { Link } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";
import { useSettings } from "@/modules/admin/settings/hooks/useSettings";

export function Sidebar({ menu, location, isOpen, setIsSidebarOpen }) {
  const { data: settings } = useSettings();
  const restaurantName = settings?.restaurant_name || "RestoAdmin";
  const initial = restaurantName.charAt(0).toUpperCase();

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-softwhite dark:bg-[#1a1816]
          border-r border-cream dark:border-white/5
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}
          lg:static lg:inset-0
          flex flex-col
          shadow-xl dark:shadow-black/40
          transition-colors duration-300
        `}
      >
        {/* ── LOGO ─────────────────────────────────── */}
        <div
          className={`p-5 flex ${isOpen ? "flex-row items-center justify-between" : "flex-col items-center gap-3"} border-b border-cream dark:border-white/5`}
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-9 h-9 bg-chile rounded-xl flex items-center justify-center font-serif font-black text-lg text-white shadow-md shadow-chile/30">
              {initial}
            </div>
            {isOpen && (
              <div>
                <span className="font-serif font-bold text-base text-charcoal dark:text-stone-100 leading-tight block">
                  {restaurantName}
                </span>
                <span className="text-[10px] text-charcoal/30 dark:text-white/30 font-bold uppercase tracking-wider">
                  Panel de control
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isOpen)}
            className={`hidden lg:flex items-center justify-center rounded-xl transition-all
              text-charcoal/30 dark:text-white/20
              hover:text-charcoal dark:hover:text-white
              hover:bg-cream dark:hover:bg-white/5
              border border-cream dark:border-white/5
              ${isOpen ? "w-8 h-8" : "w-9 h-8 mt-1"}`}
          >
            {isOpen ? (
              <ChevronLeft size={16} strokeWidth={2.5} />
            ) : (
              <ChevronRight size={16} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* ── NAV ──────────────────────────────────── */}
        <nav
          className={`flex-1 px-3 py-4 space-y-1 overflow-y-auto ${!isOpen && "flex flex-col items-center"}`}
        >
          {isOpen && (
            <p className="text-[10px] font-black text-charcoal/25 dark:text-white/20 uppercase tracking-[0.2em] px-3 pb-2">
              Menú
            </p>
          )}

          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center rounded-2xl text-sm font-medium transition-all group relative
                  ${isOpen ? "px-4 py-3 gap-3 w-full" : "p-3 justify-center w-12 h-12"}
                  ${
                    isActive
                      ? "bg-chile text-white shadow-lg shadow-chile/20"
                      : "text-charcoal/60 dark:text-white/40 hover:bg-cream dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-white"
                  }
                `}
              >
                <span className={`shrink-0 ${isActive ? "text-white" : ""}`}>
                  {item.icon}
                </span>

                {isOpen ? (
                  <span className="truncate font-semibold">{item.label}</span>
                ) : (
                  <div className="absolute left-14 bg-charcoal dark:bg-stone-800 text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── FOOTER ───────────────────────────────── */}
        <div className="p-3 border-t border-cream dark:border-white/5">
          <LogoutButton
            className={`
              flex items-center rounded-2xl text-sm font-medium transition-all group relative
              text-charcoal/40 dark:text-white/30
              hover:bg-chile/10 dark:hover:bg-chile/20
              hover:text-chile dark:hover:text-chile
              ${isOpen ? "px-4 py-3 w-full gap-3" : "p-3 justify-center w-12 h-12"}
            `}
          >
            <LogOut size={18} />
            {isOpen && <span>Cerrar sesión</span>}
            {!isOpen && (
              <div className="absolute left-14 bg-charcoal dark:bg-stone-800 text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-xl whitespace-nowrap z-50">
                Cerrar sesión
              </div>
            )}
          </LogoutButton>
        </div>
      </aside>
    </>
  );
}
