import { useState, useEffect } from "react";
import { X, ShoppingBag, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ORDER_TYPES = [
  { id: "pickup", label: "Para recoger", icon: ShoppingBag },
  { id: "delivery", label: "Delivery", icon: Truck },
];

const validate = (form) => {
  if (!form.guest_name.trim()) return "El nombre es obligatorio";
  if (!form.guest_phone.trim()) return "El teléfono es obligatorio";
  if (form.order_type === "delivery" && !form.address.trim())
    return "La dirección es obligatoria para delivery";
  return null;
};

export default function OrderFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const { user, profile } = useAuth();

  const [form, setForm] = useState({
    order_type: "pickup",
    guest_name: "",
    guest_phone: "",
    address: "",
    notes: "",
  });

  const [error, setError] = useState(null);

  // Pre-fill if user is logged in
  useEffect(() => {
    if (user && profile) {
      setForm((f) => ({
        ...f,
        guest_name: profile.full_name || "",
      }));
    }
  }, [user, profile]);

  if (!isOpen) return null;

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onSubmit({
      ...form,
      user_id: user?.id || null,
      guest_email: user?.email || null,
    });
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlay}
    >
      <div className="w-full max-w-md bg-softwhite dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-cream dark:border-stone-800 flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-charcoal dark:text-stone-100">
            Detalles del pedido
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-cream dark:hover:bg-stone-800 text-charcoal/40 dark:text-stone-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Order type */}
          <div className="flex gap-2">
            {ORDER_TYPES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, order_type: id, address: "" }))
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                  form.order_type === id
                    ? "border-chile bg-chile/10 text-chile dark:bg-chile/20"
                    : "border-cream dark:border-stone-700 text-charcoal/50 dark:text-stone-500 hover:border-mostaza/40"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-chile bg-chile/10 px-3 py-2 rounded-xl font-medium">
              {error}
            </p>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal/60 dark:text-stone-400 uppercase tracking-wider">
              Nombre
            </label>
            <input
              type="text"
              value={form.guest_name}
              onChange={set("guest_name")}
              placeholder="¿Cómo te llamamos?"
              className="w-full px-4 py-3 rounded-2xl border border-cream dark:border-stone-700 bg-cream/30 dark:bg-stone-800 text-charcoal dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-chile/30 placeholder:text-charcoal/30 dark:placeholder:text-stone-600"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal/60 dark:text-stone-400 uppercase tracking-wider">
              Teléfono
            </label>
            <input
              type="tel"
              value={form.guest_phone}
              onChange={set("guest_phone")}
              placeholder="Para avisarte cuando esté listo"
              className="w-full px-4 py-3 rounded-2xl border border-cream dark:border-stone-700 bg-cream/30 dark:bg-stone-800 text-charcoal dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-chile/30 placeholder:text-charcoal/30 dark:placeholder:text-stone-600"
            />
          </div>

          {/* Address — delivery only */}
          {form.order_type === "delivery" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/60 dark:text-stone-400 uppercase tracking-wider">
                Dirección de entrega
              </label>
              <textarea
                value={form.address}
                onChange={set("address")}
                placeholder="Calle, número, colonia..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-cream dark:border-stone-700 bg-cream/30 dark:bg-stone-800 text-charcoal dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-chile/30 placeholder:text-charcoal/30 dark:placeholder:text-stone-600 resize-none"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal/60 dark:text-stone-400 uppercase tracking-wider">
              Notas{" "}
              <span className="text-charcoal/30 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Sin cebolla, extra salsa..."
              rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-cream dark:border-stone-700 bg-cream/30 dark:bg-stone-800 text-charcoal dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-chile/30 placeholder:text-charcoal/30 dark:placeholder:text-stone-600 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-cream dark:border-stone-700 text-charcoal/60 dark:text-stone-400 text-sm font-medium hover:bg-cream dark:hover:bg-stone-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-6 rounded-2xl bg-chile text-white text-sm font-bold hover:bg-chile/90 active:scale-95 transition-all shadow-lg shadow-chile/20 disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Confirmar pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
