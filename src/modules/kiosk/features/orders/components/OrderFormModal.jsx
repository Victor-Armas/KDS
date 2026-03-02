// src/features/orders/components/OrderFormModal.jsx
import { useState } from "react";
import { ORDER_TYPES } from "..";

export default function OrderFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [form, setForm] = useState({
    order_type: "dine_in",
    guest_name: "",
    guest_phone: "",
    address: "",
    table_number: "",
    notes: "",
  });

  if (!isOpen) return null;

  const { order_type, guest_name, guest_phone, address, table_number, notes } =
    form;

  // Maneja cambios de cualquier input
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Cierra modal al hacer click fuera del contenido
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guest_name.trim()) {
      alert("El nombre del cliente es obligatorio");
      return;
    }

    if (order_type === "dine_in" && !table_number.trim()) {
      alert("Debes ingresar el número de mesa");
      return;
    }

    if (order_type === "delivery" && !address.trim()) {
      alert("Debes ingresar la dirección");
      return;
    }

    onSubmit?.({
      order_type,
      guest_name,
      guest_phone,
      address: order_type === "delivery" ? address : null,
      table_number: order_type === "dine_in" ? table_number : null,
      notes,
    });

    // Resetea el formulario
    setForm({
      order_type: "dine_in",
      guest_name: "",
      guest_phone: "",
      address: "",
      table_number: "",
      notes: "",
    });
  };

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-lg bg-softwhite rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-serif font-bold text-chile">
            Detalles del pedido
          </h3>
          <button
            onClick={onClose}
            className="text-charcoal hover:text-chile transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de orden */}
          <section>
            <p className="text-sm font-medium text-charcoal mb-2">
              Tipo de orden
            </p>
            <div className="flex gap-2 flex-wrap">
              {ORDER_TYPES.map((type) => {
                const active = order_type === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, order_type: type.id }))
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${
                      active
                        ? "bg-chile text-white border-chile"
                        : "bg-cream text-charcoal border-cream hover:bg-mostaza hover:text-white"
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Datos principales */}
          <section className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Nombre del cliente
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-cream px-3 py-2 text-sm bg-softwhite focus:outline-none focus:ring-2 focus:ring-mostaza"
                value={guest_name}
                onChange={handleChange("guest_name")}
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                className="w-full rounded-xl border border-cream px-3 py-2 text-sm bg-softwhite focus:outline-none focus:ring-2 focus:ring-mostaza"
                value={guest_phone}
                onChange={handleChange("guest_phone")}
                placeholder="Opcional"
              />
            </div>
          </section>

          {/* Campos condicionales */}
          {order_type === "dine_in" && (
            <section>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Número de mesa
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-cream px-3 py-2 text-sm bg-softwhite focus:outline-none focus:ring-2 focus:ring-mostaza"
                value={table_number}
                onChange={handleChange("table_number")}
                placeholder="Ej. Mesa 5"
              />
            </section>
          )}

          {order_type === "delivery" && (
            <section>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Dirección
              </label>
              <textarea
                className="w-full rounded-xl border border-cream px-3 py-2 text-sm bg-softwhite focus:outline-none focus:ring-2 focus:ring-mostaza min-h-[70px]"
                value={address}
                onChange={handleChange("address")}
                placeholder="Calle, número, colonia..."
              />
            </section>
          )}

          {/* Notas */}
          <section>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Notas
            </label>
            <textarea
              className="w-full rounded-xl border border-cream px-3 py-2 text-sm bg-softwhite focus:outline-none focus:ring-2 focus:ring-mostaza min-h-[60px]"
              value={notes}
              onChange={handleChange("notes")}
              placeholder="Sin cebolla, poco picante..."
            />
          </section>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cream text-charcoal hover:bg-gray-200 transition cursor-pointer text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-chile text-white hover:bg-hoja transition cursor-pointer text-sm font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Confirmando..." : "Confirmar pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
