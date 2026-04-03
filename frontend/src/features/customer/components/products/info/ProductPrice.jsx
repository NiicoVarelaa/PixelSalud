import { memo } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils";

const ProductPrice = memo(
  ({ currentPrice, discountPct, originalPrice, savings, esDosPorUno }) => (
    <div
      className="rounded-2xl py-4 flex flex-col gap-2"
      aria-label="Precio del producto"
    >
      <div className="flex flex-wrap items-baseline gap-3">
        <p className="text-3xl sm:text-4xl font-extrabold text-primary-700 tabular-nums">
          {formatCurrency(currentPrice)}
        </p>

        {discountPct > 0 && (
          <p
            className="text-base text-gray-400 line-through tabular-nums"
            aria-label={`Precio original: ${formatCurrency(originalPrice)}`}
          >
            {formatCurrency(originalPrice)}
          </p>
        )}
      </div>

      {discountPct > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <span
              className="w-1.5 h-1.5 bg-white rounded-full"
              aria-hidden="true"
            />
            {discountPct}% OFF
          </span>

          <span className="text-emerald-600 font-semibold text-sm">
            Ahorras {formatCurrency(savings)}
          </span>
        </div>
      )}

      {esDosPorUno && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 inline-flex w-fit items-center gap-1.5 bg-linear-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
          role="note"
          aria-label="Promocion 2 por 1 activa"
        >
          PROMO 2X1: Lleva 2, paga 1
        </motion.div>
      )}
    </div>
  ),
);

ProductPrice.displayName = "ProductPrice";

export default ProductPrice;
