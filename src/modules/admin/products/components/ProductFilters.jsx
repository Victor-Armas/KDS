import { Search, X } from "lucide-react";
import React from "react";

export default function ProductFilters({
  handleSearchSubmit,
  searchInput,
  setSearchInput,
  isFetching,
  selectedCategory,
  handleCategoryChange,
  loadingCategories,
  categories,
  searchQuery,
  clearFilters,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-softwhite p-4 rounded-2xl border border-cream shadow-sm">
      <form
        onSubmit={handleSearchSubmit}
        className="relative col-span-2 flex gap-2"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
            size={18}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-10 py-2.5 bg-cream/30 border border-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-mostaza/20 focus:border-mostaza transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-chile "
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-hoja text-white px-6 py-1 rounded-xl font-bold hover:bg-hoja/80 transition-all active:scale-95 disabled:opacity-50"
        >
          {isFetching ? "..." : "Buscar"}
        </button>
      </form>

      <div className="flex gap-2">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={loadingCategories}
          className="flex-1 px-4 py-2.5 bg-cream/30 border border-cream rounded-xl focus:outline-none text-charcoal/70 cursor-pointer"
        >
          <option value="">Todas las categorías</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {(searchQuery || selectedCategory) && (
          <button
            onClick={clearFilters}
            className="px-3 bg-chile text-white rounded-xl text-xs font-bold hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
