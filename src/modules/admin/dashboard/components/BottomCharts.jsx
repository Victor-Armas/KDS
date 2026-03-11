import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useOrderTimer } from "@/utils/useOrderTimer";

const fmt = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);

const axisProps = {
  tick: { fontSize: 10, fill: "currentColor", opacity: 0.4 },
  axisLine: false,
  tickLine: false,
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-softwhite dark:bg-[#1e1c1a] border border-cream dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="font-bold text-charcoal dark:text-stone-200 mb-1">
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          style={{ color: p.color || p.fill }}
          className="font-semibold"
        >
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-cream dark:border-white/6 bg-softwhite dark:bg-[#1a1816] p-5">
      {title && (
        <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/35 dark:text-white/25 mb-4">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

const Skeleton = () => (
  <div className="h-52 rounded-xl bg-cream dark:bg-white/5 animate-pulse" />
);

// ── Fila de orden activa ──────────────────────────────────────────────────────
function ActiveOrderRow({ order }) {
  const { minutes, styles } = useOrderTimer(order.created_at);
  const typeIcons = { dine_in: Utensils, pickup: ShoppingBag, delivery: Truck };
  const Icon = typeIcons[order.order_type] || ShoppingBag;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-cream dark:border-white/5 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-cream dark:bg-white/5 flex items-center justify-center shrink-0">
          <Icon size={13} className="text-charcoal/50 dark:text-white/40" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-charcoal dark:text-stone-200 truncate">
            {order.guest_name}
          </p>
          <p className="text-[10px] text-charcoal/40 dark:text-white/30">
            #{order.order_number}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${styles}`}
        >
          {minutes}m
        </span>
        <span className="text-xs font-bold text-charcoal/50 dark:text-white/35">
          {fmt(order.total)}
        </span>
      </div>
    </div>
  );
}

export default function BottomCharts({ data, isLoading }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top productos */}
      <Card title="Productos más vendidos — 7 días">
        {isLoading ? (
          <Skeleton />
        ) : data?.topProductsList.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-charcoal/25 dark:text-white/20 gap-2">
            <Package size={28} />
            <p className="text-xs font-medium">Sin datos esta semana</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data?.topProductsList}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="currentColor"
                strokeOpacity={0.05}
              />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="quantity"
                name="Vendidos"
                fill="#386641"
                radius={[0, 6, 6, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Órdenes activas */}
      <Card title="Órdenes activas ahora">
        {isLoading ? (
          <Skeleton />
        ) : data?.activeOrders.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-charcoal/25 dark:text-white/20 gap-2">
            <CheckCircle2 size={28} />
            <p className="text-xs font-medium">No hay órdenes activas</p>
          </div>
        ) : (
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {data.activeOrders.map((order) => (
              <ActiveOrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
