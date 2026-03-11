import { useEffect, useRef } from "react";
import { supabase } from "@/services/supabase";
import { notify } from "@/components/ui/TacoToast";

/**
 * Reproduce un beep de alerta usando Web Audio API
 */
function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // El navegador puede bloquear audio sin interacción del usuario
  }
}

/**
 * Hook para notificar nuevas órdenes en tiempo real.
 * Úsalo en KitchenPage y en AdminLayout.
 */
export function useOrderNotifications() {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Ignorar el primer render para no notificar órdenes ya existentes
    const channel = supabase
      .channel("new-order-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          if (isFirstRender.current) return;
          const order = payload.new;
          const label =
            order.order_type === "dine_in"
              ? `Mesa ${order.table_number}`
              : order.guest_name || "Cliente";

          playAlertSound();
          notify.success(
            "¡Nueva orden! 🔔",
            `${label} — #${order.order_number || "..."}`,
          );
        },
      )
      .subscribe(() => {
        // Una vez suscrito, marcamos que ya pasó el primer render
        setTimeout(() => {
          isFirstRender.current = false;
        }, 1000);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
