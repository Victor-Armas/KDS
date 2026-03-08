import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RequireRole from "@/modules/admin/role/RequireRole";

import KioskLayout from "../layouts/KioskLayout";
import KioskPage from "../modules/kiosk/page/KioskPage";
import KitchenPage from "@/modules/kitchen/page/KitchenPage";
import LoginPage from "@/modules/auth/page/LoginPage";

import AdminLayout from "@/layouts/admin/AdminLayout";
import ProductsPage from "@/modules/admin/products/page/ProductsPage";
import Unauthorized from "@/modules/admin/Unauthorized";
import OrdersPage from "@/modules/admin/orders/page/OrdersPage";
import OrderDashboardSimulation from "@/modules/admin/orders/page/OrderDashboardSimulation";


export default function AppRoute() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (user && profile === null) return <div>Cargando perfil...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/admin" />}
      />

      {/* 1. KIOSKO: Acceso Público */}
      <Route element={<KioskLayout />}>
        <Route path="/kiosk" element={<KioskPage />} />
      </Route>

      {/* 2. COCINA: Interfaz independiente (Sin AdminLayout) */}
      <Route
        path="/kitchen"
        element={
          <RequireRole roles={["admin", "kitchen"]}>
            <KitchenPage />
          </RequireRole>
        }
      />

      {/* 3. PANEL ADMINISTRATIVO: Con Sidebar y Header */}
      <Route
        path="/admin"
        element={
          <RequireRole roles={["admin", "waiter"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        {/* Ruta Panel administrativo Gestion de Productos  */}
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

         <Route
          path="/admin/users"
          element={
            <RequireRole roles={["admin", "kitchen", "waiter"]}>
              <OrderDashboardSimulation/>
            </RequireRole>
          }
        />

       

        
        

        {/* Ejemplo: Una ruta para que el mesero vea órdenes sin ser la vista de cocina */}
        <Route
          path="/admin/orders-list"
          element={<div>Lista de pedidos para meseros</div>}
        />
      </Route>

      <Route path="/" element={<Navigate to="/kiosk" />} />

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
