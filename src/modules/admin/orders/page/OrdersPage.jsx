import React from "react";
import OrderHeader from "../components/OrderHeader";
import OrderCard from "../components/OrderCard";
import MiniOrderCard from "../components/MiniOrderCard";
import OrderDetail from "../components/OrderDetail";
import { useUI } from "@/context/UIContext";
import { useOrdersLogic } from "../hooks/useOrdersLogic";

export default function OrderPage() {
  const { isSidebarOpen } = useUI();
  const {
    searchQuery,
    setSearchQuery,
    selectedOrderId,
    setSelectedOrderId,
    pendingOrders,
    activeOrders,
    selectedOrder,
  } = useOrdersLogic();

  return (
    /* MÓVIL (por defecto): 'relative', sin padding extra (hereda el p-4 de AdminLayout) y fluye hacia abajo.
      LAPTOP (lg): 'absolute inset-0' para secuestrar el espacio, 'lg:p-8' para recuperar el padding y 'lg:overflow-hidden' para frenar el scroll global.
    */
    <div className="relative lg:absolute lg:inset-0 flex flex-col gap-6 lg:p-8 lg:overflow-hidden z-20">
      <OrderHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-6 relative">
        {/* COLUMNA 1: POR CONFIRMAR */}
        <section className="w-full lg:w-65 flex flex-col shrink-0 min-h-0">
          <h2 className="text-[12px] font-extrabold uppercase text-mostaza tracking-[0.2em] px-2 mb-4 shrink-0">
            Por Confirmar ({pendingOrders.length})
          </h2>

          {/* MÓVIL: Quitamos el h-[35vh] y el overflow-y-auto. Crece con su contenido.
              LAPTOP: Activa el lg:flex-1 y lg:overflow-y-auto para scroll interno. */}
          <div className="lg:flex-1 lg:overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col gap-3">
              {pendingOrders.map((order) => (
                <MiniOrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* COLUMNA 2: EN PROCESO */}
        <section className="flex-1 flex flex-col min-h-0">
          <h2 className="text-[12px] font-extrabold uppercase text-hoja/80 tracking-[0.2em] px-2 mb-4 shrink-0">
            En Proceso ({activeOrders.length})
          </h2>

          {/* Igual que la columna 1: liberamos el scroll en móvil */}
          <div className="lg:flex-1 lg:overflow-y-auto pr-2 custom-scrollbar">
            <div
              className={`grid gap-4 pb-10 transition-all duration-300 ${
                isSidebarOpen
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
              }`}
            >
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* DETALLE (Aside) */}
        <aside
          className={`fixed inset-y-0 right-0 z-100 
          w-full sm:w-112.5
          bg-white shadow-2xl transition-transform duration-300
          top-15 h-[calc(100dvh-60px)]
          transform flex flex-col
          lg:top-0 lg:h-full
          xl:relative xl:translate-x-0 xl:z-0 
          xl:w-[400px] xl:shadow-xl xl:rounded-[2.5rem] 
          xl:border xl:border-cream xl:shrink-0
          ${selectedOrder ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrderId(null)}
          />
        </aside>

        {/* OVERLAY PARA MÓVIL/TABLET */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-90 xl:hidden"
            onClick={() => setSelectedOrderId(null)}
          />
        )}
      </div>
    </div>
  );
}
