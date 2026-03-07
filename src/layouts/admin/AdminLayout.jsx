import { Outlet } from "react-router-dom";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Sidebar } from "./components/Sidebar";

import { AdminHeader } from "./components/AdminHeader";
import { useAdminNavigation } from "./hooks/useAdminNavigation";

export default function AdminLayout() {
  const { profile } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, filteredMenu, location } =
    useAdminNavigation(profile);

  return (
    <div className="h-screen bg-cream flex font-sans overflow-hidden">
      <Sidebar
        menu={filteredMenu}
        location={location}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          profile={profile}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <section className="flex-1 overflow-y-auto relative bg-cream">
          {/* Capa del patrón */}
          <div className="absolute inset-0 z-0 bg-tacos-pattern bg-size-[200px_200px] bg-repeat opacity-20" />

          {/* Contenido */}
          <div className="relative z-30 p-8">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
