import { useCart } from "../../cart/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <div className="bg-softwhite rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img
        src={product.image_url}
        alt={product.name}
        className="sm:h-44 md:h-48 w-full object-cover"
      />

      <div className="p-6">
        <h2 className="text-xl font-serif font-semibold">{product.name}</h2>

        <p className="text-sm text-gray-500 mt-2">{product.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <span className="text-lg font-semibold text-mostaza">
            ${Number(product.price).toFixed(2)}
          </span>

          <button
            onClick={() => addItem(product)}
            className="w-full sm:w-auto bg-chile text-white px-4 py-2 rounded-xl hover:bg-hoja transition"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
