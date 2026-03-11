// src/hooks/useOrderNotifications.js
import { useEffect, useRef } from "react";
import { supabase } from "@/services/supabase";
import { showOrderNotification } from "@/components/ui/OrderNotification";

function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.AudioContext)();
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
  } catch {
    // El navegador puede bloquear audio sin interacción del usuario
  }
}

export function useOrderNotifications() {
  const isFirstRender = useRef(true);

  useEffect(() => {
    const channel = supabase
      .channel("order-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          if (isFirstRender.current) return;
          playAlertSound();
          showOrderNotification(payload.new);
        },
      )
      .subscribe(() => {
        setTimeout(() => {
          isFirstRender.current = false;
        }, 1000);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
