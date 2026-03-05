import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  MoreVertical,
  Utensils,
} from "lucide-react";

export default function ProductsPage() {
  // Simulación de datos para la UI
  const mockProducts = [
    {
      id: 1,
      name: "Hamburguesa Clásica",
      category: "Comida",
      price: 12.5,
      stock: 45,
      status: "Disponible",
    },
    {
      id: 2,
      name: "Refresco de Cola",
      category: "Bebidas",
      price: 2.5,
      stock: 120,
      status: "Disponible",
    },
    {
      id: 3,
      name: "Papas Fritas",
      category: "Complementos",
      price: 4.0,
      stock: 0,
      status: "Agotado",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Gestión de Productos
          </h1>
          <p className="text-charcoal/60">
            Administra el menú, precios y existencias de tu inventario.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-hoja text-white px-5 py-3 rounded-xl font-medium hover:bg-hoja/90 transition-all shadow-lg shadow-hoja/20 active:scale-95">
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-softwhite p-4 rounded-2xl border border-cream shadow-sm">
        <div className="relative col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream/30 border border-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-mostaza/20 focus:border-mostaza transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="flex-1 px-4 py-2.5 bg-cream/30 border border-cream rounded-xl focus:outline-none text-charcoal/70">
            <option>Todas las categorías</option>
            <option>Comida</option>
            <option>Bebidas</option>
          </select>
          <button className="p-2.5 bg-cream/50 text-charcoal rounded-xl hover:bg-cream border border-cream">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-softwhite rounded-3xl border border-cream shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/50 border-b border-cream">
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-charcoal/60">
                  Producto
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-charcoal/60">
                  Categoría
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-charcoal/60">
                  Precio
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-charcoal/60">
                  Stock
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-charcoal/60">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-charcoal/60 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {mockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-cream/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center text-charcoal/40 font-bold overflow-hidden">
                        {/* Aquí iría la imagen */}
                        <Utensils size={20} />
                      </div>
                      <span className="font-medium text-charcoal">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-mostaza/10 text-mostaza text-xs font-bold rounded-full uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-charcoal">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-charcoal/70">
                    {product.stock} unidades
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        product.status === "Disponible"
                          ? "text-hoja"
                          : "text-chile"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.status === "Disponible"
                            ? "bg-hoja"
                            : "bg-chile animate-pulse"
                        }`}
                      />
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-charcoal/40 hover:text-mostaza hover:bg-mostaza/10 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-charcoal/40 hover:text-chile hover:bg-chile/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación (Solo UI) */}
        <div className="px-6 py-4 border-t border-cream flex items-center justify-between bg-cream/10">
          <p className="text-sm text-charcoal/50">
            Mostrando 3 de 12 productos
          </p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-cream rounded-lg text-sm disabled:opacity-50"
              disabled
            >
              Anterior
            </button>
            <button className="px-4 py-2 bg-white border border-cream rounded-lg text-sm hover:bg-cream transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
