import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

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

function ChartTooltip({ active, payload, label, money = false }) {
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
          {p.name}: {money ? fmt(p.value) : p.value}
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

export default function SalesCharts({ data, isLoading }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Ventas por hora */}
      <Card title="Ventas por hora — hoy">
        {isLoading ? (
          <Skeleton />
        ) : data?.salesByHour.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center text-charcoal/25 dark:text-white/20 gap-2">
            <TrendingUp size={28} />
            <p className="text-xs font-medium">Sin ventas registradas hoy</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={data?.salesByHour}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="grad-hour" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9E2A2B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9E2A2B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.05}
              />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis
                {...axisProps}
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
                width={42}
              />
              <Tooltip content={<ChartTooltip money />} />
              <Area
                type="monotone"
                dataKey="ventas"
                name="Ventas"
                stroke="#9E2A2B"
                strokeWidth={2}
                fill="url(#grad-hour)"
                dot={{ fill: "#9E2A2B", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Ventas por día */}
      <Card title="Ventas por día — últimos 7 días">
        {isLoading ? (
          <Skeleton />
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={data?.salesByDay}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.05}
              />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis
                {...axisProps}
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
                width={42}
              />
              <Tooltip content={<ChartTooltip money />} />
              <Bar
                dataKey="ventas"
                name="Ventas"
                fill="#9E2A2B"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
