import { useOrderTimer } from "@/utils/useOrderTimer";
import { Clock, Utensils, ShoppingBag, Truck } from "lucide-react";

const TYPE_CONFIG = {
  dine_in: { icon: Utensils, label: "Mesa", color: "bg-hoja/80" },
  pickup: { icon: ShoppingBag, label: "Llevar", color: "bg-mostaza/80" },
  delivery: { icon: Truck, label: "Domicilio", color: "bg-blue-500/80" },
};

export default function KitchenMiniCard({ order, isSelected, onClick }) {
  const { minutes } = useOrderTimer(order.time);
  const type = TYPE_CONFIG[order.type] || TYPE_CONFIG.dine_in;
  const Icon = type.icon;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all bg-white
        ${
          isSelected
            ? "border-mostaza shadow-md"
            : "border-cream hover:border-charcoal/20"
        }`}
    >
      {/* Tipo - icono con tamaño cómodo */}
      <div
        className={`w-8 h-8 rounded-xl ${type.color} flex items-center justify-center shrink-0`}
      >
        <Icon size={15} className="text-white" />
      </div>

      {/* Nombre + número */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-[13px] font-black text-charcoal truncate">
          {order.type === "dine_in" && order.table
            ? `Mesa ${order.table}`
            : order.target}
        </span>
        <span className="text-[10px] font-bold text-charcoal/30 shrink-0">
          #{order.order_number}
        </span>
      </div>

      {/* Timer + Total */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1 text-[11px] font-bold text-charcoal/40">
          <Clock size={10} />
          {minutes ? `${minutes}m` : "0m"}
        </span>
        <span className="text-[12px] font-black text-charcoal/70">
          ${order.total}
        </span>
      </div>
    </div>
  );
}
