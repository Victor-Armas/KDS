import { Plus } from "lucide-react";
import React from "react";

export default function HeaderProducts({ onOpenModal }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">
          Gestión de Productos
        </h1>
        <p className="text-charcoal">
          Administra el menú y existencias de tu inventario.
        </p>
      </div>
      <button
        onClick={onOpenModal}
        className="flex items-center justify-center gap-2 bg-hoja text-white px-5 py-3 rounded-xl font-medium hover:bg-hoja/90 transition-all shadow-lg shadow-hoja/20 active:scale-95 cursor-pointer"
      >
        <Plus size={20} /> Nuevo Producto
      </button>
    </div>
  );
}
