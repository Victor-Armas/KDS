import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock } from "lucide-react";

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

function Card({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-cream dark:border-white/6 bg-softwhite dark:bg-[#1a1816] p-5 ${className}`}
    >
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

export default function OrdersCharts({ data, isLoading }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Órdenes por hora */}
      <div className="lg:col-span-2">
        <Card title="Órdenes por hora — hoy">
          {isLoading ? (
            <Skeleton />
          ) : data?.ordersByHour.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-charcoal/25 dark:text-white/20 gap-2">
              <Clock size={28} />
              <p className="text-xs font-medium">Sin órdenes hoy</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart
                data={data?.ordersByHour}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.05}
                />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis {...axisProps} allowDecimals={false} width={28} />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="ordenes"
                  name="Órdenes"
                  fill="#BC6C25"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Donut por tipo */}
      <Card title="Por tipo de orden — 7 días">
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={data?.ordersByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data?.ordersByType.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-softwhite dark:bg-[#1e1c1a] border border-cream dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
                        <p
                          style={{ color: payload[0].payload.color }}
                          className="font-bold"
                        >
                          {payload[0].name}: {payload[0].value}
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Leyenda */}
            <div className="flex flex-col gap-2 w-full">
              {data?.ordersByType.map((t) => {
                const total = data.ordersByType.reduce(
                  (s, x) => s + x.value,
                  0,
                );
                const pct = total > 0 ? Math.round((t.value / total) * 100) : 0;
                return (
                  <div
                    key={t.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: t.color }}
                      />
                      <span className="text-charcoal/60 dark:text-white/50 font-medium">
                        {t.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal dark:text-stone-200">
                        {t.value}
                      </span>
                      <span className="text-charcoal/30 dark:text-white/25">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
