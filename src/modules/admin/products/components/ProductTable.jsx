import { Edit2, Trash2, Utensils } from "lucide-react";
import React, { useState } from "react";
import { useProductMutations } from "../hooks/useProductMutations";
import ConfirmModal from "@/shared/ConfirmModal";

export default function ProductTable({ products, isFetching, onEdit }) {
  const { deleteMutation } = useProductMutations();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };
  return (
    <div
      className={`bg-softwhite rounded-3xl border border-cream shadow-sm overflow-hidden transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/50 border-b border-cream">
              <th className="px-6 py-4 text-xs uppercase font-bold text-charcoal/60">
                Producto
              </th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-charcoal/60">
                Categoría
              </th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-charcoal/60">
                Precio
              </th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-charcoal/60">
                Estado
              </th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-charcoal/60 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-cream/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center overflow-hidden border border-cream">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Utensils size={20} className="text-charcoal/20" />
                        )}
                      </div>
                      <span className="font-medium text-charcoal">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-mostaza/10 text-mostaza text-xs font-bold rounded-full uppercase">
                      {product.category?.name || "Sin categoría"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-charcoal">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold ${product.is_available ? "text-hoja" : "text-chile"}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${product.is_available ? "bg-hoja" : "bg-chile animate-pulse"}`}
                      />
                      {product.is_available ? "Disponible" : "No disponible"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-charcoal/40 hover:text-mostaza hover:bg-mostaza/10 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="p-2 text-charcoal/40 hover:text-chile hover:bg-chile/10 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-charcoal/40 italic"
                >
                  No se encontraron productos para esta búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que quieres eliminar "${selectedProduct?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Paginación */}
    </div>
  );
}
