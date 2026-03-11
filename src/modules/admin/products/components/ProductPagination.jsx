import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({
  products,
  totalProducts,
  currentPage,
  setCurrentPage,
  pageSize,
}) {
  const totalPages = Math.ceil(totalProducts / pageSize);
  const isFirst = currentPage === 0;
  const isLast = (currentPage + 1) * pageSize >= totalProducts;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-xs text-charcoal/40 dark:text-white/30 font-medium">
        Mostrando{" "}
        <span className="font-bold text-charcoal/60 dark:text-white/50">
          {products.length}
        </span>{" "}
        de{" "}
        <span className="font-bold text-charcoal/60 dark:text-white/50">
          {totalProducts}
        </span>{" "}
        productos
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={isFirst}
          className={`p-2 rounded-lg border text-sm font-medium transition-all
            border-cream dark:border-white/8
            ${
              isFirst
                ? "opacity-30 cursor-not-allowed text-charcoal/40 dark:text-white/30"
                : "cursor-pointer text-charcoal/60 dark:text-white/50 hover:bg-cream dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-white"
            }`}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="px-3 py-1.5 text-xs font-bold text-charcoal/50 dark:text-white/40">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={isLast}
          className={`p-2 rounded-lg border text-sm font-medium transition-all
            border-cream dark:border-white/8
            ${
              isLast
                ? "opacity-30 cursor-not-allowed text-charcoal/40 dark:text-white/30"
                : "cursor-pointer text-charcoal/60 dark:text-white/50 hover:bg-cream dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-white"
            }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
