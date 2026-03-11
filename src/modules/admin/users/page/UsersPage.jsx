import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Search,
  X,
  ChefHat,
  ShoppingBag,
  Settings,
  UserCheck,
} from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import UsersTable from "../components/UsersTable";
import ModalUserForm from "../components/ModalUserForm";
import Spinner from "@/components/ui/Spinner";

const TABS = [
  { id: "all", label: "Todos", icon: Users },
  {
    id: "staff",
    label: "Staff",
    icon: Settings,
    roles: ["admin", "waiter", "kitchen"],
  },
  { id: "client", label: "Clientes", icon: ShoppingBag, roles: ["client"] },
];

const ROLE_STATS = [
  {
    role: "admin",
    label: "Admins",
    icon: Settings,
    color: "text-chile",
    bg: "bg-chile/10 dark:bg-chile/15",
  },
  {
    role: "waiter",
    label: "Meseros",
    icon: UserCheck,
    color: "text-mostaza",
    bg: "bg-mostaza/10 dark:bg-mostaza/15",
  },
  {
    role: "kitchen",
    label: "Cocina",
    icon: ChefHat,
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
  },
  {
    role: "client",
    label: "Clientes",
    icon: ShoppingBag,
    color: "text-hoja",
    bg: "bg-hoja/10 dark:bg-hoja/15",
  },
];

export default function UsersPage() {
  const { data: users = [], isLoading, isFetching } = useUsers();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null); // null=closed, {}=create, {user}=edit

  const filtered = useMemo(() => {
    let list = users;

    // Tab filter
    const tab = TABS.find((t) => t.id === activeTab);
    if (tab?.roles) list = list.filter((u) => tab.roles.includes(u.role));

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [users, activeTab, search]);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-5 p-4 lg:p-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-chile/10 dark:bg-chile/20 flex items-center justify-center shrink-0">
            <Users size={22} className="text-chile" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal dark:text-stone-100">
              Gestión de Usuarios
            </h1>
            <p className="text-sm text-charcoal/50 dark:text-white/40 mt-0.5">
              {users.length} usuarios registrados en el sistema
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalData({})}
          className="flex items-center justify-center gap-2 bg-chile text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-chile/90 active:scale-95 transition-all shadow-lg shadow-chile/20 cursor-pointer shrink-0"
        >
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ROLE_STATS.map(({ role, label, icon: Icon, color, bg }) => {
          const count = users.filter((u) => u.role === role).length;
          const active = users.filter(
            (u) => u.role === role && u.is_active,
          ).length;
          return (
            <div
              key={role}
              className="rounded-xl border border-cream dark:border-white/6 bg-softwhite dark:bg-[#1a1816] p-4 flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
              >
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-xl font-bold text-charcoal dark:text-stone-100 leading-none">
                  {count}
                </p>
                <p className="text-[11px] text-charcoal/40 dark:text-white/30 mt-0.5">
                  {label}
                </p>
                {count > 0 && (
                  <p className="text-[10px] text-hoja font-semibold">
                    {active} activos
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters: Tabs + Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-cream/50 dark:bg-white/5 border border-cream dark:border-white/8 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === id
                  ? "bg-white dark:bg-white/10 text-charcoal dark:text-stone-100 shadow-sm"
                  : "text-charcoal/50 dark:text-white/35 hover:text-charcoal dark:hover:text-white"
              }`}
            >
              <Icon size={13} />
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                  activeTab === id
                    ? "bg-chile/10 text-chile"
                    : "bg-charcoal/8 dark:bg-white/8 text-charcoal/40 dark:text-white/30"
                }`}
              >
                {id === "all"
                  ? users.length
                  : users.filter((u) =>
                      TABS.find((t) => t.id === id)?.roles?.includes(u.role),
                    ).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o rol..."
            className="w-full pl-10 pr-9 py-2 text-sm
              bg-softwhite dark:bg-[#1e1c1a]
              border border-cream dark:border-white/8
              text-charcoal dark:text-stone-200
              placeholder:text-charcoal/30 dark:placeholder:text-white/20
              rounded-xl focus:outline-none focus:ring-2 focus:ring-chile/30
              transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 dark:text-white/25 hover:text-chile transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <UsersTable
        users={filtered}
        isFetching={isFetching}
        onEdit={(u) => setModalData(u)}
      />

      {/* ── Modal ── */}
      <ModalUserForm
        isOpen={modalData !== null}
        onClose={() => setModalData(null)}
        initialData={
          modalData && Object.keys(modalData).length > 0 ? modalData : null
        }
      />
    </div>
  );
}
