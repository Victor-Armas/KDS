import CartButton from "@/modules/kiosk/features/cart/components/CartButton";

export default function HeaderKiosk({ openCart }) {
  return (
    <header className="sticky top-0 z-50  bg-softwhite/90 backdrop-blur-md  flex items-center justify-between px-6 md:px-10 py-4 md:py-6 shadow-sm">
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-chile">
        Sabores de México
      </h1>

      <div className="flex items-center gap-6">
        <CartButton onClick={openCart} />
      </div>
    </header>
  );
}
