import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

export const useAdminNavigation = (profile) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
      roles: ["admin"],
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
