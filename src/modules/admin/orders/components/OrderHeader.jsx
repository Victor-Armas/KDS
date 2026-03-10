import { Search, ShoppingBag, Truck, AlertCircle } from "lucide-react";
import {
  useRestaurantSettings,
  useToggleRestaurant,
} from "@/hooks/useRestaurantSettings";

export default function OrderHeader({
  searchQuery,
  setSearchQuery,
  pickupReady = 0,
  deliveryOnTheWay = 0,
  pendingCount = 0,
}) {
  const { data: settings, isLoading: loadingSettings } =
    useRestaurantSettings();
  const { mutate: toggleRestaurant, isPending: isToggling } =
    useToggleRestaurant();

  const handleToggle = () => {
    if (!settings || isToggling) return;
    toggleRestaurant({ id: settings.id, is_open: !settings.is_open });
  };

  const isOpen = settings?.is_open ?? true;

  return (
    <header className="flex flex-col lg:flex-row gap-4 bg-white rounded-3xl lg:rounded-4xl shadow-sm border border-cream px-5 py-4 lg:items-center">
      {/* SECCIÓN 1: Título y Toggle (Prioridad en móvil) */}
      <div className="flex items-center justify-between lg:justify-start gap-4">
        <h1 className="text-lg lg:text-xl font-serif font-black text-charcoal whitespace-nowrap">
          Centro de Ordenes
        </h1>

        <button
          onClick={handleToggle}
          disabled={loadingSettings || isToggling}
          className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 cursor-pointer disabled:opacity-50
      ${isOpen ? "bg-charcoal text-white" : "bg-cream text-charcoal/50"}`}
        >
          <span className="relative flex h-2.5 w-2.5">
            {isOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hoja opacity-60" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? "bg-hoja" : "bg-charcoal/30"}`}
            />
          </span>
          {loadingSettings ? "..." : isOpen ? "Abierto" : "Cerrado"}
        </button>
      </div>

      {/* SECCIÓN 2: Buscador (Ocupa el centro) */}
      <div className="relative flex-grow max-w-full lg:max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/20"
          size={16}
        />
        <input
          type="text"
          placeholder="Buscar orden..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-cream/40 border-none rounded-xl text-xs font-bold focus:ring-2 ring-chile/20 outline-none placeholder:text-charcoal/30"
        />
      </div>

      {/* SECCIÓN 3: Contadores (Scroll horizontal en móvil) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
        {/* Urgentes */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shrink-0 transition-all
      ${pendingCount > 0 ? "bg-chile/10 border-chile/20" : "bg-cream/50 border-cream"}`}
        >
          <AlertCircle
            size={14}
            className={pendingCount > 0 ? "text-chile" : "text-charcoal/20"}
          />
          <div className="flex flex-col leading-none">
            <span
              className={`text-base font-serif font-black ${pendingCount > 0 ? "text-chile" : "text-charcoal/20"}`}
            >
              {pendingCount}
            </span>
            <span className="text-[7px] font-black text-charcoal/30 uppercase tracking-tight">
              Urgentes
            </span>
          </div>
        </div>

        {/* Por recoger */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shrink-0 transition-all
      ${pickupReady > 0 ? "bg-mostaza/10 border-mostaza/20" : "bg-cream/50 border-cream"}`}
        >
          <ShoppingBag
            size={14}
            className={pickupReady > 0 ? "text-mostaza" : "text-charcoal/20"}
          />
          <div className="flex flex-col leading-none">
            <span
              className={`text-base font-serif font-black ${pickupReady > 0 ? "text-mostaza" : "text-charcoal/20"}`}
            >
              {pickupReady}
            </span>
            <span className="text-[7px] font-black text-charcoal/30 uppercase tracking-tight">
              Recoger
            </span>
          </div>
        </div>

        {/* En camino */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shrink-0 transition-all
      ${deliveryOnTheWay > 0 ? "bg-blue-500/10 border-blue-500/20" : "bg-cream/50 border-cream"}`}
        >
          <Truck
            size={14}
            className={
              deliveryOnTheWay > 0 ? "text-blue-500" : "text-charcoal/20"
            }
          />
          <div className="flex flex-col leading-none">
            <span
              className={`text-base font-serif font-black ${deliveryOnTheWay > 0 ? "text-blue-500" : "text-charcoal/20"}`}
            >
              {deliveryOnTheWay}
            </span>
            <span className="text-[7px] font-black text-charcoal/30 uppercase tracking-tight">
              Camino
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
