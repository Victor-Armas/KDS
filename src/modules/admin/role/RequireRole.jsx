import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RequireRole({ roles = [], children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // opcional: spinner o null
    return null;
  }

  if (!user || !profile) {
    // no hay sesión → ir al login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes(profile.role)) {
    // sesión válida pero rol no autorizado
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
