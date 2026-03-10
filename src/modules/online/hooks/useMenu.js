import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import {
  fetchCategories,
  fetchAllProducts,
  fetchRestaurantSettings,
} from "../services/online.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["online-categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });
};

// Cargamos TODO el menú una sola vez — el filtro es en memoria con useMemo
export const useMenu = (categoryId = null) => {
  const query = useQuery({
    queryKey: ["online-products"], // ← key fija, nunca cambia con el filtro
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
  });

  // Filtrado en memoria — sin re-fetch, sin loading, instantáneo
  const products = useMemo(() => {
    if (!query.data) return [];
    if (!categoryId) return query.data;
    return query.data.filter((p) => p.category_id === categoryId);
  }, [query.data, categoryId]);

  // Realtime: si un admin cambia disponibilidad, el menú se actualiza solo
  useRealtimeSync("products", [["online-products"]]);

  return { ...query, products };
};

export const useRestaurantOpen = () => {
  return useQuery({
    queryKey: ["online-restaurant-settings"],
    queryFn: fetchRestaurantSettings,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};
