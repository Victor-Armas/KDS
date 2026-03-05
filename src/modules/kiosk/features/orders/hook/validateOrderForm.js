/**
 * Recibe el objeto `form` tal como lo construye OrderFormModal y
 * devuelve `null` si está todo correcto o un string con el mensaje de
 * error en el primer campo que falle.
 */
export function validateOrderForm({
  order_type,
  guest_name,
  guest_phone,
  address,
  table_number,
}) {
  if (!guest_name.trim()) {
    return "El nombre del cliente es obligatorio";
  }

  if (order_type === "dine_in" && !table_number.trim()) {
    return "Debes ingresar el número de mesa";
  }

  if (order_type === "delivery" && !address.trim()) {
    return "Debes ingresar la dirección";
  }

  if (order_type !== "dine_in" && !guest_phone.trim()) {
    // delivery o pickup
    return "Debes ingresar el teléfono";
  }

  return null;
}
