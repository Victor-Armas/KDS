import { X, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, clearCart } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-softwhite dark:bg-stone-950 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream dark:border-stone-800 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-chile dark:text-chile flex items-center gap-2">
            <ShoppingBag size={20} />
            Tu carrito
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-cream dark:hover:bg-stone-800 text-charcoal/40 dark:text-stone-500 hover:text-charcoal dark:hover:text-stone-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-charcoal/30 dark:text-stone-600 gap-3">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="font-medium text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full mt-4 py-2 text-xs text-chile/60 hover:text-chile transition font-medium"
                >
                  Vaciar carrito
                </button>
              )}
            </>
          )}
        </div>

        {/* Summary + checkout */}
        <CartSummary onCheckout={onCheckout} />
      </aside>
    </>
  );
}
