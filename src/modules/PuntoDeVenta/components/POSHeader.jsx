import React from "react";
import { Search, Utensils, ShoppingBag } from "lucide-react";

export default function POSHeader({
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <header className="p-4 lg:p-6 bg-black/60 backdrop-blur-xl flex items-center justify-between shrink-0 border-b border-white/5 z-10">
      <div className="flex items-center gap-4">
        <div className="bg-linear-to-br from-[#e63946] to-[#b91c1c] p-3 rounded-2xl shadow-lg shadow-red-900/40">
          <Utensils size={28} className="text-white" />
        </div>
        <div className="hidden sm:block">
          <h2 className="text-2xl font-black tracking-tighter italic">
            TACO<span className="text-[#e63946]">POS</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-6">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e63946] transition-colors"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar taco o bebida..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-base outline-none focus:bg-white/10 focus:border-[#e63946]/50 transition-all text-white"
          />
        </div>
      </div>

      <button
        onClick={onOpenCart}
        className="lg:hidden relative p-4 bg-[#e63946] rounded-2xl shadow-lg shadow-red-900/20 active:scale-95"
      >
        <ShoppingBag size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#e63946] text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#e63946]">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}
