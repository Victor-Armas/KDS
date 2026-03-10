import { supabase } from "@/services/supabase";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useQuery } from "@tanstack/react-query";

export const useAdminProducts = ({
  categoryId = null,
  searchTerm = "",
  page = 0,
  pageSize = 10,
} = {}) => {
  const query = useQuery({
    queryKey: ["admin-products", categoryId, searchTerm, page, pageSize],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("products")
        .select("*, category:categories(name)", { count: "exact" })
        .order("created_at", { ascending: false });

      if (categoryId) {
        queryBuilder = queryBuilder.eq("category_id", categoryId);
      }

      if (searchTerm) {
        queryBuilder = queryBuilder.ilike("name", `%${searchTerm}%`);
      }

      const from = page * pageSize;
      const to = from + pageSize - 1;
      queryBuilder = queryBuilder.range(from, to);

      const { data, error, count } = await queryBuilder;
      if (error) throw error;

      return {
        products: data ?? [],
        total: count ?? 0,
      };
    },
  });

  useRealtimeSync("products", [["admin-products"], ["products"]]);

  return query;
};
