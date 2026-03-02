import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "@/shared/ConfirmModal";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { removeItem, incrementItem, decrementItem } = useCart();

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-cream">
      <img
        src={item.image_url || "https://via.placeholder.com/64"}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-gray-600">
          ${Number(item.price).toFixed(2)} c/u
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => decrementItem(item.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-cream hover:bg-gray-200 transition cursor-pointer"
          >
            -
          </button>
          <span className="min-w-[24px] text-center font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => incrementItem(item.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-cream hover:bg-gray-200 transition cursor-pointer"
          >
            +
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="ml-2 p-1 text-chile hover:bg-cream rounded transition cursor-pointer"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="font-semibold text-mostaza shrink-0">
        ${(item.quantity * item.price).toFixed(2)}
      </p>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleRemove}
        title="Eliminar producto"
        message={`¿Eliminar "${item.name}" del carrito?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
