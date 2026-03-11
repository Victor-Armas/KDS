import { Search, X, SlidersHorizontal } from "lucide-react";

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
  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25"
            size={16}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-10 py-2.5 text-sm
              bg-softwhite dark:bg-[#1e1c1a]
              border border-cream dark:border-white/8
              text-charcoal dark:text-stone-200
              placeholder:text-charcoal/30 dark:placeholder:text-white/20
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-chile/30 focus:border-chile/50
              transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25 hover:text-chile dark:hover:text-chile transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isFetching}
          className="px-5 py-2.5 bg-chile text-white text-sm font-semibold rounded-xl hover:bg-chile/90 active:scale-95 transition-all disabled:opacity-60 shrink-0 cursor-pointer"
        >
          {isFetching ? "..." : "Buscar"}
        </button>
      </form>

      {/* Category + Clear */}
      <div className="flex gap-2 sm:w-64">
        <div className="relative flex-1">
          <SlidersHorizontal
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25 pointer-events-none"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={loadingCategories}
            className="w-full appearance-none pl-8 pr-4 py-2.5 text-sm
              bg-softwhite dark:bg-[#1e1c1a]
              border border-cream dark:border-white/8
              text-charcoal/70 dark:text-white/50
              rounded-xl cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-chile/30
              transition-all"
          >
            <option value="">Todas las categorías</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2.5 bg-chile/10 dark:bg-chile/20 text-chile text-xs font-bold rounded-xl hover:bg-chile/20 dark:hover:bg-chile/30 transition-colors cursor-pointer shrink-0"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
