import { formatPrice } from "../utils/cartModalHelpers";
import { ArrowRight, Trash2 } from "lucide-react";

const CartSummaryFooter = ({
  subtotal,
  onOpenEmptyCartConfirm,
  onCheckout,
  onContinueShopping,
}) => {
  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
      <button
        onClick={onOpenEmptyCartConfirm}
        className="w-full text-sm text-red-500 hover:text-red-700 flex items-center justify-center gap-2 py-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        Vaciar carrito
      </button>

      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold text-gray-900">
            ${formatPrice(subtotal)}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-primary-600">
            ${formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onCheckout}
          className="w-full py-3 bg-linear-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Finalizar Compra
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onContinueShopping}
          className="w-full py-3 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors cursor-pointer"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  );
};

export default CartSummaryFooter;
