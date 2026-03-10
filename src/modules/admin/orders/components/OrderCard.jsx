import {
  ORDER_TYPE_CONFIG,
  ORDER_STATUS_CONFIG,
  orderUtils,
} from "@/utils/orderUtils";
import { useOrderTimer } from "@/utils/useOrderTimer";
import { Clock, User, Banknote, ArrowRightLeft } from "lucide-react";

export default function OrderCard({ order, isSelected, onClick }) {
  const type = ORDER_TYPE_CONFIG[order.type] || ORDER_TYPE_CONFIG.dine_in;
  const statusInfo = ORDER_STATUS_CONFIG[order.status] || {};
  const { minutes } = useOrderTimer(order.time);
  const Icon = type.icon;

  const isReady = order.status === "ready";
  const isOnTheWay = order.status === "on_the_way";

  return (
    <div
      onClick={onClick}
      className={`relative flex bg-white rounded-3xl border-2 overflow-hidden transition-all cursor-pointer w-full
        ${isSelected ? "border-charcoal shadow-xl" : "border-cream hover:border-charcoal/10"}
        ${isReady ? "ring-2 ring-hoja/30" : ""}
        ${isOnTheWay ? "ring-2 ring-blue-400/30" : ""}
      `}
    >
      {/* Barra lateral */}
      <div
        className={`w-10 flex flex-col items-center justify-center ${type.color} text-white shrink-0 gap-3 py-4`}
      >
        <div className="-rotate-90 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
          {type.label}
        </div>
      </div>

      <div className="flex-1 px-2 py-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-row gap-2">
            <div
              className={`p-2 px-3 lg:px-2.5 rounded-xl ${type.color} text-white shadow-lg shrink-0 flex items-center`}
            >
              <Icon size={17} />
            </div>
            <div>
              <h3 className="font-serif font-black text-charcoal text-base">
                {order.type === "dine_in" && order.table
                  ? `Mesa ${order.table}`
                  : order.target}
              </h3>
              <div
                className={`flex items-center gap-1.5 ${statusInfo.color || "text-charcoal"} text-[10px] font-black uppercase tracking-tighter`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${statusInfo.dot || "bg-current"} ${isReady ? "animate-pulse" : ""}`}
                />
                {orderUtils(order.status)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-lg font-serif font-black text-charcoal">
              ${order.total}
            </p>
            <span className="text-mostaza font-serif text-[11px] font-black">
              #{order.order_number}
            </span>
          </div>
        </div>

        {/* Productos */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-1 mb-2 overflow-hidden max-h-16">
            {order.order_items?.map((item) => (
              <span
                key={item.id}
                className="px-1.5 py-0.5 bg-cream/30 rounded text-[10px] font-bold text-charcoal/55"
              >
                {item.quantity}x {item.product_name}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center border-t border-cream/50 pt-2 text-[10px] font-black text-charcoal/60 uppercase">
          <span className="flex items-center gap-1">
            <Clock size={10} /> {minutes ? `${minutes} MIN` : "0 MIN"}
          </span>

          {/* Badge de método de pago si ya está confirmado */}
          {order.payment_method && (
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black
              ${
                order.payment_method === "cash"
                  ? "bg-hoja/10 text-hoja"
                  : "bg-mostaza/10 text-mostaza"
              }`}
            >
              {order.payment_method === "cash" ? (
                <>
                  <Banknote size={9} /> Efectivo
                </>
              ) : (
                <>
                  <ArrowRightLeft size={9} /> Transfer
                </>
              )}
            </span>
          )}

          <span className="flex items-center gap-1">
            <User size={10} /> {order.waiter || "Staff"}
          </span>
        </div>
      </div>
    </div>
  );
}
