import React, { useState, useMemo } from "react";
import {
  Search,
  Utensils,
  ShoppingBag,
  Truck,
  Clock,
  ChevronRight,
  Filter,
  Plus,
  CheckCircle2,
  X,
  Edit3,
  Printer,
  TrendingUp,
  AlertCircle,
  History,
  Trash2,
  User,
  Hash,
  MoreHorizontal,
  MapPin,
  Check,
  ChevronLeft,
} from "lucide-react";
import { MOCK_ORDERS } from "@/utils/mockOrders";

const STATUS_CONFIG = {
  pending_confirmation: {
    bg: "bg-mostaza/5",
    border: "border-l-mostaza",
    text: "text-mostaza",
    label: "Confirmar",
    icon: <AlertCircle size={14} className="animate-pulse" />,
    dot: "bg-mostaza",
  },
  preparing: {
    bg: "bg-chile/5",
    border: "border-l-chile",
    text: "text-chile",
    label: "Cocina",
    icon: <Clock size={14} />,
    dot: "bg-chile",
  },
  ready: {
    bg: "bg-hoja/5",
    border: "border-l-hoja",
    text: "text-hoja",
    label: "Listo",
    icon: <CheckCircle2 size={14} />,
    dot: "bg-hoja",
  },
  on_the_way: {
    bg: "bg-blue-500/5",
    border: "border-l-blue-500",
    text: "text-blue-600",
    label: "En Camino",
    icon: <Truck size={14} />,
    dot: "bg-blue-500",
  },
  completed: {
    bg: "bg-charcoal/5",
    border: "border-l-charcoal",
    text: "text-charcoal/40",
    label: "Pagado",
    icon: <Check size={14} />,
    dot: "bg-charcoal",
  },
  cancelled: {
    bg: "bg-red-500/5",
    border: "border-l-red-500",
    text: "text-red-500",
    label: "Cancelado",
    icon: <X size={14} />,
    dot: "bg-red-500",
  },
};

const TYPE_CONFIG = {
  dine_in: { icon: <Utensils size={18} />, label: "Mesa" },
  pickup: { icon: <ShoppingBag size={18} />, label: "Llevar" },
  delivery: { icon: <Truck size={18} />, label: "Domicilio" },
};

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("activas"); // activas | historial | todas
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- LÓGICA DE FILTRADO REAL ---
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.target.toLowerCase().includes(searchQuery.toLowerCase());

      const isHistory = ["completed", "cancelled"].includes(order.status);

      if (activeTab === "activas") return matchesSearch && !isHistory;
      if (activeTab === "historial") return matchesSearch && isHistory;
      return matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const selectedOrder = MOCK_ORDERS.find((o) => o.id === selectedOrderId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4 lg:gap-6 overflow-hidden relative">
      {/* --- HEADER DE CONTROL --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-softwhite/80 backdrop-blur-xl p-4 lg:p-5 rounded-[2rem] lg:rounded-[2.5rem] border border-cream shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-4 lg:gap-8 w-full md:w-auto">
          <div className="hidden xl:block">
            <h1 className="text-xl font-serif font-bold text-charcoal tracking-tight">
              Centro de Mandos
            </h1>
            <p className="text-[9px] font-black uppercase text-charcoal/30 tracking-[0.2em]">
              Operaciones
            </p>
          </div>

          <div className="flex bg-cream/50 p-1 rounded-2xl border border-cream flex-1 md:flex-none">
            {["activas", "historial", "todas"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedOrderId(null);
                }}
                className={`flex-1 md:flex-none px-4 lg:px-6 py-2 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-white text-charcoal shadow-sm"
                    : "text-charcoal/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-cream rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-chile/5 transition-all"
            />
          </div>
          <button className="bg-chile text-white p-3 lg:px-6 lg:py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:brightness-110 shadow-lg shadow-chile/20">
            <Plus size={18} strokeWidth={3} />{" "}
            <span className="hidden lg:inline">Nueva Orden</span>
          </button>
        </div>
      </div>

      {/* --- CONTENIDO --- */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* GRID DE ÓRDENES */}
        <div
          className={`flex-1 overflow-y-auto pr-2 custom-scrollbar transition-all ${selectedOrderId ? "hidden lg:block" : "block"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-10">
            {filteredOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const type = TYPE_CONFIG[order.type];
              const isSelected = selectedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`relative group bg-softwhite rounded-[2rem] border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-44
                    ${isSelected ? "border-mostaza shadow-xl scale-[0.98]" : "border-cream hover:border-mostaza/30 shadow-sm"}
                    ${cfg.border} border-l-[8px] p-5`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-charcoal text-white" : "bg-white text-charcoal"}`}
                      >
                        {type.icon}
                      </div>
                      <div className="max-w-[140px]">
                        <h3 className="font-serif font-bold text-sm text-charcoal leading-tight truncate">
                          {order.target}
                        </h3>
                        <div
                          className={`flex items-center gap-1.5 ${cfg.text}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${order.status === "preparing" ? "animate-pulse" : ""}`}
                          />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-serif font-bold text-charcoal">
                        ${order.total}
                      </p>
                      <p className="text-[9px] font-black text-charcoal/20 uppercase tracking-tighter">
                        #{order.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3 h-10 overflow-hidden content-start">
                    {order.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white border border-cream rounded-md text-[8px] font-bold text-charcoal/40 uppercase"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-cream/50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-charcoal/30 font-bold text-[9px] uppercase tracking-tighter">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {order.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {order.waiter}
                      </span>
                    </div>
                    <MoreHorizontal size={16} className="text-charcoal/20" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL DE DETALLE (ADAPTATIVO) */}
        {/* PANEL DE DETALLE (ADAPTATIVO) */}
        <div
          className={`
    fixed inset-0 z-50 lg:static lg:z-0
    lg:w-70 xl:w-100 bg-softwhite text-charcoal flex flex-col 
    lg:rounded-xl shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transition-all duration-500 border-l border-cream
    ${selectedOrderId ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100"}
  `}
        >
          {selectedOrder ? (
            <div className="flex flex-col h-full relative overflow-hidden">
              {/* HEADER: Sin botón X, con ID destacado y Tipo de Orden */}
              <div className="p-6 pb-4 bg-white border-b border-cream/50 relative z-10">
                <div className="flex items-start justify-between w-full gap-4">
                  {/* Nombre y Tipo agrupados */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icono de Tipo - Funciona como distintivo visual */}
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm ${
                        selectedOrder.type === "dine_in"
                          ? "bg-hoja/10 border-hoja/20 text-hoja"
                          : selectedOrder.type === "pickup"
                            ? "bg-mostaza/10 border-mostaza/20 text-mostaza"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-600"
                      }`}
                    >
                      {TYPE_CONFIG[selectedOrder.type].icon}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-2xl xl:text-3xl font-serif font-bold text-charcoal leading-none truncate">
                        {selectedOrder.target}
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-charcoal/30 mt-1">
                        Servicio: {TYPE_CONFIG[selectedOrder.type].label}
                      </p>
                    </div>
                  </div>

                  {/* ID de la Orden y Tiempo */}
                  <div className="flex flex-col items-end shrink-0">
                    <div className="px-3 py-1.5 bg-chile text-white rounded-lg shadow-lg shadow-chile/20 flex flex-col items-center min-w-[65px]">
                      <span className="text-[8px] font-black uppercase tracking-tighter leading-none opacity-70">
                        Orden
                      </span>
                      <span className="text-[15px] font-black leading-none mt-0.5 italic">
                        #{selectedOrder.id.toString().slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-charcoal/30 mt-2">
                      <Clock size={11} />
                      {selectedOrder.time}
                    </div>
                  </div>
                </div>
              </div>

              {/* LISTA DE ITEMS: Espacio maximizado */}
              <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">
                    Resumen de Consumo
                  </p>
                  <span className="text-[10px] font-bold text-charcoal/20 bg-cream/50 px-2 py-0.5 rounded">
                    {selectedOrder.items.length} productos
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start p-3.5 rounded-2xl bg-cream/20 border border-cream/40 group hover:bg-white hover:shadow-md hover:shadow-charcoal/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-cream text-chile font-serif font-black shadow-sm group-hover:bg-chile group-hover:text-white transition-colors">
                          {item.split("x")[0]}
                        </div>
                        <p className="font-bold text-xs text-charcoal/80 leading-tight">
                          {item.split("x")[1]}
                        </p>
                      </div>
                      <span className="font-serif text-xs font-bold text-charcoal/40 tabular-nums">
                        $---
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER: Total y Acciones */}
              <div className="p-6 bg-cream/30 border-t border-cream relative z-10">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-[9px] font-black text-mostaza uppercase tracking-widest mb-1">
                      Monto Total
                    </p>
                    <p className="text-4xl lg:text-5xl font-serif font-bold text-charcoal tracking-tighter leading-none">
                      <span className="text-xl align-top mr-0.5 text-mostaza font-sans">
                        $
                      </span>
                      {selectedOrder.total}
                    </p>
                  </div>
                  <button className="p-3.5 bg-white hover:bg-cream rounded-2xl text-charcoal border border-cream shadow-sm transition-all active:scale-95">
                    <Printer size={20} />
                  </button>
                </div>

                {/* Acciones principales */}
                <div className="space-y-2">
                  <button className="w-full py-4 bg-hoja text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-hoja/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    Registrar Pago
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-3 bg-white text-charcoal/40 rounded-xl font-bold text-[9px] uppercase tracking-widest border border-cream hover:bg-softwhite transition-all">
                      Editar
                    </button>
                    <button className="py-3 bg-chile/5 text-chile rounded-xl font-bold text-[9px] uppercase tracking-widest border border-chile/10 hover:bg-chile hover:text-white transition-all">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Requerido */
            <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-tacos-pattern opacity-[0.03] pointer-events-none" />
              <div className="w-16 h-16 bg-cream rounded-[2rem] flex items-center justify-center mb-6 border border-mostaza/10">
                <Utensils size={28} className="text-mostaza/30" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal/40">
                Sin pedido seleccionado
              </h3>
              <p className="text-[11px] text-charcoal/30 mt-3 max-w-[180px] uppercase font-black tracking-widest leading-relaxed">
                Selecciona un pedido de la lista para ver los detalles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
