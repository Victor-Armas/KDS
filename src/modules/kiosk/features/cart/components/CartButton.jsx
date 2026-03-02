import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartButton({ onClick }) {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer bg-chile text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:bg-mostaza transition"
    >
      <ShoppingCart size={20} />
      Carrito
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-hoja text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
}
