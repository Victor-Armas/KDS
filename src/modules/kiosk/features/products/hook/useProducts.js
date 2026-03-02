import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (categoryId = null) => {
  return useQuery({
    queryKey: ["products", categoryId], //Recibe categoryId por el filtro
    queryFn: async () => {
      let query = supabase.from("products").select("*").order("name");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
};
