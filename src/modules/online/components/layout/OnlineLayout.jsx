import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext.jsx";
import { CartProvider } from "../../context/CartContext.jsx";

export default function OnlineLayout() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </ThemeProvider>
  );
}
