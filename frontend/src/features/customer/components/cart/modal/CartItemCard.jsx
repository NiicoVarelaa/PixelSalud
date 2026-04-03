import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Default from "@assets/default.webp";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";
import {
  formatPrice,
  getProductSubtotal,
  getProductUnitPrice,
  hasRealDiscount,
} from "../utils/cartModalHelpers";

const CartItemCard = ({
  product,
  imageUrl,
  onDecrease,
  onIncrease,
  onDelete,
  onProductClick,
}) => {
  const esDosPorUno =
    Boolean(product.promo2x1Activa) ||
    String(product.tipoPromocion || "").toUpperCase() === "2X1";
  const unitPrice = getProductUnitPrice(product);
  const subtotal = getProductSubtotal(product);
  const showDiscountBadge = hasRealDiscount(product);

  return (
    <motion.div
      key={product.idProducto}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={imageUrl || product.img || Default}
            alt={product.nombreProducto}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(event) => {
              event.target.src = Default;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <Link
            to={`/productos/${product.idProducto}`}
            onClick={onProductClick}
            className="inline-block font-medium text-gray-900 text-sm line-clamp-2 mb-1 cursor-pointer hover:text-primary-700 transition-colors"
          >
            {product.nombreProducto}
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-primary-600">
              ${formatPrice(unitPrice)}
            </span>

            {showDiscountBadge && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {esDosPorUno ? "2x1" : `-${product.porcentajeDescuento}%`}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                  product.cantidad > 1
                    ? "border-red-300 hover:bg-red-50 text-red-600 cursor-pointer"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                } transition-colors`}
                onClick={onDecrease}
                disabled={product.cantidad <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="min-w-8 text-center font-medium text-sm">
                {product.cantidad}
              </span>

              <button
                className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                  product.stock > product.cantidad
                    ? "border-green-300 hover:bg-green-50 text-green-600 cursor-pointer"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                } transition-colors`}
                onClick={onIncrease}
                disabled={product.stock <= product.cantidad}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={onDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              aria-label="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-red-500 mt-2">
              ¡Solo quedan {product.stock} en stock!
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-600">Subtotal:</span>
        <span className="font-semibold text-gray-900">
          ${formatPrice(subtotal)}
        </span>
      </div>
    </motion.div>
  );
};

export default CartItemCard;
