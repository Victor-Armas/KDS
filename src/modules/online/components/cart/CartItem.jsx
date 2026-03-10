import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartItem({ item }) {
  const { increment, decrement, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-4 border-b border-cream dark:border-stone-800 last:border-0">
      {/* Image */}
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-2xl shrink-0"
        />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-charcoal dark:text-stone-100 text-sm leading-tight truncate">
          {item.name}
        </p>
        <p className="text-xs text-charcoal/50 dark:text-stone-500 mt-0.5">
          ${Number(item.price).toFixed(2)} c/u
        </p>

        {/* Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => decrement(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-cream dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 transition text-charcoal dark:text-stone-300"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-6 text-center text-sm font-bold text-charcoal dark:text-stone-100">
            {item.quantity}
          </span>
          <button
            onClick={() => increment(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-cream dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 transition text-charcoal dark:text-stone-300"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="ml-1 p-1.5 text-chile/40 hover:text-chile hover:bg-chile/10 rounded-lg transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="shrink-0 text-right">
        <p className="font-bold text-mostaza dark:text-mostaza text-sm">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
