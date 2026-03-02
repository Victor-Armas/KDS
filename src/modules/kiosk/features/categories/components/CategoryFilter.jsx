import React from "react";
import { useCategories } from "../hook/useCategories";

export default function CategoryFilter({
  selectedCategoryId,
  setSelectedCategoryId,
}) {
  const { data: categories = [], isLoading, isError } = useCategories();

  if (isLoading) return <p className="px-10 py-6">Cargando categorías...</p>;
  if (isError) return null;

  return (
    <section className="px-4 md:px-10 py-4 flex gap-3 overflow-x-auto no-scrollbar">
      <button
        onClick={() => setSelectedCategoryId(null)}
        className={`shrink-0 whitespace-nowrap px-5 py-2 rounded-full shadow-sm transition ${
          selectedCategoryId === null
            ? "bg-chile text-white"
            : "bg-softwhite hover:bg-mostaza hover:text-white"
        }`}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategoryId(cat.id)}
          className={`shrink-0 whitespace-nowrap px-5 py-2 rounded-full shadow-sm transition ${
            selectedCategoryId === cat.id
              ? "bg-chile text-white"
              : "bg-softwhite hover:bg-mostaza hover:text-white"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </section>
  );
}
