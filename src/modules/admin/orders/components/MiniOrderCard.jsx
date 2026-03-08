import { useOrderTimer } from "@/utils/useOrderTimer";
import { Clock, AlertTriangle } from "lucide-react";

export default function MiniOrderCard({ order, isSelected, onClick }) {
  const { minutes } = useOrderTimer(order.time);

  // Tu lógica de urgencia
  const isUrgent = minutes >= 30;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border-2 cursor-pointer transition-all flex overflow-hidden min-h-21.25
      ${
        isSelected
          ? "border-mostaza bg-white shadow-xl scale-[0.98] z-10"
          : "border-cream bg-white hover:border-mostaza/30"
      }`}
    >
      {/* BARRA LATERAL DE URGENCIA */}
      {isUrgent && (
        <div className="w-8 bg-chile flex flex-col items-center justify-center shrink-0 gap-2 py-2 animate-pulse">
          {/* Usamos el AlertTriangle aquí */}
          <AlertTriangle size={14} className="text-white" />
          <span
            className="text-[9px] font-black text-white uppercase tracking-tighter"
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          >
            Urgente
          </span>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-4 flex flex-col justify-center gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[13px] font-black text-charcoal truncate pr-2">
            {order.target}
          </span>
          <span className="text-[13px] font-serif font-black text-mostaza">
            #{order.order_number}
          </span>
        </div>

        <div className="flex items-center justify-between text-[12px]  font-bold text-charcoal/50 uppercase">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 ${isUrgent ? "text-chile font-black" : ""}`}
            >
              <Clock size={12} />
              {minutes ? `${minutes} MIN` : "0 MIN"}
            </span>
          </div>
          <span className="text-charcoal/80 ">${order.total}</span>
        </div>
      </div>
    </div>
  );
}
