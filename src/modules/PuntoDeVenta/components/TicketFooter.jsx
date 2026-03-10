import React from "react";
import { Sparkles, Utensils } from "lucide-react";

export default function TicketFooter({
  cartTotal,
  isCartEmpty,
  isSubmitting,
  confirmOrder,
}) {
  return (
    <div className="p-4 bg-black border-t border-white/10 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-end mb-8">
        <div className="flex text-center items-center space-x-4">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Total
          </p>
          <div className="flex items-center text-white">
            <span className="text-3xl font-black mt-2 mr-1 text-[#e63946]">
              $
            </span>
            <p className="text-4xl font-black tracking-tighter">
              {cartTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => confirmOrder(true)}
          disabled={isCartEmpty}
          className="py-4 bg-[#e63946] disabled:opacity-30 text-white rounded-4xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex justify-center items-center gap-3 cursor-pointer"
        >
          <Sparkles size={22} />
          COBRAR
        </button>
        <button
          onClick={() => confirmOrder(false)}
          disabled={isCartEmpty || isSubmitting}
          className="py-4 bg-white/5 disabled:opacity-30 text-[#2a9d8f] border-2 border-[#2a9d8f]/30 rounded-4xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all flex justify-center items-center gap-3 cursor-pointer"
        >
          <Utensils size={22} />
          {isSubmitting ? "Enviando..." : `Cocina $${cartTotal.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
