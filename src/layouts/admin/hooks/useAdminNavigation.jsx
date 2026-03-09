import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Users,
  Settings,
  ShoppingBasket,
} from "lucide-react";
import { useUI } from "@/context/UIContext";

export const useAdminNavigation = (profile) => {
  const { isSidebarOpen, setIsSidebarOpen } = useUI();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
      roles: ["admin"],
    },
    {
      label: "Punto de Venta",
      icon: <ShoppingBasket size={20} />,
      path: "/admin/punto-venta",
      roles: ["admin", "waiter", "kitchen"],
    },
    {
      label: "Órdenes",
      icon: <ClipboardList size={20} />,
      path: "/admin/orders",
      roles: ["admin", "waiter", "kitchen"],
    },
    {
      label: "Productos",
      icon: <Utensils size={20} />,
      path: "/admin/products",
      roles: ["admin"],
    },
    {
      label: "Usuarios",
      icon: <Users size={20} />,
      path: "/admin/users",
      roles: ["admin"],
    },
    {
      label: "Ajustes",
      icon: <Settings size={20} />,
      path: "/admin/settings",
      roles: ["admin"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(profile?.role),
  );

  return { isSidebarOpen, setIsSidebarOpen, filteredMenu, location };
};
