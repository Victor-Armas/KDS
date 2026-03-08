import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { AdminHeader } from "./components/AdminHeader";
import { useAdminNavigation } from "./hooks/useAdminNavigation";

export default function AdminLayout() {
  const { profile } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, filteredMenu, location } =
    useAdminNavigation(profile);

  return (
    <div className="flex h-screen bg-cream font-sans overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar
        menu={filteredMenu}
        location={location}
        isOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-col flex-1 min-w-0 min-h-0 relative">
        {/* HEADER */}
        <AdminHeader
          profile={profile}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* ÁREA DE PÁGINAS */}
        <section className="flex-1 min-h-0 relative bg-cream">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 bg-tacos-pattern bg-size-[200px_200px] bg-repeat opacity-10 pointer-events-none" />

          {/* CONTENEDOR CON SCROLL: 
            Permite que las páginas como Productos fluyan naturalmente.
          */}
          <div className="relative z-10 h-full overflow-y-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
