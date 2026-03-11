import { Plus, Package } from "lucide-react";

export default function HeaderProducts({ onOpenModal, totalProducts }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-chile/10 dark:bg-chile/20 flex items-center justify-center shrink-0">
          <Package size={22} className="text-chile" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal dark:text-stone-100">
            Gestión de Productos
          </h1>
          <p className="text-sm text-charcoal/50 dark:text-white/40 mt-0.5">
            {totalProducts != null
              ? `${totalProducts} productos en el menú`
              : "Administra el menú e inventario"}
          </p>
        </div>
      </div>

      <button
        onClick={onOpenModal}
        className="flex items-center justify-center gap-2 bg-chile text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-chile/90 active:scale-95 transition-all shadow-lg shadow-chile/20 cursor-pointer shrink-0"
      >
        <Plus size={18} />
        Nuevo Producto
      </button>
    </div>
  );
}
