import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export function useAuthLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await signIn(cleanEmail, password);
      if (error) throw error;

      //consultar el perfil
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;
      return profile;
    },
    onSuccess: (profile) => {
      //logica se redireccion centralizada
      if (profile?.role === "admin") {
        navigate("/admin");
      } else if (profile?.role === "kitchen") {
        navigate("/kitchen");
      } else {
        navigate("/kiosk");
      }
    },
    onError: (error) => {
      // Aquí podrías usar un toast o un alert
      console.error("Login Error:", error.message);
    },
  });
  return {
    loginMutation,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
