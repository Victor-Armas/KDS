import { supabase } from "@/lib/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useQuery } from "@tanstack/react-query";

export const useAdminOrders = () => {
  const query = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("orders")
        .select(
          "id, target:guest_name, total, table:table_number, status, order_number, type:order_type, time:created_at, waiter:waiter_name, order_items(id,quantity, unit_price, product_name)",
        )
        .order("created_at", { ascending: true });

      const { data, error } = await queryBuilder;
      if (error) throw error;

      return {
        orders: data ?? [],
      };
    },
  });

  useRealtimeSync("orders", [["admin-orders"], ["kitchens"]]);

  return query;
};
