import {
  X,
  Search,
  Utensils,
  ShoppingBag,
  Truck,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

export default function OrderFormModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 bg-white flex flex-col font-sans">
      {/* 1. HEADER: Acciones Rápidas */}
      <header className="p-4 border-b border-cream flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
          <button className="p-3 bg-cream/30 rounded-2xl text-charcoal/50 hover:bg-chile/10 hover:text-chile transition-colors">
            <X size={28} />
          </button>
          <h2 className="text-2xl font-serif font-black text-charcoal italic">
            Nueva Orden
          </h2>
        </div>

        <div className="flex gap-3">
          {/* Selector de tipo de orden con botones grandes para dedos */}
          <div className="flex bg-cream/30 p-1.5 rounded-2xl gap-1">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-hoja font-black text-xs uppercase tracking-widest">
              <Utensils size={16} /> Local
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-charcoal/40 font-black text-xs uppercase tracking-widest">
              <ShoppingBag size={16} /> Para llevar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-charcoal/40 font-black text-xs uppercase tracking-widest">
              <Truck size={16} /> Domicilio
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 2. CATÁLOGO: Grid de Productos (Lado Izquierdo) */}
        <section className="flex-1 overflow-y-auto p-6 bg-cream/10 custom-scrollbar">
          {/* Buscador interno para touch */}
          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20"
              size={20}
            />
            <input
              type="text"
              placeholder="¿Qué busca el cliente hoy?"
              className="w-full bg-white border-none rounded-3xl py-5 pl-12 pr-6 text-sm font-bold shadow-sm outline-none focus:ring-2 ring-hoja/20"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Ejemplo de Card de Producto */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <button
                key={i}
                className="bg-white p-4 rounded-4xl border border-cream shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group text-left"
              >
                <div className="aspect-square bg-cream/20 rounded-2xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-linear-to-tr from-cream to-white flex items-center justify-center text-charcoal/10 font-black italic">
                    PRODUCTO
                  </div>
                </div>
                <h3 className="font-serif font-black text-charcoal text-lg leading-tight mb-1">
                  Taco de Pastor Especial
                </h3>
                <p className="text-hoja font-black text-xl">$35.00</p>
              </button>
            ))}
          </div>
        </section>

        {/* 3. RESUMEN: El Ticket (Lado Derecho) */}
        <aside className="w-[400px] border-l border-cream flex flex-col bg-white shadow-2xl">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-chile/10 rounded-lg flex items-center justify-center text-chile">
                <ShoppingBag size={18} />
              </div>
              <h4 className="font-black text-charcoal uppercase tracking-[0.2em] text-[10px]">
                Detalle del Pedido
              </h4>
            </div>

            {/* Item del Carrito */}
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex flex-col gap-3 p-4 bg-cream/10 rounded-3xl border border-cream/20"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-serif font-black text-charcoal italic">
                      Tacos de Birria
                    </span>
                    <button className="text-chile/30 hover:text-chile">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-white rounded-xl border border-cream p-1 gap-4">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-cream/50 text-charcoal hover:bg-chile hover:text-white transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-black text-sm">3</span>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-cream/50 text-charcoal hover:bg-hoja hover:text-white transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-black text-charcoal">$105.00</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Datos del Cliente/Mesa */}
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-mostaza/5 rounded-2xl border border-mostaza/20">
                <p className="text-[10px] font-black text-mostaza uppercase mb-2">
                  Asignación
                </p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-[9px] text-charcoal/40 font-bold uppercase italic">
                      Mesa
                    </p>
                    <p className="font-serif font-black text-lg">12</p>
                  </div>
                  <div className="flex-2">
                    <p className="text-[9px] text-charcoal/40 font-bold uppercase italic">
                      Cliente
                    </p>
                    <p className="font-serif font-black text-lg">
                      Victor Armas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TOTAL Y ACCIÓN */}
          <div className="p-8 bg-cream/20 border-t border-cream">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest mb-1">
                  Importe Total
                </p>
                <p className="text-4xl font-serif font-black text-charcoal">
                  $250.00
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-hoja uppercase mb-1">
                  IVA Incluido
                </p>
                <p className="text-xs font-bold text-charcoal/40">
                  3 productos
                </p>
              </div>
            </div>

            <button className="w-full py-5 bg-hoja text-white rounded-4xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-hoja/20 hover:scale-[1.02] active:scale-95 transition-all">
              Generar Orden
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
