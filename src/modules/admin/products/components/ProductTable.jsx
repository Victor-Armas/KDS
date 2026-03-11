import { Edit2, Trash2, Utensils } from "lucide-react";
import { useState } from "react";
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

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div
      className={`
        rounded-2xl border overflow-hidden transition-opacity duration-200
        bg-softwhite dark:bg-[#1a1816]
        border-cream dark:border-white/6
        shadow-sm dark:shadow-black/20
        ${isFetching ? "opacity-60" : "opacity-100"}
      `}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cream dark:border-white/6">
              <th className="px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-charcoal/40 dark:text-white/30">
                Producto
              </th>
              <th className="px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-charcoal/40 dark:text-white/30">
                Categoría
              </th>
              <th className="px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-charcoal/40 dark:text-white/30">
                Precio
              </th>
              <th className="px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-charcoal/40 dark:text-white/30">
                Estado
              </th>
              <th className="px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-charcoal/40 dark:text-white/30 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-cream dark:divide-white/5">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-cream/30 dark:hover:bg-white/3 transition-colors"
                >
                  {/* Producto */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-cream dark:bg-white/5 border border-cream dark:border-white/8 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Utensils
                            size={16}
                            className="text-charcoal/20 dark:text-white/15"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-charcoal dark:text-stone-100 leading-tight">
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="text-[11px] text-charcoal/40 dark:text-white/30 mt-0.5 line-clamp-1 max-w-[200px]">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-mostaza/10 dark:bg-mostaza/15 text-mostaza">
                      {product.category?.name || "Sin categoría"}
                    </span>
                  </td>

                  {/* Precio */}
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-sm text-charcoal dark:text-stone-100">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                        product.is_available
                          ? "text-hoja"
                          : "text-charcoal/40 dark:text-white/30"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.is_available
                            ? "bg-hoja"
                            : "bg-charcoal/30 dark:bg-white/20"
                        }`}
                      />
                      {product.is_available ? "Disponible" : "Oculto"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 rounded-lg text-charcoal/30 dark:text-white/25 hover:text-mostaza hover:bg-mostaza/10 dark:hover:bg-mostaza/15 transition-all cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="p-2 rounded-lg text-charcoal/30 dark:text-white/25 hover:text-chile hover:bg-chile/10 dark:hover:bg-chile/15 transition-all cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-16 text-center">
                  <Utensils
                    size={32}
                    className="mx-auto mb-3 text-charcoal/15 dark:text-white/10"
                  />
                  <p className="text-sm text-charcoal/30 dark:text-white/25 font-medium">
                    No se encontraron productos
                  </p>
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
        message={`¿Eliminar "${selectedProduct?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
