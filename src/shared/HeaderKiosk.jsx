import { useAuth } from "@/context/AuthContext";
import CartButton from "@/modules/kiosk/features/cart/components/CartButton";
import LogoutButton from "@/utils/components/LogoutButton";
import { LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom"; // Importante para la navegación

export default function HeaderKiosk({ openCart }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-softwhite/90 backdrop-blur-md flex items-center justify-between px-6 md:px-10 py-4 md:py-6 shadow-sm">
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-chile">
        Sabores de México
      </h1>

      <div className="flex items-center gap-4 md:gap-8">
        {user ? (
          /* Si está logueado: Mostrar Logout */
          <LogoutButton className="flex items-center gap-2 text-charcoal/60 hover:text-chile transition-colors text-sm font-medium">
            <LogOut size={18} />
            <span className="hidden md:inline">Salir</span>
          </LogoutButton>
        ) : (
          /* Si NO está logueado: Mostrar botón de Acceso */
          <Link
            to="/login"
            className="flex items-center gap-2 text-charcoal/60 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <UserCircle size={18} />
            <span className="hidden md:inline">Iniciar Sesión</span>
          </Link>
        )}

        <div className="h-8 w-[1px] bg-charcoal/10 mx-2 hidden md:block" />

        <CartButton onClick={openCart} />
      </div>
    </header>
  );
}
