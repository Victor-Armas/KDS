import Spinner from "@/components/ui/Spinner";
import { useState } from "react";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { keepPreviousData } from "@tanstack/react-query";
import HeaderProducts from "../components/HeaderProducts";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductPagination from "../components/ProductPagination";
import ModalAddProduct from "../components/ModalAddProduct";
import { useCategories } from "@/modules/online/hooks/useMenu";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalAction, setModalAction] = useState(null);

  const pageSize = 10;

  const { data, isLoading, isFetching } = useAdminProducts({
    page: currentPage,
    pageSize,
    categoryId: selectedCategory || null,
    searchTerm: searchQuery,
    placeholderData: keepPreviousData,
  });

  const { data: categories, isLoading: loadingCategories } = useCategories();

  const products = data?.products ?? [];
  const totalProducts = data?.total ?? 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(0);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(0);
  };

  if (isLoading && !products.length) return <Spinner />;

  return (
    <div className="space-y-5 p-4 lg:p-8">
      <HeaderProducts
        onOpenModal={() => setModalAction({ type: "create" })}
        totalProducts={totalProducts}
      />

      <ProductFilters
        handleSearchSubmit={handleSearchSubmit}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        isFetching={isFetching}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        loadingCategories={loadingCategories}
        categories={categories}
        searchQuery={searchQuery}
        clearFilters={clearFilters}
      />

      <ProductTable
        products={products}
        isFetching={isFetching}
        onEdit={(product) => setModalAction({ type: "edit", product })}
      />

      <ProductPagination
        products={products}
        totalProducts={totalProducts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />

      {modalAction && (
        <ModalAddProduct
          onClose={() => setModalAction(null)}
          categories={categories}
          initialData={modalAction.product}
        />
      )}
    </div>
  );
}
