import {
  Printer,
  X,
  Phone,
  MapPin,
  User,
  MessageCircle,
  Banknote,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ORDER_TYPE_CONFIG, ORDER_STATUS_CONFIG } from "@/utils/orderUtils";
import EmptyOrder from "./EmptyOrder";
import OrderAction from "./OrderAction";

const PAYMENT_METHOD_CONFIG = {
  cash: {
    icon: Banknote,
    label: "Efectivo",
    color: "text-hoja",
    bg: "bg-hoja/10",
  },
  transfer: {
    icon: ArrowRightLeft,
    label: "Transferencia",
    color: "text-mostaza",
    bg: "bg-mostaza/10",
  },
};

export default function OrderDetail({ order, onClose }) {
  if (!order) return <EmptyOrder />;

  const typeInfo = ORDER_TYPE_CONFIG[order.type] || ORDER_TYPE_CONFIG.dine_in;
  const statusInfo = ORDER_STATUS_CONFIG[order.status] || {};
  const Icon = typeInfo.icon;

  const phone = order.phone;
  const address = order.address;
  const hasCustomerInfo = phone || address;

  const paymentConfig = order.payment_method
    ? PAYMENT_METHOD_CONFIG[order.payment_method]
    : null;
  const PaymentIcon = paymentConfig?.icon;

  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";

  return (
    <div className="flex flex-col h-full bg-white relative xl:rounded-2xl overflow-hidden">
      {/* CABECERA */}
      <div className="p-4 border-b border-cream/50 bg-cream/50">
        <div className="flex xl:hidden flex-row justify-between items-center mb-2">
          <div className="bg-chile text-white px-3 py-1 rounded-lg italic font-black text-xs shadow-lg shadow-chile/20">
            #{order.order_number || order.id?.toString().slice(-4)}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream rounded-full text-charcoal/20"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-row items-start gap-4 flex-1 min-w-0">
            <div
              className={`p-3 rounded-2xl ${typeInfo.color} text-white shadow-lg shrink-0`}
            >
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-charcoal leading-tight break-words">
                {order.type === "dine_in" && order.table
                  ? `Mesa ${order.table}`
                  : order.target}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}
                >
                  {typeInfo.label} · {statusInfo.label}
                </span>
                {/* Badge método de pago */}
                {paymentConfig && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${paymentConfig.bg} ${paymentConfig.color}`}
                  >
                    <PaymentIcon size={9} />
                    {paymentConfig.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="hidden xl:block bg-chile text-white px-3 py-1 rounded-lg italic font-black text-xs shrink-0">
            #{order.order_number || order.id?.toString().slice(-4)}
          </div>
        </div>
      </div>

      {/* BODY SCROLLABLE */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Info del cliente */}
        {hasCustomerInfo && (
          <div className="p-4 bg-mostaza/5 border-b border-mostaza/10">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-mostaza/20">
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-mostaza" />
                <p className="font-black text-charcoal italic text-sm">
                  Información del cliente
                </p>
              </div>
              <div className="space-y-3">
                {phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-charcoal/60">
                      <Phone size={14} />
                      <span className="text-xs font-bold">{phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${phone}`}
                        className="p-2 bg-hoja/10 text-hoja rounded-lg"
                      >
                        <Phone size={14} />
                      </a>
                      <a
                        href={`https://wa.me/${phone.replace(/\s+/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-green-500/10 text-green-600 rounded-lg"
                      >
                        <MessageCircle size={14} />
                      </a>
                    </div>
                  </div>
                )}
                {address && (
                  <div className="flex items-start gap-2 pt-2 border-t border-cream/50">
                    <MapPin size={14} className="text-chile mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-charcoal/70 leading-relaxed italic">
                      {address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Productos */}
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-[10px] font-black uppercase text-charcoal/20 tracking-[0.2em]">
            Productos
          </p>
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-cream/50 flex items-center justify-center font-black text-chile text-xs group-hover:bg-chile group-hover:text-white transition-all">
                  {item.quantity}
                </span>
                <p className="text-sm font-bold text-charcoal/80 italic">
                  {item.product_name}
                </p>
              </div>
              <span className="text-xs font-bold text-charcoal/30">
                ${item.unit_price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 bg-cream/50 border-t border-cream">
        {/* Total + Imprimir */}
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-charcoal/30 tracking-widest">
              TOTAL
            </span>
            <p className="text-3xl font-serif font-black text-charcoal">
              ${order.total}
            </p>
          </div>
          <button className="p-3 bg-white rounded-2xl border border-cream text-charcoal/30 hover:text-charcoal transition-colors">
            <Printer size={22} />
          </button>
        </div>

        {/* Badge estado final */}
        {isCompleted && (
          <div className="flex items-center gap-2 bg-hoja/10 border border-hoja/20 rounded-2xl px-4 py-3 mb-3">
            <CheckCircle2 size={16} className="text-hoja shrink-0" />
            <p className="text-xs font-black text-hoja uppercase tracking-wider">
              Orden completada
              {order.payment_confirmed_at && (
                <span className="font-normal normal-case ml-1 text-hoja/60">
                  ·{" "}
                  {new Date(order.payment_confirmed_at).toLocaleTimeString(
                    "es-MX",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    },
                  )}
                </span>
              )}
            </p>
          </div>
        )}

        {isCancelled && (
          <div className="flex items-center gap-2 bg-chile/10 border border-chile/20 rounded-2xl px-4 py-3 mb-3">
            <XCircle size={16} className="text-chile shrink-0" />
            <p className="text-xs font-black text-chile uppercase tracking-wider">
              Orden cancelada
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <OrderAction order={order} />
      </div>
    </div>
  );
}
