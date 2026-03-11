import { TrendingUp, Users, ShoppingBag } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);

function StatCard({ color, icon: Icon, label, value, sub, loading }) {
  return (
    <div className="rounded-2xl border border-cream dark:border-white/6 bg-softwhite dark:bg-[#1a1816] p-5">
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0`}
        >
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/40 dark:text-white/30">
            {label}
          </p>
          {loading ? (
            <div className="h-7 w-28 rounded-lg bg-cream dark:bg-white/8 animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-serif font-bold text-charcoal dark:text-stone-100">
              {value}
            </p>
          )}
          <p className="text-[11px] text-charcoal/40 dark:text-white/30 mt-0.5">
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StatCards({ data, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        color="bg-chile"
        icon={TrendingUp}
        label="Ventas hoy"
        value={fmt(data?.salesToday ?? 0)}
        sub={`${data?.completedToday ?? 0} órdenes completadas`}
        loading={isLoading}
      />
      <StatCard
        color="bg-mostaza"
        icon={ShoppingBag}
        label="Activas ahora"
        value={data?.activeOrders.length ?? 0}
        sub="En proceso en este momento"
        loading={isLoading}
      />
      <StatCard
        color="bg-hoja"
        icon={Users}
        label="Usuarios"
        value={data?.totalUsers ?? 0}
        sub={`${data?.activeUsers ?? 0} activos`}
        loading={isLoading}
      />
    </div>
  );
}
