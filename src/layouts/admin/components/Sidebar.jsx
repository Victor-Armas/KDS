import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import LogoutButton from "@/utils/components/LogoutButton";

export const Sidebar = ({ menu, location, isOpen, onClose }) => (
  <>
    {/* Overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}

    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal text-softwhite transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-chile rounded-lg flex items-center justify-center font-serif font-bold text-xl text-white">
            R
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-cream">
            RestoAdmin
          </span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-chile text-white shadow-lg shadow-chile/20"
                  : "text-softwhite/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <LogoutButton className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-softwhite/70 hover:bg-chile/10 hover:text-chile transition-colors">
            <LogOut size={20} /> Cerrar sesión
          </LogoutButton>
        </div>
      </div>
    </aside>
  </>
);
