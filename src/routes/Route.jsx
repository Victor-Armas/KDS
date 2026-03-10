import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RequireRole from "@/modules/admin/role/RequireRole";

// Layouts

import AdminLayout from "@/layouts/admin/AdminLayout";

// Online (pedidos en línea)
import OnlinePage from "@/modules/online/pages/OnlinePage";
import OrderStatusPage from "@/modules/online/pages/OrderStatusPage";
import OrderHistoryPage from "@/modules/online/pages/OrderHistoryPage";

// Admin
import ProductsPage from "@/modules/admin/products/page/ProductsPage";
import OrdersPage from "@/modules/admin/orders/page/OrdersPage";

// Kitchen & POS
import KitchenPage from "@/modules/kitchen/page/KitchenPage";
import POSPage from "@/modules/PuntoDeVenta/page/POSPage";

// Auth
import LoginPage from "@/modules/auth/page/LoginPage";
import Unauthorized from "@/modules/admin/Unauthorized";
import OnlineLayout from "@/modules/online/components/layout/OnlineLayout";

export default function AppRoute() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (user && profile === null) return <div>Cargando perfil...</div>;

  return (
    <Routes>
      {/* ── AUTH ─────────────────────────────────────────────── */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/admin" />}
      />

      {/* ── ONLINE (pedidos en línea) ─────────────────────────── */}
      <Route element={<OnlineLayout />}>
        <Route path="/online" element={<OnlinePage />} />
        <Route path="/online/order/:id" element={<OrderStatusPage />} />
        <Route
          path="/online/historial"
          element={user ? <OrderHistoryPage /> : <Navigate to="/login" />}
        />
      </Route>

      {/* ── COCINA ───────────────────────────────────────────── */}
      <Route
        path="/kitchen"
        element={
          <RequireRole roles={["admin", "kitchen"]}>
            <KitchenPage />
          </RequireRole>
        }
      />

      {/* ── PUNTO DE VENTA ───────────────────────────────────── */}
      <Route
        path="/admin/punto-venta"
        element={
          <RequireRole roles={["admin", "waiter"]}>
            <POSPage />
          </RequireRole>
        }
      />

      {/* ── ADMIN ────────────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <RequireRole roles={["admin", "waiter"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route
          path="/admin/products"
          element={
            <RequireRole roles={["admin"]}>
              <ProductsPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RequireRole roles={["admin", "kitchen", "waiter"]}>
              <OrdersPage />
            </RequireRole>
          }
        />
      </Route>

      {/* ── REDIRECTS ────────────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/online" />} />
      {/* <Route path="/kiosk" element={<Navigate to="/online" replace />} /> */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
