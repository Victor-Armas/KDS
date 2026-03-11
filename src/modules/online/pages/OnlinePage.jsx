import { useState } from "react";
import { useMenu, useCategories, useRestaurantOpen } from "../hooks/useMenu";
import { useCreateOrder } from "../hooks/useOrder";
import { useCart } from "../context/CartContext";
import OnlineHeader from "../components/layout/OnlineHeader";

import CartDrawer from "../components/cart/CartDrawer";
import OrderFormModal from "../components/order/OrderFormModal";
import OrderConfirmation from "../components/order/OrderConfirmation";
import CategoryTabs from "../components/layout/menu/CategoryTabs";
import ProductGrid from "../components/layout/menu/ProductGrid";
import { useSettings } from "@/modules/admin/settings/hooks/useSettings";

export default function OnlinePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [formKey, setFormKey] = useState(0);

  // Fix 1: cargamos todo una vez, filtramos en memoria
  const { products, isLoading, isError } = useMenu(selectedCategory);
  const { data: categories = [], isLoading: loadingCats } = useCategories();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const { items, clearCart } = useCart();

  const { data: settings } = useSettings();
  const restaurantName = settings?.restaurant_name || "Nuestro Restaurante";
  const tagline = settings?.tagline || "...";

  const { data: restaurantStatus } = useRestaurantOpen(); // ya tiene refetchInterval de 60s
  const isOpen = restaurantStatus?.is_open ?? true;

  const handleCheckout = () => {
    setCartOpen(false);
    setFormOpen(true);
  };

  const handleSubmitOrder = async (formData) => {
    try {
      const order = await createOrder({ orderData: formData, items });
      clearCart();
      setFormOpen(false);
      setFormKey((k) => k + 1);
      setConfirmedOrder(order);
    } catch (err) {
      console.error("Error al crear orden:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-[#120f0a] font-sans text-charcoal dark:text-stone-100 transition-colors duration-300">
      <OnlineHeader onOpenCart={() => setCartOpen(true)} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a0f06] dark:bg-[#0d0804]">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c1440e' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            {isOpen ? (
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">
                  Abierto — recibiendo pedidos
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                <span className="text-red-400 text-xs font-black uppercase tracking-[0.3em]">
                  Cerrado por el momento
                </span>
              </div>
            )}
            {/* ← y estas dos */}
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-4">
              {restaurantName}
            </h1>
            <p className="text-stone-400 text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed mb-8">
              {tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="#menu"
                className="px-8 py-4 bg-chile text-white font-bold rounded-2xl hover:bg-chile/90 active:scale-95 transition-all shadow-xl shadow-chile/30 text-center"
              >
                Ver el menú
              </a>
              <a
                href="#instrucciones"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 active:scale-95 transition-all text-center border border-white/10"
              >
                ¿Cómo funciona?
              </a>
            </div>
          </div>

          {/* Decorative food image */}
          <div className="shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-chile/30 shadow-2xl shadow-chile/20">
            <img
              src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=640&q=80"
              alt="Tacos mexicanos"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40L60 34C120 28 240 16 360 13.3C480 10.7 600 17.3 720 20C840 22.7 960 21.3 1080 18.7C1200 16 1320 12 1380 10L1440 8V40H1380C1320 40 1200 40 1080 40C960 40 840 40 720 40C600 40 480 40 360 40C240 40 120 40 60 40H0Z"
              className="fill-[#faf7f2] dark:fill-[#120f0a]"
            />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section
        id="instrucciones"
        className="max-w-6xl mx-auto px-4 md:px-8 py-14"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              emoji: "🛒",
              title: "Elige tu pedido",
              desc: "Explora el menú y agrega lo que se te antoje al carrito",
            },
            {
              emoji: "📍",
              title: "Elige dónde",
              desc: "Recógelo en el local o te lo llevamos a tu dirección.",
            },
            {
              emoji: "🔔",
              title: "Dale seguimiento",
              desc: "Con tu número de orden puedes ver el progreso de tu pedido en tiempo real.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-cream dark:border-stone-800 shadow-sm"
            >
              <span className="text-4xl">{step.emoji}</span>
              <h3 className="font-serif font-bold text-charcoal dark:text-stone-100">
                {step.title}
              </h3>
              <p className="text-sm text-charcoal/50 dark:text-stone-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MENU ─────────────────────────────────────────────────────── */}
      <section id="menu" className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        {/* Section header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-chile text-xs font-black uppercase tracking-[0.2em] mb-1">
              Nuestro menú
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal dark:text-stone-100">
              ¿Qué se te antoja hoy?
            </h2>
          </div>
          {/* Category tabs */}
          {!loadingCats && categories.length > 0 && (
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
        </div>

        {/* Products — filtramos en memoria, sin re-fetch */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          isError={isError}
        />
      </section>

      {/* ── CART DRAWER ──────────────────────────────────────────────── */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* ── ORDER FORM ───────────────────────────────────────────────── */}
      <OrderFormModal
        key={formKey}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitOrder}
        isSubmitting={isPending}
      />

      {/* ── POST-ORDER CONFIRMATION ──────────────────────────────────── */}
      {confirmedOrder && (
        <OrderConfirmation
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
}
