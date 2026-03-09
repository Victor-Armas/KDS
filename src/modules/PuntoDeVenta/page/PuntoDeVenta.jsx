import React, { useState } from "react";
import {
  Search,
  Utensils,
  ShoppingBag,
  Plus,
  Minus,
  User,
  Hash,
  Receipt,
  Sparkles,
  X,
} from "lucide-react";

// --- DATOS REALES BASADOS EN TU CSV ---
const CATEGORIAS = ["Todos", "Tacos", "Bebidas", "Postres", "Extras"];

export default function PuntoDeVenta() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [orderType, setOrderType] = useState("dine_in");
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex  flex-col lg:flex-row overflow-hidden bg-[#0f0e0d] text-[#f8f9fa] font-sans select-none">
      {/* SECCIÓN IZQUIERDA - CATÁLOGO */}
      <section className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header optimizado para Touch */}
        <header className="p-4 lg:p-5 border-b border-gray-800 bg-black/40 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#e63946] p-2.5 rounded-xl shadow-lg shadow-red-900/30">
              <Utensils size={24} className="text-white" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight hidden sm:block">
              Taquería POS
            </h2>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                placeholder="Buscar..."
                className="w-full bg-gray-900 border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-base outline-none focus:border-[#e63946]"
              />
            </div>
          </div>

          {/* Botón Carrito para Móvil */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="lg:hidden relative p-3 bg-gray-900 rounded-xl border border-gray-800"
          >
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-[#e63946] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {MOCK_CART.length}
            </span>
          </button>
        </header>

        {/* Categorías (Pills Touch Friendly) */}
        <div className="p-4 border-b border-gray-800 overflow-x-auto flex gap-3 no-scrollbar shrink-0 bg-black/20 active:cursor-grabbing">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                ${activeCategory === cat ? "bg-[#e63946] border-[#e63946] text-white shadow-lg" : "bg-gray-900 border-gray-800 text-gray-500"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Productos (Cards más grandes para dedos) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 bg-[#0a0a0a]">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-[#141414] rounded-[2rem] overflow-hidden border border-gray-800 active:scale-95 active:border-[#e63946] transition-all flex flex-col touch-manipulation"
              onClick={() => {
                /* Lógica agregar */
              }}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl font-black text-sm text-[#f4a261]">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center text-center">
                <h3 className="font-bold text-sm lg:text-base leading-snug line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIDEBAR TICKET (Responsive Overlay en móvil / Side en Desktop) */}
      <aside
        className={`
        fixed inset-0 z-50 lg:relative lg:z-0 lg:flex
        ${isCartOpen ? "flex" : "hidden"}
        w-full lg:w-[400px] xl:w-[450px] bg-[#0a0a0a] flex-col shrink-0
      `}
      >
        {/* Header Ticket con botón cerrar para móvil */}
        <div className="p-6 border-b border-gray-800 shrink-0 bg-[#0f0e0d]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Receipt size={24} className="text-[#e63946]" />
              <h3 className="text-xl font-bold uppercase tracking-tighter">
                Orden Actual
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="lg:hidden p-2 bg-gray-900 rounded-lg text-gray-400"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex bg-gray-900/50 rounded-2xl p-1.5 border border-gray-800 mb-6">
            <button
              onClick={() => setOrderType("dine_in")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${orderType === "dine_in" ? "bg-[#1a1a1a] text-white shadow-xl" : "text-gray-600"}`}
            >
              En Mesa
            </button>
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${orderType === "pickup" ? "bg-[#1a1a1a] text-white shadow-xl" : "text-gray-600"}`}
            >
              Llevar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-3 flex items-center gap-3">
              <Hash size={18} className="text-gray-600" />
              <input
                type="number"
                placeholder="MESA"
                className="bg-transparent border-none text-base font-black outline-none w-full placeholder:text-gray-700"
              />
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-3 flex items-center gap-3">
              <User size={18} className="text-gray-600" />
              <input
                type="text"
                placeholder="CLIENTE"
                className="bg-transparent border-none text-base font-black outline-none w-full placeholder:text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Lista items con botones grandes para dedos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
          {MOCK_CART.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 items-center bg-[#141414] p-4 rounded-[1.5rem] border border-gray-800"
            >
              <div className="flex flex-col items-center bg-black rounded-2xl p-1 border border-gray-800">
                <button className="p-3 text-[#2a9d8f] active:scale-125 transition-transform">
                  <Plus size={20} />
                </button>
                <span className="font-black text-lg">{item.quantity}</span>
                <button className="p-3 text-[#e63946] active:scale-125 transition-transform">
                  <Minus size={20} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base">{item.name}</h4>
                <p className="text-xs text-gray-500 font-bold">
                  ${item.price.toFixed(2)} c/u
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer de Cobro Fijo */}
        <div className="p-6 bg-black border-t border-gray-800 shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                Total a Cobrar
              </p>
              <div className="flex items-start text-white">
                <span className="text-2xl font-black mr-1">$</span>
                <p className="text-5xl font-black tracking-tighter">17.83</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-5 bg-[#e63946] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 active:scale-95 transition-all flex flex-col items-center gap-1">
              <Sparkles size={24} />
              <span>Cobrar</span>
            </button>
            <button className="py-5 bg-[#2a9d8f]/10 text-[#2a9d8f] border-2 border-[#2a9d8f]/20 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex flex-col items-center gap-1 text-center leading-tight">
              <Utensils size={24} />
              <span>Cocina</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
