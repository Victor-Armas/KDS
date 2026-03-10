import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Clock } from "lucide-react";
import { useOrderHistory } from "../hooks/useOrderHistory";
import OrderStatusBadge from "../components/order/ OrderStatusBadge";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function OrderHistoryPage() {
  const { data: orders = [], isLoading, isError } = useOrderHistory();

  return (
    <div className="min-h-screen bg-cream dark:bg-stone-950 font-sans">
      {/* Header */}
      <header className="bg-softwhite dark:bg-stone-900 border-b border-cream dark:border-stone-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/online"
            className="p-2 rounded-xl hover:bg-cream dark:hover:bg-stone-800 text-charcoal/50 dark:text-stone-400 transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif font-bold text-charcoal dark:text-stone-100">
            Mis pedidos
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-cream dark:bg-stone-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-charcoal/40 dark:text-stone-500 py-12 text-sm">
            No se pudo cargar el historial.
          </p>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <p className="text-charcoal/40 dark:text-stone-500 font-medium">
              Aún no tienes pedidos
            </p>
            <Link
              to="/online"
              className="inline-block text-chile text-sm font-bold hover:underline"
            >
              Hacer mi primer pedido →
            </Link>
          </div>
        )}

        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/online/order/${order.id}`}
            className="block bg-softwhite dark:bg-stone-900 rounded-2xl border border-cream dark:border-stone-800 shadow-sm hover:shadow-md hover:border-mostaza/30 dark:hover:border-mostaza/30 transition-all p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif font-bold text-chile text-base">
                    {order.order_number}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Items preview */}
                <p className="text-xs text-charcoal/50 dark:text-stone-500 truncate">
                  {order.order_items
                    ?.map((i) => `${i.quantity}x ${i.product_name}`)
                    .join(", ")}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[11px] text-charcoal/40 dark:text-stone-600">
                    <Clock size={11} />
                    {formatDate(order.created_at)}
                  </span>
                  <span className="text-[11px] font-bold text-mostaza">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-charcoal/20 dark:text-stone-600 shrink-0 mt-1"
              />
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
