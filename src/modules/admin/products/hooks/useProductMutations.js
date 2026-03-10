import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const createMutation = useMutation({
    mutationFn: async (newProduct) => {
      const { error } = await supabase.from("products").insert(newProduct);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      notify.success("¡Listo!", "Producto creado correctamente");
    },
    onError: (error) => {
      notify.error("¡Híjole!", `No se pudo crear: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      notify.success("¡Listo!", "Producto actualizado correctamente");
    },
    onError: () => {
      notify.error("¡Híjole!", "No se pudo actualizar el producto");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      notify.delete("¡Eliminado!", "Producto eliminado correctamente");
    },
    onError: () => {
      notify.error("¡Híjole!", "Hubo un problema al borrar el producto");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
