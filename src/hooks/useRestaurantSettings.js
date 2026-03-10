import { supabase } from "@/services/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/ui/TacoToast";

export const useRestaurantSettings = () => {
  const query = useQuery({
    queryKey: ["restaurant-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  useRealtimeSync("restaurant_settings", ["restaurant-settings"]);

  return query;
};

export const useToggleRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_open }) => {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .update({
          is_open,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });
      notify.success(
        data.is_open ? "¡Restaurante Abierto!" : "Restaurante Cerrado",
        data.is_open
          ? "Ya se pueden recibir pedidos online"
          : "No se recibirán pedidos online",
      );
    },
    onError: (error) => {
      notify.error("Error", error.message);
    },
  });
};
