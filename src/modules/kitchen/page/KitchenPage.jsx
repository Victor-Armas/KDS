import CardKitchen from "../components/CardKitchen";
import HeaderKitchen from "../components/HeaderKitchen";
import { ChefHat } from "lucide-react";
import { useKitchen } from "../hook/useKitchen";

export default function KitchenPage() {
  const { data: orders = [], isLoading, isError, error } = useKitchen();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0d0d0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 font-black text-xs uppercase tracking-widest">
            Cargando órdenes...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen w-full bg-[#0d0d0c] flex items-center justify-center">
        <p className="text-red-400 font-bold">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0d0d0c] flex flex-col font-sans">
      <HeaderKitchen orders={orders} />

      {orders.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-10">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <ChefHat size={36} className="text-white/10" />
          </div>
          <div>
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">
              Sin órdenes activas
            </p>
            <p className="text-white/10 text-xs font-bold mt-1">
              Las nuevas órdenes aparecerán aquí automáticamente
            </p>
          </div>
        </div>
      ) : (
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 items-start">
            {orders.map((order) => (
              <CardKitchen key={order.id} order={order} />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
