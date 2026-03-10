import { formatTime } from "@/utils/formatDate";
import { getOrderTypeConfig } from "@/utils/getOrderTypeConfig";
import { useOrderTimer } from "@/utils/useOrderTimer";
import { AlertCircle, CheckCircle2, Loader2, User } from "lucide-react";
import { useMarkAsReady } from "../hook/useKitchen";

export default function CardKitchen({ order }) {
  const {
    icon: Icon,
    text,
    bgColor,
    textColor,
  } = getOrderTypeConfig(order.order_type) ?? {};
  const createdTime = formatTime(order.preparing_at);
  const { minutes, status } = useOrderTimer(
    order.preparing_at || order.created_at,
  );
  const { mutate: markAsReady, isPending } = useMarkAsReady();

  const timerColors = {
    success: {
      pill: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      bar: "bg-emerald-500",
      card: "border-emerald-500/40",
    },
    warning: {
      pill: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      bar: "bg-amber-500",
      card: "border-amber-500/60",
    },
    danger: {
      pill: "bg-red-500/20 text-red-400 border-red-500/30",
      bar: "bg-red-500",
      card: "border-red-500 shadow-red-500/20 shadow-lg",
    },
  };

  const colors = timerColors[status] || timerColors.success;

  return (
    <article
      className={`relative flex flex-col bg-[#111110] rounded-2xl border overflow-hidden transition-all duration-300 ${colors.card}`}
    >
      {/* Barra de tiempo superior */}
      <div className="h-1 w-full bg-white/5">
        <div
          className={`h-full transition-all duration-1000 ${colors.bar}`}
          style={{ width: `${Math.min((minutes / 20) * 100, 100)}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Tipo de orden */}
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 ${bgColor} ${textColor}`}
          >
            {Icon && <Icon size={11} />}
            {text}
            {order.order_type === "dine_in" && order.table_number && (
              <span className="opacity-70">· {order.table_number}</span>
            )}
          </span>

          {/* Nombre cliente */}
          <span className="flex items-center gap-1 text-[11px] font-bold text-white/40 truncate">
            <User size={10} className="shrink-0" />
            {order.guest_name}
          </span>
        </div>

        {/* Número de orden */}
        <span className="text-[15px] font-black text-white/80 shrink-0">
          #{order.order_number}
        </span>
      </div>

      {/* Timer */}
      <div className="px-4 pb-3">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-black ${colors.pill}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${colors.bar} ${status === "danger" ? "animate-pulse" : ""}`}
          />
          {minutes} MIN
          <span className="font-normal opacity-60 text-[10px]">
            · {createdTime}
          </span>
        </div>
      </div>

      {/* Productos */}
      <ul className="flex-1 px-4 pb-3 space-y-1.5">
        {order.order_items?.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0"
          >
            <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black text-white shrink-0">
              {item.quantity}
            </span>
            <span className="text-sm font-bold text-white/80 leading-tight">
              {item.product_name}
            </span>
          </li>
        ))}
      </ul>

      {/* Notas */}
      {order.notes && (
        <div className="mx-4 mb-3 flex gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-red-300 leading-snug">
            {order.notes}
          </p>
        </div>
      )}

      {/* Botón Listo */}
      <button
        onClick={() => markAsReady(order.id)}
        disabled={isPending}
        className={`w-full py-4 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50
          ${
            status === "danger"
              ? "bg-red-500 hover:bg-red-400 text-white"
              : status === "warning"
                ? "bg-amber-500 hover:bg-amber-400 text-white"
                : "bg-emerald-500 hover:bg-emerald-400 text-white"
          }`}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <CheckCircle2 size={18} /> Listo
          </>
        )}
      </button>
    </article>
  );
}
