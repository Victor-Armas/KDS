import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { usechangeOrderStatus } from "../hooks/useAdminOrders";
import ConfirmModal from "@/shared/ConfirmModal";

export default function OrderAction({ order }) {
  const { mutate: updateStatus, isPending } = usechangeOrderStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!order) return null;

  const orderPending = order.status === "pending_confirmation";
  const isFinished = ["completed", "cancelled"].includes(order.status);

  if (isFinished) return null;

  const handlePrimaryAction = () => {
    const nextStatus = orderPending ? "preparing" : "completed";
    updateStatus({ orderId: order.id, newStatus: nextStatus });
  };

  const handleConfirmCancel = () => {
    updateStatus({ orderId: order.id, newStatus: "cancelled" });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row gap-2 w-full">
      {/* BOTÓN CANCELAR/RECHAZAR */}
      <button
        onClick={() => setIsModalOpen(true)} // Abrimos el modal en vez del alert
        disabled={isPending}
        className="flex-1 py-4 bg-chile/10 text-chile border border-chile/20 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-chile hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <XCircle size={14} />
        {orderPending ? "Rechazar" : "Cancelar"}
      </button>

      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={handlePrimaryAction}
        disabled={isPending}
        className={`flex-2 py-4 flex items-center justify-center gap-2 ${
          orderPending ? "bg-mostaza" : "bg-hoja"
        } text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-70`}
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : orderPending ? (
          "Confirmar Pedido"
        ) : (
          "Registrar Pago"
        )}
      </button>

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title={orderPending ? "Rechazar Pedido" : "Cancelar Pedido"}
        message={`¿Estás seguro de que deseas ${orderPending ? "rechazar" : "cancelar"} la orden de ${order.target}? Esta acción no se puede deshacer.`}
        confirmText={orderPending ? "Sí, Rechazar" : "Sí, Cancelar"}
        cancelText="Volver"
        variant="danger"
      />
    </div>
  );
}
