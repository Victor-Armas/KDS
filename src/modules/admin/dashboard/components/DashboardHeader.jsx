import { RefreshCw } from "lucide-react";

export default function DashboardHeader({ isFetching, onRefetch }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-serif font-bold text-charcoal dark:text-stone-100">
          Dashboard
        </h1>
        <p className="text-sm text-charcoal/50 dark:text-white/40 mt-0.5">
          Métricas en tiempo real · últimos 7 días
        </p>
      </div>
      <button
        onClick={onRefetch}
        disabled={isFetching}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cream dark:border-white/8 text-xs font-bold text-charcoal/50 dark:text-white/35 hover:bg-cream dark:hover:bg-white/5 transition-all cursor-pointer disabled:opacity-40"
      >
        <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
        Actualizar
      </button>
    </div>
  );
}
