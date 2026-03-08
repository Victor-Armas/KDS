import { useState, useMemo, useEffect } from "react";
import { useAdminOrders } from "./useAdminOrders";
import { MOCK_ORDERS_DATA } from "./mockOrders";

export function useOrdersLogic() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useAdminOrders();
  const orders = data?.orders ?? [];

  // --- LÓGICA DE ORDENAMIENTO ---
  const sortOrdersByUrgency = (orderList) => {
    return [...orderList].sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      const now = Date.now();

      // Calculamos minutos
      const diffA = Math.floor((now - timeA) / 60000);
      const diffB = Math.floor((now - timeB) / 60000);

      const isUrgentA = diffA >= 30;
      const isUrgentB = diffB >= 30;

      // 1. Si una es urgente y la otra no, la urgente va primero
      if (isUrgentA && !isUrgentB) return -1;
      if (!isUrgentA && isUrgentB) return 1;

      // 2. Si ambas son iguales (ambas urgentes o ambas normales),
      // la más antigua (menor timestamp) va primero
      return timeA - timeB;
    });
  };

  useEffect(() => {
    setSelectedOrderId(null);
  }, [searchQuery]);

  const searchedOrders = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return orders;

    return orders.filter((order) =>
      order.id.toLowerCase().includes(query) ||
      order.target.toLowerCase().includes(query) ||
      order.table?.toString().includes(query) ||
      order.order_number?.toString().includes(query) ||
      order.table
        ? `mesa - ${order.table} mesa ${order.table}`
        : "",
    );
  }, [searchQuery, orders]);

  // Aplicamos el ordenamiento a las listas finales
  const pendingOrders = useMemo(
    () =>
      sortOrdersByUrgency(
        searchedOrders.filter((o) => o.status === "pending_confirmation"),
      ),
    [searchedOrders],
  );

  const activeOrders = useMemo(
    () =>
      searchedOrders
        .filter((o) => ["preparing", "ready", "on_the_way"].includes(o.status))
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
        ),
    [searchedOrders],
  );

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId),
    [orders, selectedOrderId],
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedOrderId,
    setSelectedOrderId,
    pendingOrders,
    activeOrders,
    selectedOrder,
    isLoading,
  };
}
