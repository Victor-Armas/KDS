import { useState } from "react";
import CategoryFilter from "../features/categories/components/CategoryFilter";
import ProductGrid from "../features/products/components/ProductGrid";

export default function KioskPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <>
      <CategoryFilter
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
      <ProductGrid categoryId={selectedCategoryId} />
    </>
  );
}
