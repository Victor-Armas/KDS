import React from "react";
import OrderHeader from "../components/OrderHeader";
import OrderCard from "../components/OrderCard";
import KitchenMiniCard from "../components/KitchenMiniCard";
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
    awaitingTransferOrders,
    readyOrders,
    onTheWayOrders,
    preparingOrders,
    selectedOrder,
  } = useOrdersLogic();

  const leftColumnOrders = [...pendingOrders, ...awaitingTransferOrders];
  const actionableOrders = [...readyOrders, ...onTheWayOrders];
  const totalInProcess = actionableOrders.length + preparingOrders.length;

  // Grid responsivo compartido basado en sidebar
  const gridCols = isSidebarOpen
    ? "grid-cols-1 2xl:grid-cols-2"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";

  return (
    <div className="relative lg:absolute lg:inset-0 flex flex-col gap-6 lg:p-8 lg:overflow-hidden z-20">
      <OrderHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        pickupReady={readyOrders.filter((o) => o.type === "pickup").length}
        deliveryOnTheWay={onTheWayOrders.length}
        pendingCount={pendingOrders.length + awaitingTransferOrders.length}
      />

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-6 relative">
        {/* COLUMNA 1: POR CONFIRMAR */}
        <section className="w-full lg:w-65 flex flex-col shrink-0 min-h-0">
          <h2 className="text-[12px] font-extrabold uppercase text-mostaza tracking-[0.2em] px-2 mb-4 shrink-0">
            Por Confirmar ({leftColumnOrders.length})
          </h2>
          <div className="lg:flex-1 lg:overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col gap-3">
              {leftColumnOrders.length === 0 ? (
                <p className="text-[11px] text-charcoal/30 font-bold uppercase tracking-widest px-2 py-6 text-center">
                  Sin órdenes pendientes
                </p>
              ) : (
                leftColumnOrders.map((order) => (
                  <MiniOrderCard
                    key={order.id}
                    order={order}
                    isSelected={selectedOrderId === order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* COLUMNA 2: EN PROCESO */}
        <section className="flex-1 flex flex-col min-h-0">
          <h2 className="text-[12px] font-extrabold uppercase text-hoja/80 tracking-[0.2em] px-2 mb-4 shrink-0">
            En Proceso ({totalInProcess})
          </h2>

          <div className="lg:flex-1 lg:overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-10">
            {/* LISTOS PARA ENTREGAR */}
            {actionableOrders.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-hoja px-1 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-hoja animate-pulse inline-block" />
                  Listos para entregar ({actionableOrders.length})
                </p>
                <div
                  className={`grid gap-4 transition-all duration-300 ${gridCols}`}
                >
                  {actionableOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isSelected={selectedOrderId === order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* EN COCINA */}
            {preparingOrders.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40 px-1 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-charcoal/20 inline-block" />
                  En cocina ({preparingOrders.length})
                </p>
                <div
                  className={`grid gap-2 transition-all duration-300 ${gridCols}`}
                >
                  {preparingOrders.map((order) => (
                    <KitchenMiniCard
                      key={order.id}
                      order={order}
                      isSelected={selectedOrderId === order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {totalInProcess === 0 && (
              <p className="text-[11px] text-charcoal/30 font-bold uppercase tracking-widest px-2 py-6 text-center">
                Sin órdenes en proceso
              </p>
            )}
          </div>
        </section>

        {/* DETALLE */}
        <aside
          className={`fixed inset-y-0 right-0 z-100 
          w-full sm:w-112.5 bg-white shadow-2xl transition-transform duration-300
          top-15 h-[calc(100dvh-60px)] transform flex flex-col
          lg:top-0 lg:h-full
          xl:relative xl:translate-x-0 xl:z-0 
          xl:w-100 xl:shadow-xl xl:rounded-[2.5rem] 
          xl:border xl:border-cream xl:shrink-0
          ${selectedOrder ? "translate-x-0" : "translate-x-full"}`}
        >
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrderId(null)}
          />
        </aside>

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
