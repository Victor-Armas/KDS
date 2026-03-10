import { useState } from "react";
import {
  ShoppingBag,
  Sun,
  Moon,
  UserCircle,
  LogOut,
  History,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LogoutButton from "@/components/ui/LogoutButton";
import TrackOrderModal from "../order/TrackOrderModal";

export default function OnlineHeader({ onOpenCart }) {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [trackOpen, setTrackOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-cream dark:border-stone-800 bg-softwhite/95 dark:bg-stone-950/95 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/online"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 bg-chile rounded-xl flex items-center justify-center shadow-sm shadow-chile/30">
              <span className="text-white font-serif font-black text-sm">
                S
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-serif font-bold text-charcoal dark:text-stone-100 group-hover:text-chile dark:group-hover:text-chile transition-colors">
                Sabores <span className="text-chile">de México</span>
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-charcoal/40 hover:text-charcoal dark:text-stone-500 dark:hover:text-stone-100 hover:bg-cream dark:hover:bg-stone-800 transition-all"
              title={isDark ? "Modo claro" : "Modo oscuro"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth + track order */}
            {user ? (
              <>
                <Link
                  to="/online/historial"
                  className="p-2.5 rounded-xl text-charcoal/40 hover:text-charcoal dark:text-stone-500 dark:hover:text-stone-100 hover:bg-cream dark:hover:bg-stone-800 transition-all"
                  title="Mis pedidos"
                >
                  <History size={18} />
                </Link>
                <LogoutButton className="p-2.5 rounded-xl text-charcoal/40 hover:text-chile dark:text-stone-500 dark:hover:text-chile hover:bg-cream dark:hover:bg-stone-800 transition-all">
                  <LogOut size={18} />
                </LogoutButton>
              </>
            ) : (
              <>
                {/* Rastrear pedido — visible solo para no logueados */}
                <button
                  onClick={() => setTrackOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-charcoal/60 hover:text-charcoal dark:text-stone-500 dark:hover:text-stone-100 hover:bg-cream dark:hover:bg-stone-800 transition-all"
                  title="Rastrear pedido"
                >
                  <MapPin size={15} />
                  Mi pedido
                </button>
                {/* Mobile icon only */}
                <button
                  onClick={() => setTrackOpen(true)}
                  className="sm:hidden p-2.5 rounded-xl text-charcoal/40 hover:text-charcoal dark:text-stone-500 dark:hover:text-stone-100 hover:bg-cream dark:hover:bg-stone-800 transition-all"
                >
                  <MapPin size={18} />
                </button>

                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-charcoal/60 hover:text-charcoal dark:text-stone-500 dark:hover:text-stone-100 hover:bg-cream dark:hover:bg-stone-800 transition-all"
                >
                  <UserCircle size={15} />
                  Iniciar sesión
                </Link>
              </>
            )}

            <div className="w-px h-5 bg-cream dark:bg-stone-800 mx-0.5" />

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-chile text-white px-4 py-2.5 rounded-2xl font-bold text-sm hover:bg-chile/90 active:scale-95 transition-all shadow-md shadow-chile/25"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-mostaza text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <TrackOrderModal isOpen={trackOpen} onClose={() => setTrackOpen(false)} />
    </>
  );
}
