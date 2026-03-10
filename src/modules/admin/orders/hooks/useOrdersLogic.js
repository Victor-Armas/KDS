import { useState, useMemo, useEffect } from "react";
import { useAdminOrders } from "./useAdminOrders";

export function useOrdersLogic() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useAdminOrders();
  const orders = data?.orders ?? [];

  const sortOrdersByUrgency = (orderList) => {
    return [...orderList].sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      const now = Date.now();
      const diffA = Math.floor((now - timeA) / 60000);
      const diffB = Math.floor((now - timeB) / 60000);
      const isUrgentA = diffA >= 30;
      const isUrgentB = diffB >= 30;
      if (isUrgentA && !isUrgentB) return -1;
      if (!isUrgentA && isUrgentB) return 1;
      return timeA - timeB;
    });
  };

  const sortByTime = (list) =>
    [...list].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

  useEffect(() => {
    setSelectedOrderId(null);
  }, [searchQuery]);

  const searchedOrders = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return orders;
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.target.toLowerCase().includes(query) ||
        order.table?.toString().includes(query) ||
        order.order_number?.toString().includes(query),
    );
  }, [searchQuery, orders]);

  // Columna izquierda: pickup/delivery pendientes de confirmar pago
  const pendingOrders = useMemo(
    () =>
      sortOrdersByUrgency(
        searchedOrders.filter(
          (o) =>
            o.status === "pending_confirmation" &&
            ["pickup", "delivery"].includes(o.type),
        ),
      ),
    [searchedOrders],
  );

  // Pickup/delivery esperando transferencia
  const awaitingTransferOrders = useMemo(
    () =>
      searchedOrders.filter(
        (o) =>
          o.status === "confirmed" &&
          o.payment_method === "transfer" &&
          ["pickup", "delivery"].includes(o.type),
      ),
    [searchedOrders],
  );

  // Listos para entregar — admin/waiter actúan aquí
  const readyOrders = useMemo(
    () => sortByTime(searchedOrders.filter((o) => o.status === "ready")),
    [searchedOrders],
  );

  // Delivery en camino
  const onTheWayOrders = useMemo(
    () => sortByTime(searchedOrders.filter((o) => o.status === "on_the_way")),
    [searchedOrders],
  );

  // En cocina: solo informativo
  const preparingOrders = useMemo(
    () => sortByTime(searchedOrders.filter((o) => o.status === "preparing")),
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
    awaitingTransferOrders,
    readyOrders,
    onTheWayOrders,
    preparingOrders,
    selectedOrder,
    isLoading,
  };
}
