import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCart } from "../../cart/context/CartContext";

export function useCreateOrder() {
  const { clearCart } = useCart();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ form, items }) => {
      // Calcular el total
      const total = items.reduce(
        (sum, item) => sum + item.quantity * Number(item.price),
        0,
      );
      //Verificar el tipo de orden para responder status
      const initialStatus =
        form.order_type === "dine_in" ? "preparing" : "pending_confirmation";
      // 2. Insertar Ordenes
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_type: form.order_type,
          status: initialStatus,
          total,
          guest_name: form.guest_name,
          guest_phone: form.guest_phone || null,
          guest_email: form.guest_email || null,
          address: form.address || null,
          table_number: form.table_number || null,
          notes: form.notes || null,
        })
        .select("id, order_number, created_at")
        .single();

      if (orderError) throw orderError;

      //3. Insertar en order_items

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: Number(item.price),
        product_name: item.name,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({
        queryKey: ["kitchens"],
      });
    },
  });
  return {
    createOrder: mutation.mutateAsync,
    ...mutation,
  };
}
