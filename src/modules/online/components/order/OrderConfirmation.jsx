import { CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "./ OrderStatusBadge";

export default function OrderConfirmation({ order, onClose }) {
  if (!order) return null;

  const isDelivery = order.order_type === "delivery";

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-softwhite dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden text-center">
        {/* Success header */}
        <div className="bg-hoja/10 dark:bg-hoja/20 px-6 pt-8 pb-6">
          <div className="w-16 h-16 bg-hoja rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-hoja/30">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal dark:text-stone-100">
            ¡Pedido recibido!
          </h2>
          <p className="text-sm text-charcoal/60 dark:text-stone-400 mt-1">
            {order.guest_name}, en breve confirmamos tu orden
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Order number */}
          <div className="bg-cream dark:bg-stone-800 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-black text-charcoal/40 dark:text-stone-500 uppercase tracking-widest mb-1">
              Número de orden
            </p>
            <p className="text-2xl font-serif font-black text-chile">
              {order.order_number}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center">
            <OrderStatusBadge status={order.status} size="lg" />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 bg-mostaza/5 dark:bg-mostaza/10 border border-mostaza/20 rounded-2xl px-4 py-3 text-left">
            <Clock size={16} className="text-mostaza shrink-0 mt-0.5" />
            <p className="text-xs text-charcoal/70 dark:text-stone-400 leading-relaxed">
              {isDelivery
                ? "Te avisaremos por WhatsApp cuando tu pedido esté en camino."
                : "Te avisaremos cuando tu pedido esté listo para recoger."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to={`/online/order/${order.id}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 bg-chile text-white rounded-2xl text-sm font-bold hover:bg-chile/90 transition-all shadow-md shadow-chile/20"
            >
              Ver estado del pedido
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm text-charcoal/50 dark:text-stone-500 hover:text-charcoal dark:hover:text-stone-300 transition font-medium"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
