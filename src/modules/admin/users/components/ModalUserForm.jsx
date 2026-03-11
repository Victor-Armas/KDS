import { useState, useEffect } from "react";
import { X, UserPlus, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";

const ROLES = [
  { id: "admin", label: "Administrador", desc: "Acceso total al sistema" },
  { id: "waiter", label: "Mesero", desc: "Órdenes y punto de venta" },
  { id: "kitchen", label: "Cocina", desc: "Vista de cocina" },
  { id: "client", label: "Cliente", desc: "Pedidos en línea" },
];

const inputClass = `
  w-full px-4 py-2.5 text-sm rounded-xl
  bg-cream/40 dark:bg-white/5
  border border-cream dark:border-white/8
  text-charcoal dark:text-stone-100
  placeholder:text-charcoal/30 dark:placeholder:text-white/20
  focus:outline-none focus:ring-2 focus:ring-chile/30 focus:border-chile/40
  transition-all
`;

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-white/40 mb-1.5";

export default function ModalUserForm({ isOpen, onClose, initialData }) {
  const isEditing = !!initialData;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "waiter",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || "",
        email: initialData.email || "",
        password: "",
        role: initialData.role || "waiter",
      });
    } else {
      setForm({ full_name: "", email: "", password: "", role: "waiter" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isPending = createUser.isPending || updateUser.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      updateUser.mutate(
        { id: initialData.id, full_name: form.full_name, role: form.role },
        { onSuccess: onClose },
      );
    } else {
      createUser.mutate(form, { onSuccess: onClose });
    }
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={handleOverlay}
    >
      <div
        className="w-full max-w-md bg-softwhite dark:bg-[#1a1816] rounded-2xl shadow-2xl dark:shadow-black/60 border border-cream dark:border-white/8 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream dark:border-white/8 flex items-center justify-between bg-chile/5 dark:bg-chile/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-chile/10 dark:bg-chile/15 flex items-center justify-center">
              <UserPlus size={16} className="text-chile" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-charcoal dark:text-stone-100">
                {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
              </h3>
              <p className="text-[11px] text-charcoal/40 dark:text-white/30">
                {isEditing
                  ? `Editando a ${initialData.full_name}`
                  : "Crea una cuenta para staff o cliente"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal/30 dark:text-white/30 hover:bg-cream dark:hover:bg-white/8 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, full_name: e.target.value }))
              }
              placeholder="Ej. Juan Pérez"
              required
              className={inputClass}
            />
          </div>

          {/* Email — solo en creación */}
          {!isEditing && (
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    email: e.target.value.toLowerCase(),
                  }))
                }
                placeholder="correo@ejemplo.com"
                required
                className={inputClass}
              />
            </div>
          )}

          {/* Password — solo en creación */}
          {!isEditing && (
            <div>
              <label className={labelClass}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className={inputClass + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25 hover:text-charcoal dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Rol */}
          <div>
            <label className={labelClass}>Rol del usuario</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: r.id }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.role === r.id
                      ? "border-chile bg-chile/8 dark:bg-chile/12"
                      : "border-cream dark:border-white/8 hover:border-chile/30 dark:hover:border-chile/20 bg-cream/20 dark:bg-white/3"
                  }`}
                >
                  <p
                    className={`text-xs font-bold ${form.role === r.id ? "text-chile" : "text-charcoal dark:text-stone-200"}`}
                  >
                    {r.label}
                  </p>
                  <p className="text-[10px] text-charcoal/40 dark:text-white/30 mt-0.5">
                    {r.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-cream dark:border-white/8 text-charcoal/60 dark:text-white/40 hover:bg-cream dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-chile hover:bg-chile/90 shadow-lg shadow-chile/20 active:scale-95 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {isPending
                ? "Guardando..."
                : isEditing
                  ? "Actualizar"
                  : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
