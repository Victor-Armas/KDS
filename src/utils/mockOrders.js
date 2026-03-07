// mockOrders.js
export const MOCK_ORDERS = Array.from({ length: 40 }).map((_, i) => {
  const types = ["dine_in", "pickup", "delivery"];
  const statuses = [
    "pending_confirmation",
    "preparing",
    "ready",
    "on_the_way",
    "completed",
    "cancelled",
  ];
  const type = types[i % 3];

  return {
    id: `ORD-${1000 + i}`,
    type: type,
    target:
      type === "dine_in"
        ? `Mesa ${i + 1}`
        : `Cliente ${String.fromCharCode(65 + (i % 26))}.`,
    status: i < 20 ? statuses[i % 4] : statuses[4 + (i % 2)], // Reparte entre activas e historial
    total: (Math.random() * 850 + 150).toFixed(2),
    waiter: ["Carlos R.", "Ana K.", "Mostrador"][i % 3],
    time: `${Math.floor(Math.random() * 50)} min`,
    items: [
      "3x Tacos Pastor",
      "1x Gringa",
      "2x Agua Jamaica",
      "5x Tacos Suadero",
      "1x Guacamole",
    ].slice(0, (i % 4) + 2),
  };
});
