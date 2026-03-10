import React from "react";
import POSHeader from "../components/POSHeader";
import ProductGrid from "../components/ProductGrid";
import TicketSidebar from "../components/TicketSidebar";
import CategoryFilter from "../components/CategoryFilter";
import { usePOS } from "../hooks/usePOS";

export default function POSPage() {
  const {
    // Datos y Carga
    categories,
    products,
    isLoading,
    isSubmitting,
    // Estados del Carrito y UI
    cart,
    cartTotal,
    orderType,
    isCartOpen,
    searchQuery,
    activeCategoryId,
    tableNumber,
    guestName,
    // Funciones (Actions)
    setSearchQuery,
    setActiveCategoryId,
    setOrderType,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    confirmOrder,
    setTableNumber,
    setGuestName,
  } = usePOS();

  // Pantalla de carga profesional
  if (isLoading) {
    return (
      <div className="h-screen bg-[#080707] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">
          Cargando menú...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row overflow-hidden bg-[#080707] text-[#f8f9fa] font-sans select-none">
      {/* SECCIÓN IZQUIERDA: Catálogo y Buscador */}
      <section className="flex-1 flex flex-col min-w-0 h-full border-r border-white/5">
        <POSHeader
          cartCount={cart.length}
          onOpenCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Pasamos las categorías dinámicas de la DB */}
        <CategoryFilter
          categories={categories}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
        />

        <ProductGrid products={products} onAddToCart={addToCart} />
      </section>

      {/* SECCIÓN DERECHA: El Ticket de venta */}
      <TicketSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        cartTotal={cartTotal}
        orderType={orderType}
        setOrderType={setOrderType}
        removeFromCart={removeFromCart}
        confirmOrder={confirmOrder}
        isSubmitting={isSubmitting}
        setTableNumber={setTableNumber}
        tableNumber={tableNumber}
        setGuestName={setGuestName}
        guestName={guestName}
      />
    </div>
  );
}
