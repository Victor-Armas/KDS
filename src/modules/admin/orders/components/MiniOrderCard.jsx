import { useOrderTimer } from "@/utils/useOrderTimer";
import { Clock, AlertTriangle } from "lucide-react";

export default function MiniOrderCard({ order, isSelected, onClick }) {
  const { minutes } = useOrderTimer(order.time);
  const isUrgent = minutes >= 30;
  const isAwaitingTransfer =
    order.status === "confirmed" && order.payment_method === "transfer";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border-2 cursor-pointer transition-all flex overflow-hidden min-h-[85px]
        ${
          isSelected
            ? "border-mostaza bg-softwhite dark:bg-[#2a2520] shadow-xl scale-[0.98] z-10"
            : "border-cream dark:border-white/5 bg-softwhite dark:bg-[#1e1c1a] hover:border-mostaza/40 dark:hover:border-mostaza/30"
        }`}
    >
      {/* Barra lateral urgente */}
      {isUrgent && !isAwaitingTransfer && (
        <div className="w-8 bg-chile flex flex-col items-center justify-center shrink-0 gap-2 py-2 animate-pulse">
          <AlertTriangle size={13} className="text-white" />
          <span
            className="text-[9px] font-black text-white uppercase tracking-tighter"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            Urgente
          </span>
        </div>
      )}

      {/* Barra lateral transfer */}
      {isAwaitingTransfer && (
        <div className="w-8 bg-mostaza flex flex-col items-center justify-center shrink-0 gap-1 py-2">
          <span
            className="text-[8px] font-black text-white uppercase tracking-tighter"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            Transfer
          </span>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 p-3 flex flex-col justify-center gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[13px] font-black text-charcoal dark:text-stone-100 truncate pr-2">
            {order.target}
          </span>
          <span className="text-[13px] font-serif font-black text-mostaza shrink-0">
            #{order.order_number}
          </span>
        </div>

        {isAwaitingTransfer ? (
          <span className="text-[11px] font-black text-mostaza animate-pulse uppercase tracking-tight">
            Esperando transferencia...
          </span>
        ) : (
          <div className="flex items-center justify-between text-[11px] font-bold text-charcoal/40 dark:text-white/30 uppercase">
            <span
              className={`flex items-center gap-1 ${isUrgent ? "text-chile font-black" : ""}`}
            >
              <Clock size={11} />
              {minutes ? `${minutes} MIN` : "0 MIN"}
            </span>
            <span className="text-charcoal/60 dark:text-white/50 font-black">
              ${order.total}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
