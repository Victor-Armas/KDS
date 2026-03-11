// src/components/ui/OrderNotification.jsx
import { useEffect, useRef, useState } from "react";
import { UtensilsCrossed, ShoppingBag, Hash, User, X } from "lucide-react";

const ORDER_TYPE_CONFIG = {
  dine_in: {
    icon: UtensilsCrossed,
    label: "Mesa",
    color: "text-hoja",
    bg: "bg-hoja/10 dark:bg-hoja/15",
    border: "border-hoja/20 dark:border-hoja/25",
    dot: "bg-hoja",
  },
  pickup: {
    icon: ShoppingBag,
    label: "Para llevar",
    color: "text-mostaza",
    bg: "bg-mostaza/10 dark:bg-mostaza/15",
    border: "border-mostaza/20 dark:border-mostaza/25",
    dot: "bg-mostaza",
  },
  delivery: {
    icon: ShoppingBag,
    label: "Domicilio",
    color: "text-chile",
    bg: "bg-chile/10 dark:bg-chile/15",
    border: "border-chile/20 dark:border-chile/25",
    dot: "bg-chile",
  },
};

const DURATION = 6000; // ms antes de auto-cerrar

function OrderToast({ order, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);

  const config =
    ORDER_TYPE_CONFIG[order.order_type] || ORDER_TYPE_CONFIG.pickup;
  const TypeIcon = config.icon;

  const identifier =
    order.order_type === "dine_in"
      ? `Mesa ${order.table_number}`
      : order.guest_name || "Cliente";

  const identifierIcon =
    order.order_type === "dine_in" ? (
      <Hash size={11} className="shrink-0" />
    ) : (
      <User size={11} className="shrink-0" />
    );

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLeaving(true);
    setTimeout(() => onRemove(order._toastId), 350);
  };

  useEffect(() => {
    // Entrada con pequeño delay para que el DOM esté listo
    const enterTimer = setTimeout(() => setVisible(true), 20);
    timerRef.current = setTimeout(dismiss, DURATION);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`
        relative w-80 rounded-2xl border shadow-2xl overflow-hidden
        bg-softwhite dark:bg-[#1e1c1a]
        border-cream dark:border-white/8
        shadow-black/10 dark:shadow-black/50
        transition-all duration-350 ease-out
        ${
          visible && !leaving
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-95"
        }
      `}
    >
      {/* Barra de color lateral */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.dot}`} />

      {/* Progreso de auto-cierre */}
      <div className="absolute bottom-0 left-1 right-0 h-0.5 bg-cream dark:bg-white/5">
        <div
          className={`h-full ${config.dot} origin-left`}
          style={{
            animation: `shrink ${DURATION}ms linear forwards`,
          }}
        />
      </div>

      <div className="pl-5 pr-4 pt-4 pb-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Icono del tipo de orden */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}
            >
              <TypeIcon size={15} className={config.color} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 dark:text-white/30 leading-none mb-0.5">
                Nueva Orden
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.dot}`}
                />
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${config.color}`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={dismiss}
            className="p-1.5 rounded-lg text-charcoal/25 dark:text-white/20 hover:text-charcoal dark:hover:text-white hover:bg-cream dark:hover:bg-white/8 transition-all shrink-0"
          >
            <X size={13} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream dark:bg-white/6 mb-3" />

        {/* Info de la orden */}
        <div className="flex items-center justify-between gap-4">
          {/* Cliente / Mesa */}
          <div className="flex items-center gap-1.5 text-charcoal/60 dark:text-white/50 min-w-0">
            {identifierIcon}
            <span className="text-[12px] font-semibold text-charcoal dark:text-stone-200 truncate">
              {identifier}
            </span>
          </div>

          {/* Número de orden */}
          <div className="flex items-center gap-1 shrink-0">
            <Hash size={10} className="text-charcoal/30 dark:text-white/25" />
            <span className="text-[11px] font-black text-charcoal/40 dark:text-white/30 font-mono">
              {String(order.order_number || "—").padStart(4, "0")}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Container global de toasts ───────────────────────────────────────────────

let _addToast = null;

export function OrderNotificationContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = (order) => {
      setToasts((prev) => [
        ...prev,
        { ...order, _toastId: `${Date.now()}-${Math.random()}` },
      ]);
    };
    return () => {
      _addToast = null;
    };
  }, []);

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t._toastId !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 items-end">
      {toasts.map((order) => (
        <OrderToast key={order._toastId} order={order} onRemove={remove} />
      ))}
    </div>
  );
}

// Función para disparar una notificación desde cualquier lugar
export function showOrderNotification(order) {
  if (_addToast) _addToast(order);
}
