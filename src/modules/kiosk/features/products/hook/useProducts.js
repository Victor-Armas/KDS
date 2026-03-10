import { supabase } from "@/services/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (categoryId = null) => {
  const query = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("products")
        .select("*")
        .eq("is_available", true) // Solo lo que hay en el comal
        .order("name");

      if (categoryId) {
        queryBuilder = queryBuilder.eq("category_id", categoryId);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      return data ?? [];
    },
  });

  useRealtimeSync("products", ["products"]);

  return query;
};
