import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";

// ── Helpers ────────────────────────────────────────────────────────────────────
const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const startOf7Days = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const dayLabel = (iso) =>
  new Date(iso).toLocaleDateString("es-MX", { weekday: "short" });

const hourLabel = (h) => `${String(h).padStart(2, "0")}:00`;

// ── Query ──────────────────────────────────────────────────────────────────────
async function fetchDashboard() {
  const today = startOfDay();
  const week = startOf7Days();

  // 1. Órdenes de hoy
  const { data: todayOrders, error: e1 } = await supabase
    .from("orders")
    .select(
      "id, status, total, created_at, order_type, order_number, guest_name, table_number",
    )
    .gte("created_at", today);
  if (e1) throw e1;

  // 2. Órdenes de los últimos 7 días (para gráficas y top productos)
  const { data: weekOrders, error: e2 } = await supabase
    .from("orders")
    .select("id, status, total, created_at, order_type")
    .gte("created_at", week);
  if (e2) throw e2;

  // 3. Top productos (últimos 7 días)
  const { data: topRaw, error: e3 } = await supabase
    .from("order_items")
    .select("product_name, quantity, order_id")
    .in(
      "order_id",
      weekOrders.map((o) => o.id),
    );
  if (e3) throw e3;

  // 4. Usuarios
  const { data: profiles, error: e4 } = await supabase
    .from("profiles")
    .select("id, is_active");
  if (e4) throw e4;

  // ── Procesar ────────────────────────────────────────────────────────────────

  // Ventas y órdenes de hoy
  const completedToday = todayOrders.filter((o) => o.status === "completed");
  const salesToday = completedToday.reduce((s, o) => s + Number(o.total), 0);

  // Órdenes activas (estado no terminal)
  const activeOrders = todayOrders.filter((o) =>
    [
      "pending_confirmation",
      "confirmed",
      "preparing",
      "ready",
      "on_the_way",
    ].includes(o.status),
  );

  // Status counts (hoy)
  const statusCounts = {
    pending: todayOrders.filter((o) =>
      ["pending_confirmation", "confirmed"].includes(o.status),
    ).length,
    preparing: todayOrders.filter((o) => o.status === "preparing").length,
    ready: todayOrders.filter((o) => o.status === "ready").length,
    on_the_way: todayOrders.filter((o) => o.status === "on_the_way").length,
    cancelled: todayOrders.filter((o) => o.status === "cancelled").length,
  };

  // Ventas por hora (hoy, 8am → hora actual)
  const nowH = new Date().getHours();
  const salesByHour = Array.from({ length: Math.max(nowH - 7, 1) }, (_, i) => {
    const h = i + 8;
    const ventas = completedToday
      .filter((o) => new Date(o.created_at).getHours() === h)
      .reduce((s, o) => s + Number(o.total), 0);
    return { label: hourLabel(h), ventas };
  });

  // Órdenes por hora (hoy)
  const ordersByHour = salesByHour.map((item) => {
    const h = parseInt(item.label);
    return {
      label: item.label,
      ordenes: todayOrders.filter(
        (o) => new Date(o.created_at).getHours() === h,
      ).length,
    };
  });

  // Ventas por día (últimos 7 días)
  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const ventas = weekOrders
      .filter(
        (o) =>
          o.status === "completed" &&
          new Date(o.created_at) >= d &&
          new Date(o.created_at) < next,
      )
      .reduce((s, o) => s + Number(o.total), 0);
    return { label: dayLabel(d.toISOString()), ventas };
  });

  // Órdenes por tipo (últimos 7 días)
  const typeMap = { dine_in: "Local", pickup: "Llevar", delivery: "Domicilio" };
  const typeColors = {
    dine_in: "#386641",
    pickup: "#BC6C25",
    delivery: "#3b82f6",
  };
  const typeTotals = weekOrders.reduce((acc, o) => {
    const k = o.order_type;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const ordersByType = Object.entries(typeTotals).map(([k, v]) => ({
    name: typeMap[k] || k,
    value: v,
    color: typeColors[k] || "#9E2A2B",
  }));

  // Top productos
  const productMap = topRaw.reduce((acc, item) => {
    const n = item.product_name;
    acc[n] = (acc[n] || 0) + item.quantity;
    return acc;
  }, {});
  const topProductsList = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, quantity]) => ({ name, quantity }));

  // Usuarios
  const totalUsers = profiles.length;
  const activeUsers = profiles.filter((p) => p.is_active).length;

  return {
    salesToday,
    completedToday: completedToday.length,
    activeOrders,
    statusCounts,
    salesByHour,
    salesByDay,
    ordersByHour,
    ordersByType,
    topProductsList,
    totalUsers,
    activeUsers,
  };
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useDashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 2, // 2 min
    refetchOnWindowFocus: true,
  });

  // Realtime: se refrescan cuando cambia orders O order_items
  useRealtimeSync("orders", [["dashboard"]]);
  useRealtimeSync("order_items", [["dashboard"]]);

  return query;
}
