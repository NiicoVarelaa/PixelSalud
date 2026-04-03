import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, Zap } from "lucide-react";

const ProductCartActions = memo(
  ({
    isInCart,
    isOutOfStock,
    atStockLimit,
    cantidadEnCarrito,
    esDosPorUno,
    unidadesPagas2x1,
    onAddToCart,
    onBuyNow,
    onDisminuir,
    onAumentar,
    onEliminar,
  }) => (
    <div className="flex flex-col gap-3 pt-2">
      <AnimatePresence mode="wait">
        {!isInCart ? (
          <motion.div
            key="add-state"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={onAddToCart}
              disabled={isOutOfStock}
              aria-label={
                isOutOfStock ? "Sin stock disponible" : "Agregar al carrito"
              }
              className="
                flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl
                font-semibold text-sm border-2 border-primary-600 text-primary-700 bg-white
                hover:bg-primary-50 active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                disabled:border-gray-200 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed
                transition-all duration-150 cursor-pointer
              "
            >
              <ShoppingCart size={16} aria-hidden="true" />
              Agregar al carrito
            </button>

            <button
              onClick={onBuyNow}
              disabled={isOutOfStock}
              aria-label={
                isOutOfStock ? "Sin stock disponible" : "Comprar ahora"
              }
              className="
                flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl
                font-semibold text-sm text-white
                bg-linear-to-r from-primary-600 to-primary-700
                hover:from-primary-700 hover:to-primary-800
                active:scale-[0.98] shadow-md hover:shadow-lg
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-150 cursor-pointer
              "
            >
              <Zap size={16} aria-hidden="true" />
              Comprar ahora
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="cart-state"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div
                role="group"
                aria-label="Cantidad en el carrito"
                className="flex items-stretch rounded-xl overflow-hidden border-2 border-primary-600 bg-white shadow-sm flex-1 sm:flex-none sm:w-auto min-h-[52px]"
              >
                <button
                  onClick={onDisminuir}
                  aria-label={
                    cantidadEnCarrito === 1
                      ? "Quitar del carrito"
                      : "Disminuir cantidad"
                  }
                  className="
                    flex items-center justify-center w-12 py-3
                    text-gray-600 hover:text-red-600 hover:bg-red-50
                    border-r border-gray-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500
                    transition-colors duration-150 cursor-pointer
                  "
                >
                  <Minus size={15} aria-hidden="true" />
                </button>

                <output
                  aria-label={`${cantidadEnCarrito} en el carrito`}
                  aria-live="polite"
                  className="flex items-center justify-center flex-1 sm:w-14 text-lg font-bold text-primary-700 select-none"
                >
                  {cantidadEnCarrito}
                </output>

                <button
                  onClick={onAumentar}
                  disabled={atStockLimit}
                  aria-label="Aumentar cantidad"
                  aria-disabled={atStockLimit}
                  className="
                    flex items-center justify-center w-12 py-3
                    text-gray-600 hover:text-primary-700 hover:bg-primary-50
                    border-l border-gray-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500
                    disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent
                    transition-colors duration-150 cursor-pointer
                  "
                >
                  <Plus size={15} aria-hidden="true" />
                </button>

                <button
                  onClick={onEliminar}
                  aria-label="Eliminar del carrito"
                  className="
                    flex items-center justify-center w-12 py-3
                    text-gray-400 hover:text-red-500 hover:bg-red-50
                    border-l border-gray-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500
                    transition-colors duration-150 cursor-pointer
                  "
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>

              <button
                onClick={onBuyNow}
                aria-label="Ir al checkout"
                className="
                  flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl
                  font-semibold text-sm text-white
                  bg-linear-to-r from-primary-600 to-primary-700
                  hover:from-primary-700 hover:to-primary-800
                  active:scale-[0.98] shadow-md hover:shadow-lg
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                  transition-all duration-150 cursor-pointer
                "
              >
                <Zap size={16} aria-hidden="true" />
                Comprar ahora
              </button>
            </div>

            {esDosPorUno && cantidadEnCarrito > 0 && (
              <div
                className="inline-flex w-full items-center justify-center rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700"
                role="note"
                aria-label="Resumen de promocion 2 por 1"
              >
                2x1 aplicado: Llevas {cantidadEnCarrito}, pagas{" "}
                {unidadesPagas2x1}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ),
);

ProductCartActions.displayName = "ProductCartActions";

export default ProductCartActions;
