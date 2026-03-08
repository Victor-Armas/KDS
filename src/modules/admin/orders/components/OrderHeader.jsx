import { Search, Plus } from "lucide-react";

export default function OrderHeader({ searchQuery, setSearchQuery }) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-3xl lg:rounded-4xl shadow-sm border border-cream gap-4">
      <div className="flex items-center gap-4 lg:gap-6 w-full sm:w-auto">
        <h1 className="text-lg lg:text-xl font-serif font-black text-charcoal whitespace-nowrap">
          Centro de Ordenes
        </h1>
        <div className="relative flex-1 sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/20"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar orden..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream/30 border-none rounded-xl text-xs font-bold focus:ring-2 ring-chile/20 outline-none"
          />
        </div>
      </div>
      <button className="w-full sm:w-auto bg-chile text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
        <Plus size={18} /> Nueva Orden
      </button>
    </header>
  );
}
