import { Outlet } from "react-router-dom";
import { CartProvider } from "@/modules/online/context/CartContext";
import { ThemeProvider } from "@/modules/online/context/ThemeContext";

export default function OnlineLayout() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </ThemeProvider>
  );
}
