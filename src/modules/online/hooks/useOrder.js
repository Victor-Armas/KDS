import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import {
  createOrderWithItems,
  fetchOrderById,
} from "../services/online.service";

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────
// Used in CartDrawer → OrderFormModal → onSubmit
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderData, items }) =>
      createOrderWithItems({ orderData, items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["online-order-history"] });
    },
  });
};

// ─── FETCH ORDER BY ID ────────────────────────────────────────────────────────
// Used in OrderStatusPage — live updates via realtime
export const useOrderById = (orderId) => {
  const query = useQuery({
    queryKey: ["online-order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: 0, // always fresh for status tracking
  });

  // Listen for status changes in real time
  useRealtimeSync("orders", [["online-order", orderId]]);

  return query;
};
