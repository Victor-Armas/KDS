import { supabase } from "@/services/supabase";

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");
  if (error) throw error;
  return data ?? [];
};

// ─── PRODUCTS — cargamos TODO de una vez, el filtro es en memoria ─────────────

export const fetchAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, category_id")
    .eq("is_available", true)
    .order("name");
  if (error) throw error;
  return data ?? [];
};

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export const createOrderWithItems = async ({ orderData, items }) => {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_type: orderData.order_type,
      status: "pending_confirmation",
      total,
      guest_name: orderData.guest_name,
      guest_phone: orderData.guest_phone || null,
      guest_email: orderData.guest_email || null,
      address: orderData.order_type === "delivery" ? orderData.address : null,
      table_number: null,
      notes: orderData.notes || null,
      user_id: orderData.user_id || null,
      created_by: orderData.user_id || null,
      waiter_name: "Pedido Online",
    })
    .select(
      "id, order_number, created_at, total, order_type, status, guest_name",
    )
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: Number(item.price),
    product_name: item.name,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

export const fetchOrderById = async (orderId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, order_number, status, order_type, total,
       guest_name, guest_phone, address, notes, created_at,
       order_items(id, product_name, quantity, unit_price)`,
    )
    .eq("id", orderId)
    .single();
  if (error) throw error;
  return data;
};

// Búsqueda por número de orden para clientes sin login (ej. ORD-000061)
// Solo devuelve si NO está completado ni cancelado
export const fetchOrderByNumber = async (orderNumber) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, order_type, total, guest_name, created_at",
    )
    .eq("order_number", orderNumber.trim().toUpperCase())
    .single();

  if (error) throw error;
  return data;
};

export const fetchOrdersByUser = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, order_number, status, order_type, total, created_at,
       order_items(id, product_name, quantity, unit_price)`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
};

// ─── RESTAURANT SETTINGS ─────────────────────────────────────────────────────

export const fetchRestaurantSettings = async () => {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("is_open")
    .single();
  if (error) throw error;
  return data;
};
