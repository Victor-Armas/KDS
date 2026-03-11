import { Clock, ChefHat, CheckCircle2, Truck, XCircle } from "lucide-react";

const STATUS_ITEMS = [
  {
    key: "pending",
    icon: Clock,
    label: "Pendientes",
    color: "dark:text-white text-charcoal", //<--- texto en blanco
    iconBg: "bg-mostaza/40 dark:bg-mostaza/90", //<---- aqui 90
    border: "border-mostaza dark:border-mostaza/90", //<---- aqui 90
    bg: "bg-mostaza/50 dark:bg-mostaza/50",
    dot: "bg-mostaza",
    ping: true,
  },
  {
    key: "preparing",
    icon: ChefHat,
    label: "En cocina",
    color: "dark:text-white",
    iconBg: "bg-chile/50 dark:bg-chile/90",
    border: "border-chile/25 dark:border-chile/90",
    bg: "bg-chile/50 dark:bg-chile/50",
    dot: "bg-chile",
    ping: true,
  },
  {
    key: "ready",
    icon: CheckCircle2,
    label: "Listos",
    color: "dark:text-white",
    iconBg: "bg-hoja/50 dark:bg-hoja/90",
    border: "border-hoja/25 dark:border-hoja/90",
    bg: "bg-hoja/50 dark:bg-hoja/50",
    dot: "bg-hoja",
    ping: false,
  },
  {
    key: "on_the_way",
    icon: Truck,
    label: "En camino",
    color: "dark:text-white",
    iconBg: "bg-blue-500/50 dark:bg-blue-500/90",
    border: "border-blue-500/25 dark:border-blue-500/90",
    bg: "bg-blue-500/50 dark:bg-blue-500/50",
    dot: "bg-blue-500",
    ping: false,
  },
  {
    key: "cancelled",
    icon: XCircle,
    label: "Cancelados hoy",
    color: "text-charcoal dark:text-white/90",
    iconBg: "bg-charcoal/50 dark:bg-white/6",
    border: "border-charcoal/10 dark:border-white/90",
    bg: "bg-charcoal/40 dark:bg-charcoal/70",
    dot: "",
    ping: false,
  },
];

export default function StatusCards({ data, isLoading }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/35 dark:text-white/25 mb-3 px-1">
        Estado de órdenes — tiempo real
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATUS_ITEMS.map(
          ({
            key,
            icon: Icon,
            label,
            color,
            iconBg,
            border,
            dot,
            ping,
            bg,
          }) => {
            const count = data?.statusCounts[key] ?? 0;
            return (
              <div
                key={key}
                className={`rounded-2xl border ${border} ${bg} px-4 py-3.5 flex items-center gap-3`}
              >
                {/* Ícono */}
                <div
                  className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon size={16} className={color} />
                </div>

                {/* Cantidad + Label */}
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <div className="h-6 w-10 rounded-md bg-cream dark:bg-white/8 animate-pulse mb-1" />
                  ) : (
                    <p
                      className={`text-2xl font-serif font-black leading-none ${color}`}
                    >
                      {count}
                    </p>
                  )}
                  <p className="text-[10px] font-bold text-charcoal dark:text-white uppercase tracking-wide mt-0.5 truncate">
                    {label}
                  </p>
                </div>

                {/* Ping vivo */}
                {ping && !isLoading && count > 0 && (
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 font-extrabold animate-ping ${dot}`}
                  />
                )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
