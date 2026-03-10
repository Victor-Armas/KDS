import { useState, useMemo } from "react";
import {
  useCategories,
  useCreateOrder,
  usePosService,
} from "../services/usePosService";
import { notify } from "@/components/ui/TacoToast";

export const usePOS = () => {
  // --- ESTADOS ---
  const [activeCategoryId, setActiveCategoryId] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine_in");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [guestName, setGuestName] = useState("");

  const { data: products = [], isLoading: isLoadingProducts } = usePosService();
  const { data: categories = [], isLoading: isLoadingCats } = useCategories();

  const createOrderMutation = useCreateOrder();

  // --- LÓGICA DEL CARRITO ---
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // --- FILTRADO POR BUSQUEDA (Frontend) ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Filtro por categoría (usando el ID que viene de la DB o "Todos")
      const matchesCategory =
        activeCategoryId === "Todos" || p.category_id === activeCategoryId;

      // Filtro por nombre
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryId, searchQuery, products]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const confirmOrder = async (isPaidNow = flase) => {
    if (cart.length === 0) {
      return notify.info(
        "¡Ojo!",
        "Necesitas agregar productos antes de agregar una orden",
      );
    }

    if (orderType === "dine_in" && !tableNumber?.trim()) {
      return notify.error("¡Alto!", "Ingresa un numero de mesa");
    }
    if (orderType === "pickup" && !guestName?.trim()) {
      return notify.error("¡Alto!", "Ingresa el nombre del cliente");
    }

    try {
      await createOrderMutation.mutateAsync({
        total: cartTotal,
        orderType: orderType,
        items: cart,
        guestName: guestName || "Mostrador",
        tableNumber: tableNumber,
        isPaid: isPaidNow,
      });

      //Todo correcto
      setCart([]);
      setIsCartOpen(false);
      setGuestName("");
      setTableNumber("");
      notify.success("¡Excelente!", "Orden cargada correctamente");
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      notify.error("¡Error!", "No se logro enviar la orden");
    }
  };

  return {
    categories, // Ahora vienen de la DB
    activeCategoryId,
    setActiveCategoryId,
    searchQuery,
    setSearchQuery,
    cart,
    orderType,
    setOrderType,
    isCartOpen,
    setIsCartOpen,
    products: filteredProducts,
    isLoading: isLoadingProducts || isLoadingCats,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    confirmOrder,
    isSubmitting: createOrderMutation.isPending,
    setTableNumber,
    tableNumber,
    setGuestName,
    guestName,
  };
};
