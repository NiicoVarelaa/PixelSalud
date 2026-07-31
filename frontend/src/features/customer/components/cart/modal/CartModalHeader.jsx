import { ShoppingCart, X } from "lucide-react";

const CartModalHeader = ({ totalItems, onClose }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-linear-to-r from-primary-600 to-primary-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg backdrop-blur-sm">
          <ShoppingCart className="w-5 h-5 text-primary-700" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Mi Carrito</h2>
          <p className="text-sm text-white/90">
            {totalItems} {totalItems === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
        aria-label="Cerrar carrito"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default CartModalHeader;
