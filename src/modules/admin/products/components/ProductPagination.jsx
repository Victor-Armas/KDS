import React from "react";

export default function ProductPagination({
  products,
  totalProducts,
  currentPage,
  setCurrentPage,
  pageSize,
}) {
  return (
    <div className="px-6 py-4  bg-softwhite flex items-center justify-between rounded-2xl border border-cream shadow-sm">
      <p className="text-sm text-charcoal/50">
        Mostrando{" "}
        <span className="font-bold text-charcoal">{products.length}</span> de{" "}
        <span className="font-bold text-charcoal">{totalProducts}</span>{" "}
        productos
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className={`px-4 py-2 border border-cream rounded-lg text-sm font-medium text-charcoal/70 transition-colors shadow-sm 
            ${
              currentPage === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-white cursor-pointer"
            }`}
        >
          Anterior
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={(currentPage + 1) * pageSize >= totalProducts}
          className={`px-4 py-2 bg-white border border-cream rounded-lg text-sm font-medium text-charcoal/70 transition-colors shadow-sm 
            ${
              (currentPage + 1) * pageSize >= totalProducts
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-cream cursor-pointer"
            }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
