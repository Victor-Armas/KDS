const STATUS_CONFIG = {
  pending_confirmation: {
    label: "Por confirmar",
    color: "bg-mostaza/10 text-mostaza border-mostaza/20",
    dot: "bg-mostaza animate-pulse",
  },
  confirmed: {
    label: "Confirmado",
    color:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  preparing: {
    label: "En preparación",
    color: "bg-chile/10 text-chile border-chile/20",
    dot: "bg-chile animate-pulse",
  },
  ready: {
    label: "¡Listo para recoger!",
    color: "bg-hoja/10 text-hoja border-hoja/20",
    dot: "bg-hoja",
  },
  on_the_way: {
    label: "En camino",
    color:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-500 animate-pulse",
  },
  completed: {
    label: "Entregado",
    color:
      "bg-gray-100 text-gray-500 border-gray-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700",
    dot: "bg-gray-400",
  },
  cancelled: {
    label: "Cancelado",
    color:
      "bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    dot: "bg-red-500",
  },
};

export default function OrderStatusBadge({ status, size = "md" }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    color: "bg-gray-100 text-gray-500 border-gray-200",
    dot: "bg-gray-400",
  };

  const sizeClass =
    size === "lg" ? "px-4 py-2 text-sm gap-2" : "px-3 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold ${config.color} ${sizeClass}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
