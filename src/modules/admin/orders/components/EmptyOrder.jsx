import { Utensils } from "lucide-react";

export default function EmptyOrder() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center
      text-charcoal/20 dark:text-white/10
      uppercase font-black text-[10px] tracking-widest
      p-10 text-center h-full"
    >
      <Utensils size={40} className="mb-4 opacity-20" />
      Selecciona una orden para ver el ticket
    </div>
  );
}
