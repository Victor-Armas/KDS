import React from "react";
import TicketList from "./TicketList";
import TicketFooter from "./TicketFooter";
import TicketHeader from "./TicketHeader";

export default function TicketSidebar({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  cartTotal,
  orderType,
  setOrderType,
  confirmOrder,
  isSubmitting,
  setTableNumber,
  tableNumber,
  setGuestName,
  guestName,
}) {
  return (
    <aside
      className={`
      fixed inset-0 z-50 lg:relative lg:z-0 lg:flex
      ${isOpen ? "flex" : "hidden"}
      w-full lg:w-105 xl:w-120 bg-[#0f0e0d] flex-col shrink-0 border-l border-white/5
    `}
    >
      <TicketHeader
        onClose={onClose}
        orderType={orderType}
        setOrderType={setOrderType}
        setTableNumber={setTableNumber}
        tableNumber={tableNumber}
        setGuestName={setGuestName}
        guestName={guestName}
      />

      <TicketList
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <TicketFooter
        cartTotal={cartTotal}
        isCartEmpty={cart.length === 0}
        confirmOrder={confirmOrder}
        isSubmitting={isSubmitting}
      />
    </aside>
  );
}
