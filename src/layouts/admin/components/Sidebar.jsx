import { Link } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import LogoutButton from "@/utils/components/LogoutButton";

export const Sidebar = ({ menu, location, isOpen, setIsSidebarOpen }) => (
  <>
    {/* Overlay para dispositivos móviles */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-charcoal text-softwhite transform transition-all duration-300 ease-in-out 
        ${isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"} 
        lg:static lg:inset-0`}
    >
      <div className="h-full flex flex-col">
        {/* --- SECCIÓN LOGO Y CONTROL --- */}
        <div
          className={`p-6 flex ${isOpen ? "flex-row items-center justify-between" : "flex-col items-center gap-4"}`}
        >
          {/* Grupo Logo */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-8 h-8 bg-chile rounded-lg flex items-center justify-center font-serif font-bold text-xl text-white shadow-lg shadow-chile/20">
              R
            </div>
            {isOpen && (
              <span className="font-serif font-bold text-xl tracking-tight text-cream truncate">
                RestoAdmin
              </span>
            )}
          </div>

          {/* Botón de alternancia (Toggle) */}
          <button
            onClick={() => setIsSidebarOpen(!isOpen)}
            className={`hidden lg:flex items-center justify-center rounded-lg transition-all border border-white/10 hover:bg-white/5 text-softwhite/40 hover:text-white
              ${isOpen ? "w-8 h-8" : "w-10 h-8"}`}
          >
            {isOpen ? (
              <ChevronLeft size={18} strokeWidth={2.5} />
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <ChevronRight size={18} strokeWidth={2.5} />
                <span className="text-[7px] font-black uppercase tracking-tighter">
                  Abrir
                </span>
              </div>
            )}
          </button>
        </div>

        {/* --- NAVEGACIÓN --- */}
        <nav
          className={`flex-1 px-4 py-4 space-y-2 ${!isOpen && "flex flex-col items-center"}`}
        >
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-xl text-sm font-medium transition-all group relative
                  ${isOpen ? "px-4 py-3 gap-3 w-full" : "p-3 justify-center"}
                  ${
                    isActive
                      ? "bg-chile text-white shadow-lg shadow-chile/20"
                      : "text-softwhite/70 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="shrink-0">{item.icon}</span>

                {isOpen ? (
                  <span className="truncate">{item.label}</span>
                ) : (
                  /* Tooltip flotante al estar colapsado */
                  <div className="absolute left-14 bg-charcoal text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-white/10">
          <LogoutButton
            className={`flex items-center rounded-xl text-sm font-medium text-softwhite/70 hover:bg-chile/10 hover:text-chile transition-all ${isOpen ? "px-4 py-3 w-full gap-3" : "p-3 justify-center"}`}
          >
            <LogOut size={20} />
            {isOpen && <span>Cerrar sesión</span>}
            {!isOpen && (
              <div className="absolute left-14 bg-charcoal text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-xl whitespace-nowrap z-50">
                Cerrar sesión
              </div>
            )}
          </LogoutButton>
        </div>
      </div>
    </aside>
  </>
);
