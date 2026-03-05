import { Menu } from "lucide-react";

export const AdminHeader = ({ profile, onMenuClick }) => (
  <header className="h-16 bg-softwhite border-b border-cream flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-md shadow-charcoal/5 relative z-20">
    <button
      className="p-2 lg:hidden text-charcoal hover:bg-cream/50 rounded-lg transition-colors"
      onClick={onMenuClick}
    >
      <Menu size={24} />
    </button>

    <div className="flex items-center gap-3 ml-auto">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-charcoal leading-tight">
          {profile?.full_name}
        </p>
        <p className="text-[10px] text-charcoal/50 uppercase tracking-wider font-bold">
          {profile?.role}
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-mostaza/10 border-2 border-mostaza/20 flex items-center justify-center text-mostaza font-bold shadow-sm">
        {profile?.full_name?.charAt(0).toUpperCase() || "U"}
      </div>
    </div>
  </header>
);
