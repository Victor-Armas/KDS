import React from "react";
import { Receipt, X, Hash, User } from "lucide-react";

export default function TicketHeader({
  onClose,
  orderType,
  setOrderType,
  setTableNumber,
  tableNumber,
  setGuestName,
  guestName,
}) {
  return (
    <div className="p-4 bg-black/40 border-b border-white/5 shrink-0">
      {/* Header con Título y Cerrar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-[#e63946]">
          <Receipt size={28} />
          <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">
            Ticket
          </h3>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      {/* Selectores de Tipo de Orden (Local / Llevar) */}
      <div className="flex bg-white/5 rounded-4xl p-2 border border-white/10 mb-6">
        {["dine_in", "pickup"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setOrderType(type);
              // Reiniciamos los inputs al cambiar de modo para evitar datos cruzados
              if (type === "dine_in") {
                setGuestName("");
              } else {
                setTableNumber("");
              }
            }}
            className={`flex-1 py-3 rounded-3xl text-xs font-black uppercase tracking-widest transition-all 
              ${orderType === type ? "bg-[#e63946] text-white shadow-lg" : "text-gray-500 hover:text-gray-300 cursor-pointer"}`}
          >
            {type === "dine_in" ? "Local" : "Llevar"}
          </button>
        ))}
      </div>

      {/* Input Dinámico (Mesa o Cliente) */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 focus-within:border-[#e63946]/50 transition-colors">
          {/* Icono dinámico */}
          {orderType === "dine_in" ? (
            <Hash className="text-[#e63946]" size={20} />
          ) : (
            <User className="text-[#e63946]" size={20} />
          )}

          <input
            type={orderType === "dine_in" ? "number" : "text"}
            value={orderType === "dine_in" ? tableNumber : guestName}
            onChange={
              orderType === "dine_in"
                ? (e) => setTableNumber(e.target.value)
                : (e) => setGuestName(e.target.value)
            }
            inputMode={orderType === "dine_in" ? "numeric" : "text"}
            placeholder={
              orderType === "dine_in" ? "NÚMERO DE MESA" : "NOMBRE DEL CLIENTE"
            }
            className="bg-transparent border-none text-md font-black outline-none w-full text-white uppercase placeholder:text-white/20"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
