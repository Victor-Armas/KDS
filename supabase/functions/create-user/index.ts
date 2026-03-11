// supabase/functions/create-user/index.ts
// Deploy: supabase functions deploy create-user

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Admin client con service_role (puede crear usuarios)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // Verificar que quien llama es admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No autorizado");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user: caller },
      error: callerError,
    } = await supabaseClient.auth.getUser();
    if (callerError || !caller) throw new Error("No autorizado");

    const { data: callerProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (callerProfile?.role !== "admin")
      throw new Error("Solo los administradores pueden crear usuarios");

    // Payload
    const { email, password, full_name, role } = await req.json();

    if (!email || !password || !full_name || !role) {
      throw new Error(
        "Faltan campos requeridos: email, password, full_name, role",
      );
    }

    const validRoles = ["admin", "waiter", "kitchen", "client"];
    if (!validRoles.includes(role)) throw new Error("Rol inválido");

    // 1. Crear usuario en auth
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // sin verificación de email
      });

    if (createError) throw createError;

    // 2. Upsert en profiles (el trigger debería crearlo, pero por si acaso)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        full_name,
        role,
        is_active: true,
      });

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({
        success: true,
        user: { id: newUser.user.id, email, full_name, role },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
