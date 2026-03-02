import { Outlet } from "react-router-dom";
import HeaderKiosk from "../shared/HeaderKiosk";
import { useState } from "react";
import CartDrawer from "@/modules/kiosk/features/cart/components/CartDrawer";

export default function KioskLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal">
      {/* Header */}
      <HeaderKiosk openCart={openCart} />

      <div className=" py-6">
        <Outlet />
      </div>

      <CartDrawer cartOpen={cartOpen} closeCart={closeCart} />
    </div>
  );
}
