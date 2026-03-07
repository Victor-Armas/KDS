import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Hook para sincronizar tablas de Supabase con React Query en tiempo real.
 * @param {string} table - Nombre de la tabla en Supabase.
 * @param {string[]} queryKey - La llave base de React Query que quieres invalidar.
 * @param {string} event - El evento a escuchar ('*', 'INSERT', 'UPDATE', 'DELETE').
 */
export const useRealtimeSync = (table, queryKeys, event = "*") => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-realtime-sync`)
      .on("postgres_changes", { event, schema: "public", table }, () => {
        // Convertimos a array si nos pasan solo una llave, para poder usar forEach
        const keysToInvalidate = Array.isArray(queryKeys[0])
          ? queryKeys
          : [queryKeys];

        keysToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({
            queryKey: key,
            exact: false,
          });
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryKeys, event, queryClient]);
};
