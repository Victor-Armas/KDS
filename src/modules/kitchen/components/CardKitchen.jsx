import { formatTime } from "@/utils/formatDate";
import { getOrderTypeConfig } from "@/utils/getOrderTypeConfig";
import { useOrderTimer } from "@/utils/useOrderTimer";
import { User, AlertCircle, CheckCircle2 } from "lucide-react";
import ItemCardKitchen from "./ItemCardKitchen";

export default function CardKitchen({ order }) {
  const {
    icon: Icon,
    text,
    bgColor,
    textColor,
  } = getOrderTypeConfig(order.order_type) ?? {};
  const createdTime = formatTime(order.created_at);
  const { minutes, styles, styleCard, bgButton } = useOrderTimer(
    order.created_at,
  );

  return (
    <article
      className={`bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden border-t-8 ${styleCard} h-fit`}
    >
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
              {order.order_number}
            </h3>
            <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3 mt-2 text-sm">
              <span
                className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-md ${bgColor} ${textColor} font-bold`}
              >
                {Icon && <Icon size={16} />}
                {text}
                {order.order_type === "dine_in" && order.table_number && (
                  <span className="font-semibold text-slate-700 whitespace-nowrap sm:ml-1">
                    · Mesa {order.table_number}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-medium truncate">
                <User size={14} className="shrink-0" />
                <span className="truncate">{order.guest_name}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className={`px-3 py-1 rounded-lg font-bold text-lg ${styles}`}>
              {minutes} min
            </div>
            <span className="text-xs text-slate-400 mt-1 font-medium">
              {createdTime}
            </span>
          </div>
        </div>

        <ul className="space-y-3 mt-4 border-t border-slate-100 pt-4">
          {order.order_items?.map((item) => (
            <ItemCardKitchen key={item.id} item={item} />
          ))}
        </ul>

        {order.notes && (
          <div className="mt-5 bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2 text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm font-semibold">{order.notes}</p>
          </div>
        )}
      </div>
      <button
        className={`w-full ${bgButton}  text-white font-bold py-3 sm:py-4 flex items-center justify-center gap-2 transition-colors active:bg-emerald-700 text-base sm:text-lg`}
      >
        <CheckCircle2 size={24} /> Listo
      </button>
    </article>
  );
}
