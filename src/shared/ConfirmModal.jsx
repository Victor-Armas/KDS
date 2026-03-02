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

  const variantStyles = {
    primary: "bg-chile text-white hover:bg-hoja",
    danger: "bg-chile text-white hover:bg-chile/90",
  };

  const buttonClass = variantStyles[variant] || variantStyles.primary;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md bg-softwhite rounded-2xl shadow-2xl p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-serif font-bold text-chile mb-2">
          {title}
        </h3>
        <p className="text-charcoal text-sm mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cream text-charcoal hover:bg-gray-200 transition cursor-pointer font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl transition cursor-pointer font-medium ${buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
