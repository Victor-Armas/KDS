import { supabase } from "@/lib/supabase";
import { notify } from "@/utils/components/TacoToast";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAdminOrders = () => {
  const query = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("orders")
        .select(
          "id, address, target:guest_name, total, table:table_number, status, order_number, type:order_type, time:created_at, phone:guest_phone, waiter:waiter_name, order_items(id,quantity, unit_price, product_name)",
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

export const usechangeOrderStatus = () => {
  return useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      if (!orderId || !newStatus) {
        throw new Error("Falta orderId o newStatus en la llamada");
      }
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)
        .select()
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      notify.success("¡Bien!", "Estado actualizado correctamente");
    },
    onError: (error) => {
      notify.error("Error", error.message || "No se pudo actualizar");
    },
  });
};
