import { useState } from "react";
import {
  Loader2,
  XCircle,
  CheckCircle2,
  CreditCard,
  Banknote,
  Clock,
} from "lucide-react";
import { usechangeOrderStatus } from "../hooks/useAdminOrders";
import ConfirmModal from "@/shared/ConfirmModal";

export default function OrderAction({ order }) {
  const { mutate: updateStatus, isPending } = usechangeOrderStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  if (!order) return null;

  const isDineIn = order.type === "dine_in";
  const isPending_ = order.status === "pending_confirmation";
  const isConfirmed = order.status === "confirmed";
  const isFinished = ["completed", "cancelled"].includes(order.status);

  if (isFinished) return null;

  // ── DINE IN: flujo simple ─────────────────────────────────────────
  if (isDineIn) {
    const nextStatus = isPending_ ? "preparing" : "completed";
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          className="flex-1 py-3.5 bg-chile/10 dark:bg-chile/20 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <XCircle size={14} />
          {isPending_ ? "Rechazar" : "Cancelar"}
        </button>
        <button
          onClick={() =>
            updateStatus({ orderId: order.id, newStatus: nextStatus })
          }
          disabled={isPending}
          className={`flex-2 py-3.5 flex items-center justify-center gap-2 ${isPending_ ? "bg-mostaza" : "bg-hoja"} text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70`}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {isPending_ ? "Confirmar" : "Registrar Pago"}
        </button>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() =>
            updateStatus({ orderId: order.id, newStatus: "cancelled" })
          }
          title={isPending_ ? "Rechazar Pedido" : "Cancelar Pedido"}
          message={`¿Seguro que deseas ${isPending_ ? "rechazar" : "cancelar"} la orden de ${order.target}?`}
          confirmText="Sí, cancelar"
          cancelText="Volver"
          variant="danger"
        />
      </div>
    );
  }

  // ── PICKUP/DELIVERY: pending_confirmation — elegir método de pago ──
  if (isPending_) {
    return (
      <div className="space-y-3">
        <p className="text-[10px] font-black text-charcoal/40 dark:text-white/30 uppercase tracking-widest text-center">
          ¿Cómo va a pagar?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPayment("cash")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black border-2 transition-all ${
              selectedPayment === "cash"
                ? "border-hoja bg-hoja/10 dark:bg-hoja/20 text-hoja"
                : "border-cream dark:border-white/10 text-charcoal/40 dark:text-white/30 hover:border-hoja/30"
            }`}
          >
            <Banknote size={16} /> Efectivo
          </button>
          <button
            onClick={() => setSelectedPayment("transfer")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black border-2 transition-all ${
              selectedPayment === "transfer"
                ? "border-mostaza bg-mostaza/10 dark:bg-mostaza/20 text-mostaza"
                : "border-cream dark:border-white/10 text-charcoal/40 dark:text-white/30 hover:border-mostaza/30"
            }`}
          >
            <CreditCard size={16} /> Transferencia
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="flex-1 py-3 bg-chile/10 dark:bg-chile/20 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50"
          >
            Rechazar
          </button>
          <button
            onClick={() => {
              if (!selectedPayment) return;
              const newStatus =
                selectedPayment === "cash" ? "preparing" : "confirmed";
              updateStatus({
                orderId: order.id,
                newStatus,
                paymentMethod: selectedPayment,
              });
            }}
            disabled={isPending || !selectedPayment}
            className="flex-2 py-3 bg-mostaza text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}
            Confirmar Pedido
          </button>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() =>
            updateStatus({ orderId: order.id, newStatus: "cancelled" })
          }
          title="Rechazar Pedido"
          message={`¿Seguro que deseas rechazar la orden de ${order.target}?`}
          confirmText="Sí, rechazar"
          cancelText="Volver"
          variant="danger"
        />
      </div>
    );
  }

  // ── CONFIRMED + TRANSFER: esperando pago ──────────────────────────
  if (isConfirmed && order.payment_method === "transfer") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 bg-mostaza/10 dark:bg-mostaza/20 border border-mostaza/20 rounded-2xl px-4 py-3">
          <Clock size={15} className="text-mostaza shrink-0 animate-pulse" />
          <p className="text-xs font-black text-mostaza uppercase tracking-wider">
            Esperando transferencia...
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="flex-1 py-3 bg-chile/10 dark:bg-chile/20 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              updateStatus({
                orderId: order.id,
                newStatus: "preparing",
                paymentMethod: "transfer",
              })
            }
            disabled={isPending}
            className="flex-2 py-3 bg-hoja text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}
            Ya Pagó → Cocina
          </button>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() =>
            updateStatus({ orderId: order.id, newStatus: "cancelled" })
          }
          title="Cancelar Pedido"
          message={`¿Seguro que deseas cancelar la orden de ${order.target}?`}
          confirmText="Sí, cancelar"
          cancelText="Volver"
          variant="danger"
        />
      </div>
    );
  }

  // ── PREPARING / READY / ON_THE_WAY ────────────────────────────────
  const nextStatus =
    order.status === "ready" && order.type === "delivery"
      ? "on_the_way"
      : "completed";

  const actionLabel =
    {
      preparing: "Marcar Listo",
      ready: order.type === "delivery" ? "En Camino" : "Registrar Pago",
      on_the_way: "Entregado",
    }[order.status] || "Siguiente";

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="flex-1 py-3.5 bg-chile/10 dark:bg-chile/20 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <XCircle size={14} /> Cancelar
      </button>
      <button
        onClick={() =>
          updateStatus({ orderId: order.id, newStatus: nextStatus })
        }
        disabled={isPending}
        className="flex-2 py-3.5 bg-hoja text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <CheckCircle2 size={14} />
        )}
        {actionLabel}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() =>
          updateStatus({ orderId: order.id, newStatus: "cancelled" })
        }
        title="Cancelar Pedido"
        message={`¿Seguro que deseas cancelar la orden de ${order.target}?`}
        confirmText="Sí, cancelar"
        cancelText="Volver"
        variant="danger"
      />
    </div>
  );
}
