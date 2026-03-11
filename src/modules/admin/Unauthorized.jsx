import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 bg-softwhite p-10 rounded-3xl shadow-xl border border-chile/10">
        {/* Icono de Alerta */}
        <div className="flex justify-center">
          <div className="bg-chile/10 p-6 rounded-full">
            <ShieldAlert size={64} className="text-chile" strokeWidth={1.5} />
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-charcoal">
            Acceso Denegado
          </h1>
          <p className="text-charcoal/60 font-sans">
            Lo sentimos, no tienes los permisos necesarios para visualizar esta
            sección del sistema.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal/90 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Volver atrás
          </button>

          <button
            onClick={() => navigate("/online")}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-cream text-charcoal rounded-xl font-medium hover:bg-mostaza/10 hover:border-mostaza/20 transition-all active:scale-95"
          >
            <Home size={18} />
            Ir a la pagina principal
          </button>
        </div>

        <p className="text-xs text-charcoal/40 pt-4">
          Si crees que esto es un error, contacta al administrador.
        </p>
      </div>
    </div>
  );
}
