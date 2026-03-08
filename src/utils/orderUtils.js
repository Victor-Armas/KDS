import { Utensils, ShoppingBag, Truck } from "lucide-react";

// Configuración de Tipos de Orden
export const ORDER_TYPE_CONFIG = {
  dine_in: {
    icon: Utensils, // Guardamos la referencia del componente, no el JSX
    label: "Mesa",
    color: "bg-hoja/80",
    textColor: "text-hoja",
  },
  pickup: {
    icon: ShoppingBag,
    label: "Llevar",
    color: "bg-mostaza/80",
    textColor: "text-mostaza",
  },
  delivery: {
    icon: Truck,
    label: "Domicilio",
    color: "bg-blue-500/80",
    textColor: "text-blue-500",
  },
};

// Configuración de Estados
export const ORDER_STATUS_CONFIG = {
  pending_confirmation: {
    label: "Por Confirmar",
    color: "text-mostaza",
    dot: "bg-mostaza",
  },
  preparing: { label: "En Cocina", color: "text-chile", dot: "bg-chile" },
  ready: { label: "¡Listo!", color: "text-hoja", dot: "bg-hoja" },
  on_the_way: {
    label: "En Camino",
    color: "text-blue-500",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Entregado",
    color: "text-charcoal/50",
    dot: "bg-charcoal/20",
  },
  cancelled: { label: "Cancelado", color: "text-red-500", dot: "bg-red-500" },
};

// Función utilitaria para obtener el label (manteniendo compatibilidad con tu código actual)
export const orderUtils = (status) => {
  return ORDER_STATUS_CONFIG[status]?.label || status;
};
