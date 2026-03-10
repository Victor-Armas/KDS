import React from "react";

export default function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_center,#121110_0%,#080707_100%)] custom-scrollbar">
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 font-black">
          No se encontraron productos
        </div>
      ) : (
        /* Envolvemos el grid para evitar que haga "stretch" vertical automático */
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 p-4 lg:p-8 items-start auto-rows-max">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="group bg-[#1a1918] rounded-4xl overflow-hidden border border-white/5 active:scale-95 active:bg-[#252423] transition-all duration-200 cursor-pointer touch-manipulation flex flex-col shadow-xl"
            >
              <div className="aspect-square relative shrink-0 overflow-hidden bg-[#252423]">
                <img
                  src={product.image_url}
                  className="w-full h-full object-cover group-active:scale-110 transition-transform duration-700 pointer-events-none"
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1a1918] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 font-black text-sm text-[#f4a261]">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Contenedor de texto ajustado y centrado */}
              <div className="p-4 flex-1 flex items-center justify-center text-center">
                <h3 className="font-bold text-sm md:text-base tracking-tight leading-snug line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
