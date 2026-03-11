import { Printer, X, Phone, MapPin, User, MessageCircle } from "lucide-react";
import { ORDER_TYPE_CONFIG, ORDER_STATUS_CONFIG } from "@/utils/orderUtils";
import EmptyOrder from "./EmptyOrder";
import OrderAction from "./OrderAction";

export default function OrderDetail({ order, onClose }) {
  if (!order) return <EmptyOrder />;

  const typeInfo = ORDER_TYPE_CONFIG[order.type] || ORDER_TYPE_CONFIG.dine_in;
  const statusInfo = ORDER_STATUS_CONFIG[order.status] || {};
  const Icon = typeInfo.icon;

  const phone = order.phone;
  const address = order.address;
  const hasCustomerInfo = phone || address;

  return (
    <div className="flex flex-col h-full bg-softwhite dark:bg-[#1e1c1a] relative xl:rounded-2xl overflow-hidden transition-colors duration-300">
      {/* CABECERA */}
      <div className="p-4 border-b border-cream/50 dark:border-white/5 bg-cream/30 dark:bg-white/[0.03]">
        {/* Mobile close */}
        <div className="flex xl:hidden flex-row justify-between items-center mb-2">
          <div className="bg-chile text-white px-3 py-1 rounded-lg italic font-black text-xs shadow-lg shadow-chile/20">
            #{order.order_number || order.id?.toString().slice(-4)}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream dark:hover:bg-white/5 rounded-full text-charcoal/20 dark:text-white/20 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-row items-start gap-3 flex-1 min-w-0">
            <div
              className={`p-3 rounded-2xl ${typeInfo.color} text-white shadow-lg shrink-0`}
            >
              <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-charcoal dark:text-stone-100 leading-tight break-words">
                {order.target}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}
                >
                  {typeInfo.label} · {statusInfo.label}
                </span>
                {/* Payment method badge */}
                {order.payment_method && (
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      order.payment_method === "cash"
                        ? "bg-hoja/10 text-hoja border-hoja/20"
                        : "bg-mostaza/10 text-mostaza border-mostaza/20"
                    }`}
                  >
                    {order.payment_method === "cash"
                      ? "Efectivo"
                      : "Transferencia"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop order number */}
          <div className="hidden xl:block bg-chile text-white px-3 py-1 rounded-lg italic font-black text-xs shrink-0">
            #{order.order_number || order.id?.toString().slice(-4)}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Customer info */}
        {hasCustomerInfo && (
          <div className="p-4 bg-mostaza/5 dark:bg-mostaza/10 border-b border-mostaza/10 dark:border-mostaza/10">
            <div className="bg-softwhite dark:bg-[#2a2520] rounded-2xl p-4 shadow-sm border border-mostaza/20 dark:border-mostaza/20">
              <div className="flex items-center gap-2 mb-3">
                <User size={15} className="text-mostaza" />
                <p className="font-black text-charcoal dark:text-stone-100 italic text-sm">
                  Información del cliente
                </p>
              </div>
              <div className="space-y-3">
                {phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-charcoal/60 dark:text-white/40">
                      <Phone size={13} />
                      <span className="text-xs font-bold">{phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${phone}`}
                        className="p-1.5 bg-hoja/10 text-hoja rounded-lg hover:bg-hoja/20 transition"
                      >
                        <Phone size={13} />
                      </a>
                      <a
                        href={`https://wa.me/${phone.replace(/\s+/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition"
                      >
                        <MessageCircle size={13} />
                      </a>
                    </div>
                  </div>
                )}
                {address && (
                  <div className="flex items-start gap-2 pt-2 border-t border-cream/50 dark:border-white/5">
                    <MapPin size={13} className="text-chile mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-charcoal/70 dark:text-white/50 leading-relaxed italic">
                      {address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <div className="p-4 sm:p-6 space-y-3">
          <p className="text-[10px] font-black uppercase text-charcoal/20 dark:text-white/20 tracking-[0.2em]">
            Productos
          </p>
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center group"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-cream/50 dark:bg-white/5 flex items-center justify-center font-black text-chile text-xs group-hover:bg-chile group-hover:text-white transition-all">
                  {item.quantity}
                </span>
                <p className="text-sm font-bold text-charcoal/80 dark:text-stone-300 italic">
                  {item.product_name}
                </p>
              </div>
              <span className="text-xs font-bold text-charcoal/30 dark:text-white/20">
                ${item.unit_price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-5 py-4 bg-cream/30 dark:bg-black/20 border-t border-cream dark:border-white/5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[10px] font-black text-charcoal/30 dark:text-white/20 tracking-widest uppercase">
              Total
            </span>
            <p className="text-3xl font-serif font-black text-charcoal dark:text-stone-100">
              ${order.total}
            </p>
          </div>
          <button className="p-3 bg-softwhite dark:bg-white/5 rounded-2xl border border-cream dark:border-white/5 text-charcoal/40 dark:text-white/30 hover:text-charcoal dark:hover:text-white transition-colors">
            <Printer size={20} />
          </button>
        </div>
        <OrderAction order={order} />
      </div>
    </div>
  );
}
