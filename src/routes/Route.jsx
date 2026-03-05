import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/context/AuthContext";
import RequireRole from "@/modules/admin/role/RequireRole";

import KioskLayout from "../layouts/KioskLayout";
import KioskPage from "../modules/kiosk/page/KioskPage";
import KitchenPage from "@/modules/kitchen/page/KitchenPage";
import LoginPage from "@/modules/auth/page/LoginPage";

import AdminLayout from "@/layouts/admin/AdminLayout";
import ProductsPage from "@/modules/admin/page/ProductsPage";
import Unauthorized from "@/modules/admin/page/Unauthorized";

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
        {/* Aquí solo rutas que usan el sidebar del AdminLayout */}
        <Route
          path="/admin/products"
          element={
            <RequireRole roles={["admin"]}>
              <ProductsPage />
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
