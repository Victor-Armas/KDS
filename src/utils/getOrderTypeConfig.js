import { Utensils, ShoppingBag, Truck } from "lucide-react";

export const getOrderTypeConfig = (orderType) => {
  const config = {
    dine_in: {
      icon: Utensils,
      text: "Local",
      bgColor: "bg-blue-100",
      textColor: "text-blue-500",
    },
    delivery: {
      icon: Truck,
      text: "Delivery",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
    },
    pickup: {
      icon: ShoppingBag,
      text: "Para llevar",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
    },
  };

  return (
    config[orderType] ?? {
      icon: null,
      text: "Desconocido",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
    }
  );
};
