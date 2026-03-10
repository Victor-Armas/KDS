import { useState } from "react";
import {
  Loader2,
  XCircle,
  Banknote,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";
import { useChangeOrderStatus } from "../hooks/useAdminOrders";
import ConfirmModal from "@/shared/ConfirmModal";

export default function OrderAction({ order }) {
  const { mutate: updateStatus, isPending } = useChangeOrderStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  if (!order) return null;

  const isFinished = ["completed", "cancelled"].includes(order.status);
  if (isFinished) return null;

  const isPendingConfirmation = order.status === "pending_confirmation";
  const isAwaitingTransfer =
    order.status === "confirmed" && order.payment_method === "transfer";
  const isDineIn = order.type === "dine_in";

  const handleConfirmCancel = () => {
    updateStatus({ orderId: order.id, newStatus: "cancelled" });
    setIsModalOpen(false);
  };

  // --- DINE IN: flujo simple sin pago online ---
  if (isDineIn) {
    const nextStatus =
      order.status === "ready"
        ? "completed"
        : order.status === "preparing"
          ? "ready"
          : "preparing";
    const label =
      order.status === "ready"
        ? "Registrar Pago"
        : order.status === "preparing"
          ? "Marcar Listo"
          : "Enviar a Cocina";

    return (
      <div className="flex flex-row gap-2 w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          className="flex-1 py-4 bg-chile/10 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <XCircle size={14} />
          Cancelar
        </button>
        <button
          onClick={() =>
            updateStatus({ orderId: order.id, newStatus: nextStatus })
          }
          disabled={isPending}
          className="flex-2 py-4 bg-hoja text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : label}
        </button>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Cancelar Orden"
          message={`¿Cancelar la orden de ${order.target}? Esta acción no se puede deshacer.`}
          confirmText="Sí, Cancelar"
          cancelText="Volver"
          variant="danger"
        />
      </div>
    );
  }

  // --- PICKUP / DELIVERY: flujo con método de pago ---

  // Estado 1: pending_confirmation → elegir método de pago
  if (isPendingConfirmation) {
    const canConfirm = selectedPayment !== null;

    const handleConfirm = () => {
      if (!canConfirm) return;

      if (selectedPayment === "cash") {
        // Efectivo → directo a cocina
        updateStatus({
          orderId: order.id,
          newStatus: "preparing",
          paymentMethod: "cash",
        });
      } else {
        // Transferencia → esperar comprobante
        updateStatus({
          orderId: order.id,
          newStatus: "confirmed",
          paymentMethod: "transfer",
        });
      }
    };

    return (
      <div className="space-y-3 w-full">
        {/* Selector de método de pago */}
        <p className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest text-center">
          ¿Cómo va a pagar?
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedPayment("cash")}
            className={`py-3 px-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95
              ${
                selectedPayment === "cash"
                  ? "bg-hoja text-white border-hoja shadow-lg shadow-hoja/20"
                  : "bg-hoja/5 text-hoja border-hoja/20 hover:border-hoja/50"
              }`}
          >
            <Banknote size={16} />
            Efectivo
          </button>
          <button
            onClick={() => setSelectedPayment("transfer")}
            className={`py-3 px-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95
              ${
                selectedPayment === "transfer"
                  ? "bg-mostaza text-white border-mostaza shadow-lg shadow-mostaza/20"
                  : "bg-mostaza/5 text-mostaza border-mostaza/20 hover:border-mostaza/50"
              }`}
          >
            <ArrowRightLeft size={16} />
            Transferencia
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="flex-1 py-4 bg-chile/10 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle size={14} />
            Rechazar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isPending}
            className={`flex-2 py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2
              ${selectedPayment === "transfer" ? "bg-mostaza text-white" : "bg-hoja text-white"}`}
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : selectedPayment === "transfer" ? (
              "Solicitar Transferencia"
            ) : selectedPayment === "cash" ? (
              "Confirmar → Cocina"
            ) : (
              "Selecciona método"
            )}
          </button>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Rechazar Pedido"
          message={`¿Rechazar la orden de ${order.target}? Esta acción no se puede deshacer.`}
          confirmText="Sí, Rechazar"
          cancelText="Volver"
          variant="danger"
        />
      </div>
    );
  }

  // Estado 2: confirmed + transfer → esperando comprobante
  if (isAwaitingTransfer) {
    return (
      <div className="space-y-3 w-full">
        {/* Indicador de espera */}
        <div className="flex items-center gap-3 bg-mostaza/10 border border-mostaza/20 rounded-2xl px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-mostaza animate-pulse shrink-0" />
          <p className="text-xs font-black text-mostaza uppercase tracking-wider">
            Esperando transferencia
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="flex-1 py-4 bg-chile/10 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle size={14} />
            Cancelar
          </button>
          <button
            onClick={() =>
              updateStatus({ orderId: order.id, newStatus: "preparing" })
            }
            disabled={isPending}
            className="flex-2 py-4 bg-hoja text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={14} />
                Ya Pagó → Cocina
              </>
            )}
          </button>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Cancelar Orden"
          message={`¿Cancelar la orden de ${order.target}? Esta acción no se puede deshacer.`}
          confirmText="Sí, Cancelar"
          cancelText="Volver"
          variant="danger"
        />
      </div>
    );
  }

  // Estado 3: preparing / ready / on_the_way
  const nextStatus =
    order.status === "preparing"
      ? "ready"
      : order.status === "ready" && order.type === "delivery"
        ? "on_the_way"
        : "completed";

  const actionLabel =
    order.status === "preparing"
      ? "Marcar Listo"
      : order.status === "ready" && order.type === "delivery"
        ? "Entregar a Repartidor"
        : "Registrar Entrega";

  return (
    <div className="flex flex-row gap-2 w-full">
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="flex-1 py-4 bg-chile/10 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <XCircle size={14} />
        Cancelar
      </button>
      <button
        onClick={() =>
          updateStatus({ orderId: order.id, newStatus: nextStatus })
        }
        disabled={isPending}
        className="flex-2 py-4 bg-hoja text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          actionLabel
        )}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancelar Orden"
        message={`¿Cancelar la orden de ${order.target}? Esta acción no se puede deshacer.`}
        confirmText="Sí, Cancelar"
        cancelText="Volver"
        variant="danger"
      />
    </div>
  );
}
