import ProductCard from "./ProductCard";
import { UtensilsCrossed } from "lucide-react";

export default function ProductGrid({ products, isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-cream dark:bg-stone-800 rounded-3xl aspect-3/4 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-charcoal/40 dark:text-stone-600">
        <UtensilsCrossed size={40} className="mx-auto mb-3 opacity-40" />
        <p className="font-medium">No se pudo cargar el menú</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-charcoal/40 dark:text-stone-600">
        <UtensilsCrossed size={40} className="mx-auto mb-3 opacity-40" />
        <p className="font-medium">No hay productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
