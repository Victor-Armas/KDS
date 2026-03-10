import { useState, useEffect } from "react";
import LogoutButton from "@/components/ui/LogoutButton";
import { Clock } from "lucide-react";

export default function HeaderKitchen({ orders }) {
  const [time, setTime] = useState(new Date());
  const totalOrders = orders.length;

  // Efecto para actualizar el reloj cada minuto
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 60); // Actualiza cada minuto
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <header className="flex justify-between items-center mb-6 text-white bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-700">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Cocina - En Preparación
        </h1>
        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold border border-emerald-500/30">
          {totalOrders} Órdenes activas
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-emerald-400 border-r border-slate-600 pr-6">
          <Clock size={20} />
          {formatTime(time)}
        </div>

        <LogoutButton className="bg-red-600/10 text-red-400 border border-red-600/50 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-medium">
          Salir de Cocina
        </LogoutButton>
      </div>
    </header>
  );
}
