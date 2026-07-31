import { ShoppingCart } from "lucide-react";

const CartEmptyState = ({ onExploreProducts }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-32 h-32 mb-6 text-gray-300">
        <ShoppingCart className="w-full h-full" />
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Tu carrito está vacío
      </h3>

      <p className="text-gray-500 mb-6">
        Agrega productos para comenzar tu compra
      </p>

      <button
        onClick={onExploreProducts}
        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
      >
        Ver productos
      </button>
    </div>
  );
};

export default CartEmptyState;
