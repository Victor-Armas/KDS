import { useOrderTimer } from "@/utils/useOrderTimer";
import { Clock, AlertTriangle, ArrowRightLeft } from "lucide-react";

export default function MiniOrderCard({ order, isSelected, onClick }) {
  const { minutes } = useOrderTimer(order.time);

  const isUrgent = minutes >= 30;
  const isAwaitingTransfer =
    order.status === "confirmed" && order.payment_method === "transfer";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border-2 cursor-pointer transition-all flex overflow-hidden min-h-21.25
      ${
        isSelected
          ? "border-mostaza bg-white shadow-xl scale-[0.98] z-10"
          : isAwaitingTransfer
            ? "border-mostaza/40 bg-mostaza/5 hover:border-mostaza/70"
            : "border-cream bg-white hover:border-mostaza/30"
      }`}
    >
      {/* BARRA LATERAL */}
      {isUrgent && !isAwaitingTransfer && (
        <div className="w-8 bg-chile flex flex-col items-center justify-center shrink-0 gap-2 py-2 animate-pulse">
          <AlertTriangle size={14} className="text-white" />
          <span
            className="text-[9px] font-black text-white uppercase tracking-tighter"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            Urgente
          </span>
        </div>
      )}

      {isAwaitingTransfer && (
        <div className="w-8 bg-mostaza flex flex-col items-center justify-center shrink-0 gap-2 py-2">
          <ArrowRightLeft size={14} className="text-white" />
          <span
            className="text-[9px] font-black text-white uppercase tracking-tighter"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            Transfer
          </span>
        </div>
      )}

      {/* CONTENIDO */}
      <div className="flex-1 p-4 flex flex-col justify-center gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[13px] font-black text-charcoal truncate pr-2">
            {order.target}
          </span>
          <span className="text-[13px] font-serif font-black text-mostaza">
            #{order.order_number}
          </span>
        </div>

        <div className="flex items-center justify-between text-[12px] font-bold text-charcoal/50 uppercase">
          <div className="flex items-center gap-2">
            {isAwaitingTransfer ? (
              <span className="flex items-center gap-1.5 text-mostaza font-black animate-pulse">
                <ArrowRightLeft size={11} />
                Esperando transfer.
              </span>
            ) : (
              <span
                className={`flex items-center gap-1.5 ${isUrgent ? "text-chile font-black" : ""}`}
              >
                <Clock size={12} />
                {minutes ? `${minutes} MIN` : "0 MIN"}
              </span>
            )}
          </div>
          <span className="text-charcoal/80">${order.total}</span>
        </div>
      </div>
    </div>
  );
}
