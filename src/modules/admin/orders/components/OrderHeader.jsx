import { Search, Plus } from "lucide-react";
import { useState } from "react";
import OrderFormModal from "./OrderFormModal";

export default function OrderHeader({
  searchQuery,
  setSearchQuery,
  pendingCount,
  pickupReady,
  deliveryOnTheWay,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header
        className="flex flex-col sm:flex-row items-center justify-between
        bg-softwhite dark:bg-[#1e1c1a]
        border border-cream dark:border-white/5
        p-4 rounded-3xl shadow-sm dark:shadow-black/20
        gap-4 transition-colors duration-300"
      >
        <div className="flex items-center gap-4 lg:gap-6 w-full sm:w-auto">
          <h1 className="text-lg lg:text-xl font-serif font-black text-charcoal dark:text-stone-100 whitespace-nowrap">
            Centro de Ordenes
          </h1>

          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/20 dark:text-white/20"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar orden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2
                bg-cream/60 dark:bg-white/5
                border border-cream dark:border-white/5
                rounded-xl text-xs font-bold
                text-charcoal dark:text-stone-100
                placeholder:text-charcoal/30 dark:placeholder:text-white/20
                focus:ring-2 ring-chile/20 outline-none
                transition-colors"
            />
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          {pendingCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-chile/10 dark:bg-chile/20 text-chile text-[11px] font-black uppercase tracking-wider border border-chile/20">
              ⚠ {pendingCount} Urgentes
            </span>
          )}
          {pickupReady > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mostaza/10 dark:bg-mostaza/20 text-mostaza text-[11px] font-black uppercase tracking-wider border border-mostaza/20">
              🛍 {pickupReady} Recoger
            </span>
          )}
          {deliveryOnTheWay > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 text-[11px] font-black uppercase tracking-wider border border-blue-500/20">
              🚚 {deliveryOnTheWay} En camino
            </span>
          )}
        </div>
      </header>

      <OrderFormModal isOpen={isModalOpen} />
    </>
  );
}
