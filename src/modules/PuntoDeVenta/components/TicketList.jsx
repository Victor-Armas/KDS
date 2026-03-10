import React from "react";
import { Plus, Minus, Trash2, Receipt } from "lucide-react";

export default function TicketList({ cart, updateQuantity, removeFromCart }) {
  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-4">
        <Receipt size={48} className="opacity-20" />
        <p className="font-black uppercase tracking-widest text-xs">
          Orden vacía
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-linear-to-b from-black/20 to-transparent custom-scrollbar">
      {cart.map((item) => (
        <div
          key={item.id}
          className="relative flex gap-4 items-center bg-white/5 p-5 rounded-[2.5rem] border border-white/5 group"
        >
          {/* Controles de Cantidad */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className="w-9 h-9 bg-white/5 rounded-2xl flex items-center justify-center text-[#2a9d8f] active:bg-[#2a9d8f] active:text-white transition-all cursor-pointer"
            >
              <Plus size={20} />
            </button>
            <span className="font-black text-xl w-10 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="w-9 h-9 bg-white/5 rounded-2xl flex items-center justify-center text-[#e63946] active:bg-[#e63946] active:text-white transition-all cursor-pointer"
            >
              <Minus size={20} />
            </button>
          </div>

          {/* Información del Producto */}
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-lg leading-tight mb-1 truncate pr-8">
              {item.name}
            </h4>
            <p className="text-sm font-bold text-gray-500">
              ${item.price.toFixed(2)} c/u
            </p>
            <p className="font-black text-xl text-white mt-1">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          {/* BOTÓN ELIMINAR ITEM */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="absolute top-5 right-5 p-3 bg-red-500/10 text-red-500 rounded-2xl active:bg-red-500 active:text-white transition-all shadow-sm cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
