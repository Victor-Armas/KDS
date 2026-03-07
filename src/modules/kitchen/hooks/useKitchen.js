import { supabase } from "@/lib/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useQuery } from "@tanstack/react-query";

export const getOrders = () => {
  const query = useQuery({
    queryKey: ["kitchens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id,order_type,status,order_number,notes,guest_name,table_number,created_at, order_items(id, product_name, quantity)",
        )
        .in("status", ["preparing"])
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });

  useRealtimeSync("orders", ["kitchens"]);

  return query;
};
