import { AlertTriangle, Info, Trash2 } from "lucide-react";

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-chile/10 dark:bg-chile/15",
    iconColor: "text-chile",
    titleColor: "text-chile",
    confirmBtn: "bg-chile hover:bg-chile/90 shadow-chile/20",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-mostaza/10 dark:bg-mostaza/15",
    iconColor: "text-mostaza",
    titleColor: "text-mostaza",
    confirmBtn: "bg-mostaza hover:bg-mostaza/90 shadow-mostaza/20",
  },
  primary: {
    icon: Info,
    iconBg: "bg-hoja/10 dark:bg-hoja/15",
    iconColor: "text-hoja",
    titleColor: "text-hoja",
    confirmBtn: "bg-hoja hover:bg-hoja/90 shadow-hoja/20",
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
}) {
  if (!isOpen) return null;

  const config = variantConfig[variant] || variantConfig.primary;
  const Icon = config.icon;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center px-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-sm bg-softwhite dark:bg-[#1e1c1a] rounded-2xl shadow-2xl dark:shadow-black/60 border border-cream dark:border-white/8 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Body */}
        <div className="p-6">
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${config.iconBg}`}
          >
            <Icon size={20} className={config.iconColor} />
          </div>

          {/* Title */}
          <h3
            className={`text-base font-serif font-bold mb-1.5 ${config.titleColor}`}
          >
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-charcoal/60 dark:text-white/45 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
              bg-cream dark:bg-white/6
              text-charcoal/60 dark:text-white/40
              hover:bg-cream/80 dark:hover:bg-white/10
              border border-cream dark:border-white/8
              transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer ${config.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
