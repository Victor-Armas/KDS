import { useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import OrderFormModal from "../../orders/components/OrderFormModal";
import ConfirmModal from "@/shared/ConfirmModal";
import { useCreateOrder } from "../../orders/hook/useCreateOrder";

export default function CartDrawer({ cartOpen, closeCart }) {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { items, clearCart } = useCart();
  const { createOrder, isPending } = useCreateOrder();

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  const total = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300  ${
          cartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-150 bg-softwhite shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-cream flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-chile">
            Tu carrito
          </h2>

          <button
            onClick={closeCart}
            className="text-charcoal hover:text-chile transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Lista de items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío</p>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        <div className="flex justify-between text-lg font-semibold text-charcoal px-5">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="mt-auto border-t border-cream px-6 py-5 space-y-3">
          {items.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="w-full cursor-pointer py-2 text-chile hover:bg-cream rounded-xl transition text-sm"
            >
              Vaciar carrito
            </button>
          )}
          <button
            onClick={() => items.length > 0 && setShowOrderForm(true)}
            className="w-full cursor-pointer bg-chile text-white py-3 rounded-2xl hover:bg-hoja transition disabled:opacity-50"
            disabled={items.length === 0 || isPending}
          >
            {isPending ? "Enviando pedido..." : "Finalizar pedido"}
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearCart}
        title="Vaciar carrito"
        message="¿Estás seguro de que quieres vaciar el carrito? Se eliminarán todos los productos."
        confirmText="Vaciar carrito"
        cancelText="Cancelar"
        variant="danger"
      />

      <OrderFormModal
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        isSubmitting={isPending}
        onSubmit={async (formValues) => {
          try {
            await createOrder({ form: formValues, items });
            setShowOrderForm(false);
            closeCart();
          } catch (error) {
            console.error("Error al crear la orden:", error);
          }
        }}
      />
    </>
  );
}
