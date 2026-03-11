import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";
import { useRealtimeSync } from "@/utils/useRealtimeSync";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Helper: obtiene el token de sesión actual
const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("No hay sesión activa");
  return { Authorization: `Bearer ${session.access_token}` };
};

// ─── Fetch all users (profiles) ───────────────────────────────────────────────
export const useUsers = () => {
  const query = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  useRealtimeSync("profiles", [["admin-users"]]);
  return query;
};

// ─── Create user via Edge Function ────────────────────────────────────────────
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, full_name, role }) => {
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: { email, password, full_name, role },
        headers,
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Error desconocido");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify.success("¡Listo!", "Usuario creado correctamente");
    },
    onError: (err) => {
      notify.error("¡Híjole!", err.message || "No se pudo crear el usuario");
    },
  });
};

// ─── Update profile (role, full_name, is_active) ──────────────────────────────
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify.success("¡Listo!", "Usuario actualizado");
    },
    onError: (err) => {
      notify.error("¡Híjole!", err.message || "No se pudo actualizar");
    },
  });
};

// ─── Toggle active status ─────────────────────────────────────────────────────
export const useToggleUserActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify.info(
        is_active ? "Usuario activado" : "Usuario desactivado",
        is_active
          ? "El usuario puede iniciar sesión"
          : "El usuario no puede ingresar al sistema",
      );
    },
    onError: (err) => {
      notify.error("Error", err.message);
    },
  });
};

// ─── Delete user via Edge Function ────────────────────────────────────────────
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { userId },
        headers,
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Error desconocido");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify.delete("Eliminado", "El usuario fue eliminado del sistema");
    },
    onError: (err) => {
      notify.error("¡Híjole!", err.message || "No se pudo eliminar");
    },
  });
};
