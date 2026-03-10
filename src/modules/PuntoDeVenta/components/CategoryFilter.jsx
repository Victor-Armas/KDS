import React from "react";

export default function CategoryFilter({
  categories,
  activeCategory,
  setActiveCategoryId,
}) {
  return (
    <div className="p-4 overflow-x-auto flex gap-3 no-scrollbar shrink-0 bg-black/40 border-b border-white/5">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategoryId(cat.id)}
          className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
            ${
              activeCategory === cat.id
                ? "bg-[#e63946] text-white shadow-[0_0_20px_rgba(230,57,70,0.3)] scale-105"
                : "bg-white/5 text-gray-500 hover:bg-white/10"
            }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
