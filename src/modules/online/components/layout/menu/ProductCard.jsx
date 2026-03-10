import { useCart } from "@/modules/online/context/CartContext";
import { Plus, ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.id === product.id);

  return (
    <article className="group relative bg-softwhite dark:bg-stone-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-black/40 border border-cream dark:border-stone-800 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-4/3">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-cream dark:bg-stone-800 flex items-center justify-center">
            <ShoppingBag
              size={32}
              className="text-charcoal/20 dark:text-stone-600"
            />
          </div>
        )}

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-charcoal/80 dark:bg-black/70 backdrop-blur-sm text-white text-sm font-black px-3 py-1 rounded-full">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {/* In cart indicator */}
        {inCart && (
          <div className="absolute top-3 right-3 bg-hoja text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
            {inCart.quantity} en carrito
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-serif font-bold text-charcoal dark:text-stone-100 text-base leading-tight">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-charcoal/50 dark:text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Add button */}
        <button
          onClick={() => addItem(product)}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-chile text-white py-2.5 rounded-2xl text-sm font-bold hover:bg-chile/90 active:scale-95 transition-all shadow-sm shadow-chile/20"
        >
          <Plus size={16} />
          Añadir
        </button>
      </div>
    </article>
  );
}
