import { useProducts } from "../hook/useProducts";
import ProductCard from "./ProductCard";

export default function ProductGrid({ categoryId }) {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts(categoryId);

  if (isLoading) return <p className="text-center py-12">Cargando...</p>;
  if (isError)
    return (
      <p className="text-center py-12 text-red-600">Error: {error?.message}</p>
    );
  return (
    <main className="px-4 sm:px-6 md:px-8 lg:px-10 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.length >= 1 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No hay registrado ningun producto</p>
      )}
    </main>
  );
}
