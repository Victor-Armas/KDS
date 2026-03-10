import { useCart } from "../../context/CartContext";
import { useRestaurantOpen } from "../../hooks/useMenu";

export default function CartSummary({ onCheckout }) {
  const { total, items } = useCart();
  const { data: settings } = useRestaurantOpen();
  const isOpen = settings?.is_open ?? true;
  const isEmpty = items.length === 0;

  return (
    <div className="border-t border-cream dark:border-stone-800 px-6 py-5 space-y-4 bg-softwhite dark:bg-stone-950">
      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-charcoal/60 dark:text-stone-400 uppercase tracking-wider">
          Total
        </span>
        <span className="text-2xl font-serif font-black text-charcoal dark:text-stone-100">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Checkout button */}
      {!isOpen ? (
        <div className="w-full py-3 rounded-2xl bg-cream dark:bg-stone-800 text-charcoal/40 dark:text-stone-500 text-center text-sm font-bold">
          Restaurante cerrado
        </div>
      ) : (
        <button
          onClick={onCheckout}
          disabled={isEmpty}
          className="w-full py-3.5 bg-chile text-white rounded-2xl font-bold text-sm hover:bg-chile/90 active:scale-95 transition-all shadow-lg shadow-chile/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isEmpty ? "Agrega productos" : "Finalizar pedido"}
        </button>
      )}

      <p className="text-[10px] text-center text-charcoal/30 dark:text-stone-600">
        El pago se realiza al recoger o en la entrega
      </p>
    </div>
  );
}
