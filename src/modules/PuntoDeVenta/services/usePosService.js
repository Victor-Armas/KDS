import { supabase } from "@/services/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePosService = () => {
  const query = useQuery({
    queryKey: ["pos-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("name");

      if (error) throw error;
      return data ?? [];
    },
  });
  useRealtimeSync("products", ["pos-products"]);
  return query;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData) => {
      if (!orderData.items || orderData.items.length === 0) return;

      if (orderData.orderType === "dine_in" && !orderData.tableNumber?.trim())
        return;
      if (orderData.orderType === "pickup" && !orderData.guestName?.trim())
        return;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            total: Number(orderData.total),
            order_type: orderData.orderType,
            status: "preparing",
            guest_name: orderData.guestName,
            table_number: orderData.tableNumber,
            is_paid: orderData.isPaid,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = orderData.items.map((item) => ({
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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["kitchens"] });
    },
  });
};
