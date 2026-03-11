import { useOrderTimer } from "@/utils/useOrderTimer";
import { Clock } from "lucide-react";
import { ORDER_TYPE_CONFIG } from "@/utils/orderUtils";

export default function KitchenMiniCard({ order, isSelected, onClick }) {
  const { minutes, styles } = useOrderTimer(order.time);
  const type = ORDER_TYPE_CONFIG[order.type] || ORDER_TYPE_CONFIG.dine_in;
  const Icon = type.icon;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all
        bg-softwhite dark:bg-[#1e1c1a]
        ${
          isSelected
            ? "border-charcoal dark:border-white/30 shadow-lg"
            : "border-cream dark:border-white/5 hover:border-charcoal/20 dark:hover:border-white/10"
        }`}
    >
      {/* Type icon */}
      <div
        className={`w-9 h-9 rounded-xl ${type.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
      >
        <Icon size={16} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-serif font-black text-charcoal dark:text-stone-100 text-sm truncate">
          {order.table ? `Mesa ${order.table}` : order.target}
        </p>
        <p className="text-[10px] font-bold text-charcoal/40 dark:text-white/30 truncate">
          #{order.order_number}
        </p>
      </div>

      {/* Timer */}
      <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${styles}`}>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {minutes} min
        </span>
      </div>

      {/* Total */}
      <p className="text-sm font-black text-charcoal dark:text-stone-100 shrink-0">
        ${order.total}
      </p>
    </div>
  );
}
