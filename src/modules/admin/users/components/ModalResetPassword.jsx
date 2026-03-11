import { useState } from "react";
import { X, KeyRound, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ModalResetPassword({ isOpen, onClose, user }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const resetPassword = useResetPassword();

  if (!isOpen || !user) return null;

  const mismatch = confirm.length > 0 && password !== confirm;
  const isValid = password.length >= 6 && password === confirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    resetPassword.mutate(
      { userId: user.id, newPassword: password },
      {
        onSuccess: () => {
          setPassword("");
          setConfirm("");
          onClose();
        },
      },
    );
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const inputClass = `
    w-full px-4 py-2.5 text-sm rounded-xl pr-10
    bg-cream/40 dark:bg-white/5
    border border-cream dark:border-white/8
    text-charcoal dark:text-stone-100
    placeholder:text-charcoal/30 dark:placeholder:text-white/20
    focus:outline-none focus:ring-2 focus:ring-chile/30 focus:border-chile/40
    transition-all
  `;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={handleOverlay}
    >
      <div
        className="w-full max-w-sm bg-softwhite dark:bg-[#1a1816] rounded-2xl shadow-2xl dark:shadow-black/60 border border-cream dark:border-white/8 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream dark:border-white/8 flex items-center justify-between bg-mostaza/5 dark:bg-mostaza/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-mostaza/12 dark:bg-mostaza/15 flex items-center justify-center">
              <KeyRound size={16} className="text-mostaza" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-charcoal dark:text-stone-100">
                Resetear Contraseña
              </h3>
              <p className="text-[11px] text-charcoal/40 dark:text-white/30">
                {user.full_name}
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
          {/* Nueva contraseña */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-white/40 mb-1.5">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25 hover:text-charcoal dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-white/40 mb-1.5">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                required
                className={`${inputClass} ${mismatch ? "border-chile/50 focus:ring-chile/40" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25 hover:text-charcoal dark:hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {mismatch && (
              <p className="text-[11px] text-chile mt-1.5 font-medium">
                Las contraseñas no coinciden
              </p>
            )}
          </div>

          {/* Indicador de éxito */}
          {isValid && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-hoja/8 dark:bg-hoja/12 border border-hoja/20">
              <ShieldCheck size={14} className="text-hoja shrink-0" />
              <p className="text-[11px] text-hoja font-semibold">
                Contraseña lista para guardar
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-cream dark:border-white/8 text-charcoal/60 dark:text-white/40 hover:bg-cream dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || resetPassword.isPending}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-mostaza hover:bg-mostaza/90 shadow-lg shadow-mostaza/20 active:scale-95 transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
            >
              {resetPassword.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <KeyRound size={14} /> Cambiar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
