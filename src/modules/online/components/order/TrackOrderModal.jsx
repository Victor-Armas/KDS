import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchOrderByNumber } from "../../services/online.service";

export default function TrackOrderModal({ isOpen, onClose }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const order = await fetchOrderByNumber(input.trim());

      // Pedido completado o cancelado — no se puede rastrear
      if (order.status === "completed" || order.status === "cancelled") {
        setError(
          order.status === "completed"
            ? "Este pedido ya fue entregado. ¡Gracias por tu preferencia!"
            : "Este pedido fue cancelado.",
        );
        return;
      }

      // Pedido activo — redirigimos al status page
      onClose();
      setInput("");
      navigate(`/online/order/${order.id}`);
    } catch {
      setError(
        "No encontramos ese número de orden. Verifica que sea correcto (ej. ORD-000061).",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setInput("");
      setError(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlay}
    >
      <div className="w-full max-w-sm bg-softwhite dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-cream dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal dark:text-stone-100">
              Rastrear pedido
            </h3>
            <p className="text-xs text-charcoal/50 dark:text-stone-500 mt-0.5">
              Ingresa tu número de orden
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setInput("");
              setError(null);
            }}
            className="p-2 rounded-xl hover:bg-cream dark:hover:bg-stone-800 text-charcoal/40 dark:text-stone-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="px-6 py-6 space-y-4">
          {/* Input */}
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="ORD-000061"
              maxLength={12}
              className="w-full px-4 py-4 pr-12 rounded-2xl border-2 border-cream dark:border-stone-700 bg-cream/30 dark:bg-stone-800 text-charcoal dark:text-stone-100 font-mono font-bold text-lg text-center tracking-widest focus:outline-none focus:border-chile/50 dark:focus:border-chile/50 placeholder:text-charcoal/20 dark:placeholder:text-stone-600 placeholder:font-sans placeholder:tracking-normal placeholder:text-base uppercase transition-colors"
              autoFocus
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-chile/5 dark:bg-chile/10 border border-chile/20 rounded-2xl px-4 py-3">
              <AlertCircle size={16} className="text-chile shrink-0 mt-0.5" />
              <p className="text-xs text-chile leading-relaxed">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-chile text-white rounded-2xl font-bold text-sm hover:bg-chile/90 active:scale-95 transition-all shadow-lg shadow-chile/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {loading ? "Buscando..." : "Ver mi pedido"}
          </button>

          <p className="text-[11px] text-center text-charcoal/30 dark:text-stone-600">
            Encuentra tu número en el mensaje de confirmación
          </p>
        </form>
      </div>
    </div>
  );
}
