import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import { CartProvider } from "../../context/CartContext";

export default function OnlineLayout() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </ThemeProvider>
  );
}
