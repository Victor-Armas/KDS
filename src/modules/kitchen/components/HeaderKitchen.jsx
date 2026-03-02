import { Clock } from "lucide-react";

export default function HeaderKitchen({ orders }) {
  const totalOrders = orders.length;
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
      <div className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
        <Clock size={20} />
        19:42
      </div>
    </header>
  );
}
