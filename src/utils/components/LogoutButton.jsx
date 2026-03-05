import { useAuth } from "@/modules/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ className, children }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      // Forzamos el redireccionamiento al login tras cerrar sesión
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Cerrar Sesión"}
    </button>
  );
}
