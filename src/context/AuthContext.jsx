import { supabase } from "@/services/supabase";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      clearTimeout(timeout);

      if (error) throw error;
      setProfile(data || null);
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // ✅ FIX: Pasar el JWT del usuario a Realtime en cada cambio de sesión.
      // Sin esto, Realtime usa el JWT anon (corta duración) y desconecta cada ~30s.
      // Con el access_token del usuario (duración 1 hora), la conexión se mantiene estable.
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      } else {
        // Usuario deslogueado: volver al JWT anon
        supabase.realtime.setAuth(null);
      }

      if (currentUser) {
        setTimeout(() => {
          fetchProfile(currentUser.id);
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-charcoal text-cream font-serif text-xl italic">
          Preparando la cocina...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
