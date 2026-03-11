import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

let globalChannel = null;
let isSubscribed = false;

function getChannel() {
  if (!globalChannel) {
    globalChannel = supabase.channel("app-global");
    isSubscribed = false;
  }
  return globalChannel;
}

function subscribeIfNeeded() {
  if (isSubscribed) return;
  isSubscribed = true;
  setTimeout(() => {
    globalChannel?.subscribe((status) => {
      console.log("📡 Canal global:", status);
      if (status === "CHANNEL_ERROR" || status === "CLOSED") {
        globalChannel = null;
        isSubscribed = false;
      }
    });
  }, 500);
}

export const useRealtimeSync = (table, queryKeys, event = "*") => {
  const queryClient = useQueryClient();
  const queryKeysRef = useRef(queryKeys);

  useEffect(() => {
    const channel = getChannel();

    channel.on(
      "postgres_changes",
      { event, schema: "public", table },
      (payload) => {
        console.log("🔥 Evento recibido:", table, payload);
        const keysToInvalidate = Array.isArray(queryKeysRef.current[0])
          ? queryKeysRef.current
          : [queryKeysRef.current];
        keysToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key, exact: false });
        });
      },
    );

    subscribeIfNeeded();

    return () => {};
  }, [table, event, queryClient]);
};
