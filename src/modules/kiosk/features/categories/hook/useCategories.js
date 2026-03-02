import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query"

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const {data, error} = await supabase
            .from('categories')
            .select("id, name, slug")
            .order('name')
            if(error) throw error;
            return data ?? []
        }

    })
}