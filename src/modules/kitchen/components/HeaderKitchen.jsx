import { useState, useEffect } from "react";
import LogoutButton from "@/components/ui/LogoutButton";
import { Clock, ChefHat, AlertTriangle, LogOut } from "lucide-react";
import { useSettings } from "@/modules/admin/settings/hooks/useSettings";

export default function HeaderKitchen({ orders }) {
  const { data: settings } = useSettings();
  const restaurantName = settings?.restaurant_name || "Cocina";
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const urgentCount = orders.filter((o) => {
    const minutes = Math.floor((Date.now() - new Date(o.preparing_at)) / 60000);
    return minutes >= 20;
  }).length;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0a0a09] border-b border-white/5">
      {/* Izquierda: Logo + título */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
          <ChefHat size={20} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-base font-black text-white tracking-tight leading-none">
            {restaurantName}
          </h1>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">
            En preparación
          </p>
        </div>
      </div>

      {/* Centro: Stats */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Total órdenes */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
          <span className="text-2xl font-black text-white leading-none">
            {orders.length}
          </span>
          <span className="text-[9px] font-black text-white/30 uppercase tracking-wider leading-tight">
            En
            <br />
            cocina
          </span>
        </div>

        {/* Urgentes */}
        {urgentCount > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl animate-pulse">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-2xl font-black text-red-400 leading-none">
              {urgentCount}
            </span>
            <span className="text-[9px] font-black text-red-400/60 uppercase tracking-wider leading-tight">
              Urgente{urgentCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Derecha: Reloj + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-emerald-400 font-black text-lg tabular-nums">
          <Clock size={16} className="opacity-60" />
          {formatTime(time)}
        </div>

        <LogoutButton className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/30 rounded-xl transition-all text-xs font-black uppercase tracking-widest cursor-pointer">
          <LogOut size={14} />
          <span className="hidden md:inline">Salir</span>
        </LogoutButton>
      </div>
    </header>
  );
}
