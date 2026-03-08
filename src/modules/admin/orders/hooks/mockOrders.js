const PRODUCTS = [
  { name: "Taco de Asada", price: 2.8 },
  { name: "Taco de Birria", price: 3.5 },
  { name: "Coca Cola 600ml", price: 2.2 },
  { name: "Agua de Jamaica", price: 1.8 },
  { name: "Carlota de Limón", price: 3.2 },
  { name: "Agua Mineral", price: 1.7 },
];

const generateMockOrders = (count) => {
  const types = ["dine_in", "pickup", "delivery"];
  const statuses = ["pending_confirmation", "preparing", "ready", "on_the_way"];
  const names = [
    "Ashley Odalys",
    "Juan Perez",
    "Maria Garcia",
    "Carlos Ruiz",
    "Elena Torres",
    "Luis Sosa",
    "Roberto Gomez",
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const orderNumber = (i + 40).toString().padStart(6, "0");

    // Regla: Solo dine_in tiene mesero real y mesa
    const isDineIn = type === "dine_in";
    const waiter = isDineIn ? "Victor Armas" : "Pedido Online";
    const target = isDineIn
      ? `Mesa ${Math.floor(Math.random() * 20) + 1}`
      : "Pedido Online";
    const guestName = names[Math.floor(Math.random() * names.length)];

    // Generar items aleatorios
    const itemsCount = Math.floor(Math.random() * 4) + 1;
    const orderItems = Array.from({ length: itemsCount }, (__, j) => {
      const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      return {
        id: `item-${i}-${j}`,
        product_name: prod.name,
        quantity: Math.floor(Math.random() * 5) + 1,
        unit_price: prod.price,
      };
    });

    const total = orderItems.reduce(
      (acc, item) => acc + item.quantity * item.unit_price,
      0,
    );

    return {
      id: `mock-uuid-${i}`,
      order_type: type,
      status: status,
      total: total.toFixed(2),
      order_number: `ORD-${orderNumber}`,
      target: target,
      guest_name: guestName,
      waiter_name: waiter,
      // Genera tiempos entre 0 y 60 minutos atrás
      time: new Date(
        Date.now() - Math.floor(Math.random() * 60) * 60000,
      ).toISOString(),
      order_items: orderItems,
      table_number: isDineIn ? Math.floor(Math.random() * 20) + 1 : null,
    };
  });
};

// Exportamos 100 registros por defecto, pero puedes cambiar el número aquí
export const MOCK_ORDERS_DATA = {
  orders: generateMockOrders(100),
};
