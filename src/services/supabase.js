import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    // Mueve el heartbeat a un Web Worker — hilo separado, no afectado
    // por el throttling del navegador cuando la pestaña está en background.
    // Solución oficial de Supabase para CHANNEL_ERROR por heartbeat.
    worker: true,
    heartbeatIntervalMs: 20_000,
    params: {
      eventsPerSecond: 10,
    },
  },
});
