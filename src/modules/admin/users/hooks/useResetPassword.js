import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";
import { useMutation } from "@tanstack/react-query";

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("No hay sesión activa");
  return { Authorization: `Bearer ${session.access_token}` };
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ userId, newPassword }) => {
      const headers = await getAuthHeaders();
      const { data, error } = await supabase.functions.invoke(
        "reset-password",
        {
          body: { userId, newPassword },
          headers,
        },
      );
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Error desconocido");
    },
    onSuccess: () => {
      notify.success("¡Listo!", "Contraseña actualizada correctamente");
    },
    onError: (err) => {
      notify.error(
        "¡Híjole!",
        err.message || "No se pudo cambiar la contraseña",
      );
    },
  });
};
