import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { AdminHeader } from "./components/AdminHeader";
import { useAdminNavigation } from "./hooks/useAdminNavigation";
import { AdminThemeProvider } from "./context/AdminThemeContext";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";

function AdminLayoutInner() {
  const { profile } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, filteredMenu, location } =
    useAdminNavigation(profile);
  useOrderNotifications();

  return (
    <div className="flex h-screen bg-cream dark:bg-[#0f0e0d] font-sans overflow-hidden transition-colors duration-300">
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
        <section className="flex-1 min-h-0 relative bg-cream dark:bg-[#0f0e0d] transition-colors duration-300">
          {/* Background Pattern — más sutil */}
          <div
            className="absolute inset-0 z-0 pointer-events-none min-h-screen
            bg-tacos-claro dark:bg-tacos-oscuro
            bg-repeat bg-size-[500px]
            opacity-[0.06] dark:opacity-[0.04]"
          />

          {/* CONTENEDOR CON SCROLL */}
          <div className="relative z-10 h-full overflow-y-auto">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner />
    </AdminThemeProvider>
  );
}
