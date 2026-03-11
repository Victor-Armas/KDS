import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoute from "./routes/Route";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import { UIProvider } from "./context/UIContext";
import { OrderNotificationContainer } from "@/components/ui/OrderNotification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      retry: 2,
    },
  },
});

createRoot(document.getElementById("root")).render(
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
        {/* Notificaciones de nuevas órdenes — esquina inferior derecha */}
        <OrderNotificationContainer />
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </UIProvider>
    </AuthProvider>
  </QueryClientProvider>,
);
