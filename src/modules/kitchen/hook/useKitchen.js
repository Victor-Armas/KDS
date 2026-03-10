import { supabase } from "@/services/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useKitchen = () => {
  const query = useQuery({
    queryKey: ["kitchens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_type, status, order_number, notes, guest_name, table_number, created_at, preparing_at, order_items(id, product_name, quantity)",
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

export const useMarkAsReady = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: "ready" })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchens"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
};

// Alias para compatibilidad con imports anteriores
export const getOrders = useKitchen;
