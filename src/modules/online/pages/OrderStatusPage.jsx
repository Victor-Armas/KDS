import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, ShoppingBag, Truck } from "lucide-react";
import { useOrderById } from "../hooks/useOrder";
import OrderStatusBadge from "../components/order/ OrderStatusBadge";

const STATUS_STEPS = {
  pickup: ["pending_confirmation", "preparing", "ready", "completed"],
  delivery: [
    "pending_confirmation",
    "preparing",
    "ready",
    "on_the_way",
    "completed",
  ],
};

const STEP_LABELS = {
  pending_confirmation: "Por confirmar",
  preparing: "En cocina",
  ready: "Listo",
  on_the_way: "En camino",
  completed: "Entregado",
};

export default function OrderStatusPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useOrderById(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-stone-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-chile border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-cream dark:bg-stone-950 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-charcoal/50 dark:text-stone-500 text-center">
          No encontramos ese pedido.
        </p>
        <Link
          to="/online"
          className="text-chile font-medium text-sm hover:underline"
        >
          Volver al menú
        </Link>
      </div>
    );
  }

  const steps = STATUS_STEPS[order.order_type] ?? STATUS_STEPS.pickup;
  const currentStep = steps.indexOf(order.status);
  const isDelivery = order.order_type === "delivery";

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
          <div>
            <h1 className="font-serif font-bold text-charcoal dark:text-stone-100">
              Estado del pedido
            </h1>
            <p className="text-xs text-charcoal/50 dark:text-stone-500">
              {order.order_number}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Status card */}
        <div className="bg-softwhite dark:bg-stone-900 rounded-3xl p-6 space-y-4 border border-cream dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal/40 dark:text-stone-500 uppercase tracking-wider font-bold">
                Hola, {order.guest_name}
              </p>
              <p className="font-serif font-bold text-2xl text-chile mt-1">
                {order.order_number}
              </p>
            </div>
            <div
              className={`p-3 rounded-2xl ${isDelivery ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "bg-mostaza/10 text-mostaza"}`}
            >
              {isDelivery ? <Truck size={24} /> : <ShoppingBag size={24} />}
            </div>
          </div>

          <OrderStatusBadge status={order.status} size="lg" />

          {/* Progress steps */}
          <div className="pt-2">
            <div className="flex items-center gap-0">
              {steps.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                const isLast = i === steps.length - 1;
                return (
                  <div
                    key={step}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          done
                            ? "bg-hoja border-hoja"
                            : "bg-transparent border-cream dark:border-stone-700"
                        } ${active ? "scale-125 shadow-md shadow-hoja/30" : ""}`}
                      />
                      <span
                        className={`text-[9px] font-bold uppercase tracking-tight text-center whitespace-nowrap ${
                          done
                            ? "text-hoja"
                            : "text-charcoal/30 dark:text-stone-600"
                        }`}
                      >
                        {STEP_LABELS[step]}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${
                          i < currentStep
                            ? "bg-hoja"
                            : "bg-cream dark:bg-stone-800"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-softwhite dark:bg-stone-900 rounded-3xl p-6 border border-cream dark:border-stone-800 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-charcoal/40 dark:text-stone-500 mb-4">
            Tu pedido
          </h3>
          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-chile/10 text-chile text-xs font-black rounded-lg flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <span className="text-sm text-charcoal dark:text-stone-200 font-medium">
                    {item.product_name}
                  </span>
                </div>
                <span className="text-xs font-bold text-charcoal/40 dark:text-stone-500">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-cream dark:border-stone-800 flex justify-between items-center">
            <span className="text-sm font-bold text-charcoal/60 dark:text-stone-400">
              Total
            </span>
            <span className="text-xl font-serif font-black text-charcoal dark:text-stone-100">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery address */}
        {order.address && (
          <div className="bg-softwhite dark:bg-stone-900 rounded-3xl p-6 border border-cream dark:border-stone-800 shadow-sm flex gap-3">
            <MapPin size={18} className="text-chile shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-charcoal/40 dark:text-stone-500 uppercase tracking-wider mb-1">
                Dirección de entrega
              </p>
              <p className="text-sm text-charcoal dark:text-stone-200">
                {order.address}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="bg-mostaza/5 dark:bg-mostaza/10 rounded-3xl p-5 border border-mostaza/20">
            <p className="text-xs font-bold text-mostaza uppercase tracking-wider mb-1">
              Notas
            </p>
            <p className="text-sm text-charcoal/70 dark:text-stone-400">
              {order.notes}
            </p>
          </div>
        )}

        <Link
          to="/online"
          className="block text-center text-sm text-charcoal/40 dark:text-stone-600 hover:text-chile transition py-2"
        >
          ← Volver al menú
        </Link>
      </main>
    </div>
  );
}
