import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

// ─── Estado global ────────────────────────────────────────────────────────────

const listenerRegistry = new Map(); // "tabla::evento" → Set<callback>
const allQueryKeys = new Set(); // todas las keys — para recovery refetch

let activeChannel = null;
let buildTimer = null;
let retryTimer = null;
let retryDelay = 3000;
let wasEverConnected = false;

// ─── Build ────────────────────────────────────────────────────────────────────

function createChannel(queryClient) {
  if (listenerRegistry.size === 0) return;

  if (activeChannel) {
    activeChannel.__ignored = true;
    activeChannel = null;
  }

  const channel = supabase.channel(`app-global-${Date.now()}`, {
    config: { broadcast: { self: false } },
  });

  listenerRegistry.forEach((callbacks, key) => {
    const [table, event] = key.split("::");
    channel.on(
      "postgres_changes",
      { event, schema: "public", table },
      (payload) => {
        if (channel.__ignored) return;
        callbacks.forEach((cb) => cb(payload));
      },
    );
  });

  activeChannel = channel;

  channel.subscribe((status) => {
    if (channel.__ignored) return;

    if (status === "SUBSCRIBED") {
      retryDelay = 3000;
      if (wasEverConnected && queryClient) {
        allQueryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key, exact: false });
        });
      }
      wasEverConnected = true;
      return;
    }

    if (
      status === "CHANNEL_ERROR" ||
      status === "TIMED_OUT" ||
      status === "CLOSED"
    ) {
      if (listenerRegistry.size === 0) return;
      if (retryTimer) return;
      retryTimer = setTimeout(() => {
        retryTimer = null;
        retryDelay = Math.min(retryDelay * 1.5, 30_000);
        createChannel(queryClient);
      }, retryDelay);
    }
  });
}

function scheduleBuild(queryClient) {
  if (buildTimer) return;
  buildTimer = setTimeout(() => {
    buildTimer = null;
    createChannel(queryClient);
  }, 80);
}

// ─── Registro / desregistro ───────────────────────────────────────────────────

function registerListener(table, event, callback, queryKeys, queryClient) {
  const key = `${table}::${event}`;
  if (!listenerRegistry.has(key)) listenerRegistry.set(key, new Set());
  listenerRegistry.get(key).add(callback);

  const keys = Array.isArray(queryKeys[0]) ? queryKeys : [queryKeys];
  keys.forEach((k) => allQueryKeys.add(k));

  if (!activeChannel && !retryTimer) {
    scheduleBuild(queryClient);
  }
}

function unregisterListener(table, event, callback) {
  const key = `${table}::${event}`;
  const set = listenerRegistry.get(key);
  if (set) {
    set.delete(callback);
    if (set.size === 0) listenerRegistry.delete(key);
  }

  if (listenerRegistry.size === 0) {
    if (buildTimer) {
      clearTimeout(buildTimer);
      buildTimer = null;
    }
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    retryDelay = 3000;
    wasEverConnected = false;
    allQueryKeys.clear();
    if (activeChannel) {
      activeChannel.__ignored = true;
      activeChannel = null;
    }
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useRealtimeSync = (table, queryKeys, event = "*") => {
  const queryClient = useQueryClient();
  const queryKeysRef = useRef(queryKeys);

  useEffect(() => {
    queryKeysRef.current = queryKeys;
  });

  useEffect(() => {
    let active = true;

    const callback = (payload) => {
      if (!active) return;
      const keys = Array.isArray(queryKeysRef.current[0])
        ? queryKeysRef.current
        : [queryKeysRef.current];
      keys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key, exact: false }),
      );
    };

    const t = setTimeout(() => {
      if (active)
        registerListener(table, event, callback, queryKeys, queryClient);
    }, 80);

    return () => {
      active = false;
      clearTimeout(t);
      unregisterListener(table, event, callback);
    };
  }, [table, event, queryClient]);
};
