import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoute from "./routes/Route";
import { CartProvider } from "./modules/kiosk/features/cart/context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import { UIProvider } from "./context/UIContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min - los productos no cambian tanto
      retry: 2,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "transparent",
              border: "none",
              boxShadow: "none",
            },
          }}
        />
        <BrowserRouter>
          <CartProvider>
            <AppRoute />
          </CartProvider>
        </BrowserRouter>
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
