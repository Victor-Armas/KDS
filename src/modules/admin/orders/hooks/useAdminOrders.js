import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdminOrders = () => {
  const query = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("orders")
        .select(
          `id, address, target:guest_name, total, table:table_number, 
           status, order_number, type:order_type, time:created_at, 
           phone:guest_phone, waiter:waiter_name,
           payment_status, payment_method, payment_confirmed_at,
           order_items(id, quantity, unit_price, product_name)`,
        )
        .order("created_at", { ascending: true });

      const { data, error } = await queryBuilder;
      if (error) throw error;

      return { orders: data ?? [] };
    },
  });

  useRealtimeSync("orders", [["admin-orders"], ["kitchens"]]);

  return query;
};

export const useChangeOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, newStatus, paymentMethod = undefined }) => {
      if (!orderId || !newStatus) {
        throw new Error("Falta orderId o newStatus");
      }

      const updates = { status: newStatus };

      // Si se confirma pago, registrar método y timestamp
      if (paymentMethod) {
        updates.payment_method = paymentMethod;
      }

      // Si pasa a preparing desde confirmed, marcar pago confirmado
      if (newStatus === "preparing") {
        updates.payment_status = true;
        updates.payment_confirmed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      notify.success("¡Bien!", "Estado actualizado correctamente");
    },
    onError: (error) => {
      notify.error("Error", error.message || "No se pudo actualizar");
    },
  });
};

// Mantenemos el nombre anterior como alias para no romper otros imports
export const usechangeOrderStatus = useChangeOrderStatus;
