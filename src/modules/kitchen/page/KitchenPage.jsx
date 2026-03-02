// KitchenPage.jsx
import CardKitchen from "../components/CardKitchen";
import HeaderKitchen from "../components/HeaderKitchen";
import { getOrders } from "../hooks/useKitchen";

export default function KitchenPage() {
  const { data: orders = [], isLoading, isError, error } = getOrders();

  if (isLoading) return <p className="text-white p-6">Cargando...</p>;

  if (isError) {
    return <p className="text-red-400 p-6">Error: {error?.message}</p>;
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col font-sans">
      <HeaderKitchen orders={orders} />

      <main className="flex-1 p-4 sm:p-6 columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-4 sm:gap-6 overflow-y-auto">
        {orders.length === 0 ? (
          <p className="text-white p-6 col-span-full text-center">
            No hay pedidos activos
          </p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="inline-block w-full mb-4 sm:mb-6">
              <CardKitchen order={order} />
            </div>
          ))
        )}
      </main>
    </div>
  );
}
