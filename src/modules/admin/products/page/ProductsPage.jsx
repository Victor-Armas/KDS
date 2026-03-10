import { useCategories } from "@/modules/kiosk/features/categories/hook/useCategories";
import Spinner from "@/components/ui/Spinner";
import { useState } from "react";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { keepPreviousData } from "@tanstack/react-query";
import HeaderProducts from "../components/HeaderProducts";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductPagination from "../components/ProductPagination";
import ModalAddProduct from "../components/ModalAddProduct";
import { useProductMutations } from "../hooks/useProductMutations";

export default function ProductsPage() {
  const { deleteMutation } = useProductMutations();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  // 1. Estados para la búsqueda: uno para el texto del input y otro para la consulta real
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //Estado para el modal
  const [modalAction, setModalAction] = useState(null);

  const pageSize = 10;

  const { data, isLoading, isFetching } = useAdminProducts({
    page: currentPage,
    pageSize,
    categoryId: selectedCategory || null,
    searchTerm: searchQuery, // Enviamos el estado que solo cambia al dar click
    placeholderData: keepPreviousData,
  });

  const { data: categories, isLoading: loadingCategories } = useCategories();

  const products = data?.products ?? [];
  const totalProducts = data?.total ?? 0;

  // Manejadores
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

  const openCreate = () => setModalAction({ type: "create" });
  const openEdit = (product) => setModalAction({ type: "edit", product });
  const closeSubtitle = () => setModalAction(null);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      deleteMutation.mutate(id);
    }
  };
  // Solo mostramos Spinner en la carga inicial pesada
  if (isLoading && !products.length) return <Spinner />;

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Encabezado */}
      <HeaderProducts onOpenModal={openCreate} />

      {/* Barra de Filtros y Búsqueda */}

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

      {/* Tabla con efecto de carga sutil */}
      <ProductTable
        products={products}
        isFetching={isFetching}
        onEdit={openEdit} // Pasamos la función
        onDelete={handleDelete} // Pasamos la función
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
          onClose={closeSubtitle}
          categories={categories}
          // Si existe product, el modal entra en modo edición automáticamente
          initialData={modalAction.product}
        />
      )}
    </div>
  );
}
