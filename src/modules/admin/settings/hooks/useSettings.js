import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";
import { useRealtimeSync } from "@/utils/useRealtimeSync";

// ── Fetch ──────────────────────────────────────────────────────────────────────
async function fetchSettings() {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

// ── Hook principal ─────────────────────────────────────────────────────────────
export function useSettings() {
  const query = useQuery({
    queryKey: ["restaurant-settings"],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5,
  });

  useRealtimeSync("restaurant_settings", [
    ["restaurant-settings"],
    ["online-restaurant-settings"],
  ]);

  return query;
}

// ── Mutación: actualizar settings ─────────────────────────────────────────────
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      // Obtenemos el uuid real de la fila única
      const { data: row, error: fetchErr } = await supabase
        .from("restaurant_settings")
        .select("id")
        .limit(1)
        .single();
      if (fetchErr) throw fetchErr;

      const { data, error } = await supabase
        .from("restaurant_settings")
        .update(updates)
        .eq("id", row.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });
      notify.success("¡Guardado!", "Configuración actualizada correctamente");
    },
    onError: (err) => {
      notify.error(
        "¡Error!",
        err.message || "No se pudo guardar la configuración",
      );
    },
  });
}

// ── Mutación: toggle abierto/cerrado ──────────────────────────────────────────
export function useToggleOpen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOpen) => {
      // Obtenemos el uuid real de la fila única
      const { data: row, error: fetchErr } = await supabase
        .from("restaurant_settings")
        .select("id")
        .limit(1)
        .single();
      if (fetchErr) throw fetchErr;

      const { data, error } = await supabase
        .from("restaurant_settings")
        .update({ is_open: isOpen })
        .eq("id", row.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-settings"] });
      queryClient.invalidateQueries({
        queryKey: ["online-restaurant-settings"],
      });
      notify.success(
        data.is_open ? "¡Abierto!" : "¡Cerrado!",
        data.is_open
          ? "El restaurante está abierto"
          : "El restaurante está cerrado",
      );
    },
    onError: (err) => {
      notify.error("¡Error!", err.message);
    },
  });
}
