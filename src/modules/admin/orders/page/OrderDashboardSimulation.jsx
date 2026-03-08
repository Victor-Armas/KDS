import React, { useState, useMemo } from 'react';
import { 
  Clock, User, Hash, AlertCircle, Utensils, 
  ShoppingBag, Truck, Printer, CheckCircle2, 
  MoreHorizontal, Plus, Search, ChevronRight 
} from "lucide-react";

// --- CONFIGURACIONES ---
const STATUS_CONFIG = {
  pending_confirmation: { bg: "bg-mostaza/10", border: "border-mostaza", text: "text-mostaza", label: "Confirmar", dot: "bg-mostaza" },
  preparing: { bg: "bg-chile/10", border: "border-chile", text: "text-chile", label: "Cocina", dot: "bg-chile" },
  ready: { bg: "bg-hoja/10", border: "border-hoja", text: "text-hoja", label: "Listo", dot: "bg-hoja" },
  on_the_way: { bg: "bg-blue-500/10", border: "border-blue-500", text: "text-blue-500", label: "En Camino", dot: "bg-blue-500" },
};

const TYPE_CONFIG = {
  dine_in: { icon: <Utensils size={16} />, label: "Mesa", color: "bg-hoja/80" },
  pickup: { icon: <ShoppingBag size={16} />, label: "Llevar", color: "bg-mostaza/80" },
  delivery: { icon: <Truck size={16} />, label: "Domicilio", color: "bg-blue-500/80" },
};

// --- MOCK DATA (40 Órdenes) ---
const MOCK_ORDERS = Array.from({ length: 40 }).map((_, i) => {
  const types = ["dine_in", "pickup", "delivery"];
  const statuses = ["pending_confirmation", "preparing", "ready", "on_the_way", "completed", "cancelled"];
  const type = types[i % 3];
  const status = i < 20 ? statuses[i % 4] : statuses[4 + (i % 2)];
  
  return {
    id: `ORD-${1000 + i}`,
    type,
    target: type === "dine_in" ? `Mesa ${i + 1}` : `Cliente ${String.fromCharCode(65 + (i % 26))}.`,
    status,
    total: (Math.random() * 850 + 150).toFixed(2),
    waiter: ["Carlos R.", "Ana K.", "Mostrador"][i % 3],
    time: `${Math.floor(Math.random() * 50)} min`,
    items: ["3x Tacos Pastor", "1x Gringa", "2x Agua Jamaica", "5x Tacos Suadero", "1x Guacamole"].slice(0, (i % 4) + 2),
  };
});

export default function OrderDashboardSimulation() {
  const [selectedId, setSelectedId] = useState("ORD-1000");
  const [search, setSearch] = useState("");

  // Separación de lógica para las columnas
  const pendingOrders = useMemo(() => 
    MOCK_ORDERS.filter(o => o.status === "pending_confirmation" && o.target.toLowerCase().includes(search.toLowerCase())), 
  [search]);

  const activeOrders = useMemo(() => 
    MOCK_ORDERS.filter(o => ["preparing", "ready", "on_the_way"].includes(o.status) && o.target.toLowerCase().includes(search.toLowerCase())), 
  [search]);

  const selectedOrder = MOCK_ORDERS.find(o => o.id === selectedId);

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] p-6 gap-6 font-sans overflow-hidden">
      
      {/* HEADER DE CONTROL */}
      <header className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-cream">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-serif font-black text-charcoal">Centro de Mandos</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
            <input 
              type="text" placeholder="Buscar orden..." 
              className="w-full pl-10 pr-4 py-2 bg-cream/30 border-none rounded-xl text-xs font-bold focus:ring-2 ring-chile/20 outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <button className="bg-chile text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
          <Plus size={18} /> Nueva Orden
        </button>
      </header>

      {/* CUERPO PRINCIPAL: LAS 3 COLUMNAS */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* COLUMNA 1: POR CONFIRMAR (Fija) */}
        <section className="w-72 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase text-mostaza tracking-[0.2em] flex items-center gap-2">
              <AlertCircle size={14} className="animate-pulse" /> Confirmar ({pendingOrders.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {pendingOrders.map(order => (
              <MiniCard 
                key={order.id} order={order} 
                isSelected={selectedId === order.id} 
                onClick={() => setSelectedId(order.id)} 
              />
            ))}
          </div>
        </section>

        {/* COLUMNA 2: ACTIVOS (Grid central) */}
        <section className="flex-1 flex flex-col gap-4">
          <h2 className="text-[10px] font-black uppercase text-charcoal/30 tracking-[0.2em] px-2">
            En Proceso ({activeOrders.length})
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              {activeOrders.map(order => (
                <MainCard 
                  key={order.id} order={order} 
                  isSelected={selectedId === order.id} 
                  onClick={() => setSelectedId(order.id)} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* COLUMNA 3: DETALLE (Siempre presente) */}
        <aside className="w-[400px] bg-white rounded-[2.5rem] border border-cream shadow-xl overflow-hidden flex flex-col">
          {selectedOrder ? (
            <OrderDetail order={selectedOrder} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-charcoal/20 uppercase font-black text-[10px] tracking-widest p-10 text-center">
              <Utensils size={40} className="mb-4 opacity-10" />
              Selecciona una orden para ver el ticket
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTES DE APOYO ---

function MiniCard({ order, isSelected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 
      ${isSelected ? "border-mostaza bg-white shadow-lg scale-95" : "border-cream bg-white/50 hover:border-mostaza/30"}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black text-charcoal truncate pr-2">{order.target}</span>
        <span className="text-[10px] font-serif font-black text-mostaza">${order.total}</span>
      </div>
      <div className="flex items-center justify-between text-[8px] font-bold text-charcoal/40 uppercase">
        <span className="flex items-center gap-1"><Clock size={10}/> {order.time}</span>
        <span>{order.id}</span>
      </div>
    </div>
  );
}

function MainCard({ order, isSelected, onClick }) {
  const cfg = STATUS_CONFIG[order.status];
  return (
    <div 
      onClick={onClick}
      className={`relative flex bg-white rounded-3xl border-2 overflow-hidden transition-all cursor-pointer h-36
      ${isSelected ? "border-charcoal shadow-xl" : "border-cream hover:border-charcoal/10"}`}
    >
      <div className={`w-10 flex items-center justify-center ${TYPE_CONFIG[order.type].color} text-white`}>
        <div className="rotate-[-90deg] text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
          {TYPE_CONFIG[order.type].label}
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-serif font-black text-charcoal text-sm">{order.target}</h3>
            <div className={`flex items-center gap-1.5 ${cfg.text} text-[8px] font-black uppercase tracking-tighter`}>
              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {cfg.label}
            </div>
          </div>
          <p className="text-sm font-serif font-black text-charcoal">${order.total}</p>
        </div>
        <div className="flex flex-wrap gap-1 mb-2 overflow-hidden h-8">
          {order.items.map((it, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-cream/30 rounded text-[7px] font-bold text-charcoal/40">{it}</span>
          ))}
        </div>
        <div className="mt-auto flex justify-between items-center border-t border-cream/50 pt-2 text-[8px] font-black text-charcoal/20 uppercase">
          <span className="flex items-center gap-1"><Clock size={10}/> {order.time}</span>
          <span className="flex items-center gap-1"><User size={10}/> {order.waiter}</span>
        </div>
      </div>
    </div>
  );
}

function OrderDetail({ order }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-cream/50 bg-cream/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-serif font-black text-charcoal">{order.target}</h2>
            <p className="text-[10px] font-black uppercase text-charcoal/30 tracking-widest mt-1">
              Atendido por: {order.waiter}
            </p>
          </div>
          <div className="bg-chile text-white px-3 py-1.5 rounded-lg italic font-black text-sm shadow-lg shadow-chile/20">
            #{order.id.split('-')[1]}
          </div>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-cream/50 flex items-center justify-center font-serif font-black text-chile text-xs group-hover:bg-chile group-hover:text-white transition-all">
                {item.split('x')[0]}
              </span>
              <p className="text-sm font-bold text-charcoal/80">{item.split('x')[1]}</p>
            </div>
            <span className="text-xs font-serif font-bold text-charcoal/30">$0.00</span>
          </div>
        ))}
      </div>
      <div className="p-8 bg-cream/20 border-t border-cream">
        <div className="flex items-end justify-between mb-6">
          <p className="text-5xl font-serif font-black text-charcoal">${order.total}</p>
          <button className="p-4 bg-white rounded-2xl border border-cream text-charcoal shadow-sm hover:bg-cream transition-all"><Printer size={24}/></button>
        </div>
        <button className="w-full py-5 bg-hoja text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-hoja/20 hover:scale-[1.02] transition-all">
          Registrar Pago
        </button>
      </div>
    </div>
  );
}