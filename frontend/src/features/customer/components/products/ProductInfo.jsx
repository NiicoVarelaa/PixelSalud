import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCarritoStore } from "@store/useCarritoStore";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Zap,
  Shield,
  Truck,
  RotateCcw,
  Award,
} from "lucide-react";

const cleanAndParsePrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;
  let cleaned = price.replace(/[^0-9,.]/g, "");
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    number,
  );

const TrustBadge = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-1.5 text-center">
    <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
      {Icon && (
        <Icon size={16} className="text-primary-700" aria-hidden="true" />
      )}
    </div>
    <span className="text-[11px] leading-tight text-gray-500 font-medium">
      {label}
    </span>
  </div>
);

const ProductInfo = ({ product, precioOriginal }) => {
  const {
    carrito,
    agregarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCarritoStore();

  const navigate = useNavigate();

  const itemEnCarrito = carrito.find(
    (item) => item.idProducto === product.idProducto,
  );
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;
  const isInCart = cantidadEnCarrito > 0;
  const esDosPorUno =
    Boolean(product.promo2x1Activa) ||
    String(product.tipoPromocion || "").toUpperCase() === "2X1";

  const currentPrice = cleanAndParsePrice(product.precio);
  const originalPrice = precioOriginal ? cleanAndParsePrice(precioOriginal) : 0;
  const discountPct =
    originalPrice > 0 && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;
  const savings = originalPrice - currentPrice;
  const unidadesPagas2x1 = Math.ceil(cantidadEnCarrito / 2);

  const isOutOfStock = product.stock === 0;
  const atStockLimit = cantidadEnCarrito >= product.stock;

  const handleAddToCart = async () => {
    await agregarCarrito(product);
  };
  const handleBuyNow = async () => {
    if (cantidadEnCarrito === 0) await agregarCarrito(product);
    navigate("/checkout");
  };
  const handleDisminuir = async () => {
    if (cantidadEnCarrito === 1) await eliminarDelCarrito(product.idProducto);
    else await disminuirCantidad(product.idProducto);
  };
  const handleAumentar = async () => {
    if (!atStockLimit) await aumentarCantidad(product.idProducto);
  };
  const handleEliminar = async () => {
    await eliminarDelCarrito(product.idProducto);
  };

  return (
    <article
      aria-label={`Información de ${product.nombreProducto}`}
      className="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 h-full"
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-3">
        {product.categoria && (
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-600">
            {product.categoria}
          </p>
        )}

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
          {product.nombreProducto}
        </h1>
      </div>

      {/* ── PRICING ── */}
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
              Ahorrás {formatCurrency(savings)}
            </span>
          </div>
        )}

        {/* NUEVO BADGE 2X1 LINDO Y COMPACTO */}
        {esDosPorUno && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 inline-flex w-fit items-center gap-1.5 bg-linear-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
            role="note"
            aria-label="Promoción 2 por 1 activa"
          >
            PROMO 2X1: Llevá 2, pagá 1
          </motion.div>
        )}
      </div>

      {/* ── DESCRIPTION ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-1.5">
          Descripción
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">
          {product.descripcion}
        </p>
      </div>

      {/* ── TRUST BADGES ── */}
      <div
        className="grid grid-cols-4 gap-2 py-3 border-y border-gray-100 mt-auto"
        aria-label="Beneficios de compra"
      >
        <TrustBadge icon={Shield} label="Pago seguro" />
        <TrustBadge icon={Truck} label="Envío en el día" />
        <TrustBadge icon={RotateCcw} label="Devolución gratis" />
        <TrustBadge icon={Award} label="Calidad garantizada" />
      </div>

      {/* ── CTA AREA ── */}
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
                onClick={handleAddToCart}
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
                onClick={handleBuyNow}
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
              {/* Qty + remove + buy row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Qty control */}
                <div
                  role="group"
                  aria-label="Cantidad en el carrito"
                  className="flex items-stretch rounded-xl overflow-hidden border-2 border-primary-600 bg-white shadow-sm flex-1 sm:flex-none sm:w-auto min-h-[52px]"
                >
                  <button
                    onClick={handleDisminuir}
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
                    onClick={handleAumentar}
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
                    onClick={handleEliminar}
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

                {/* Buy now */}
                <button
                  onClick={handleBuyNow}
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

              {/* 2x1 summary en el carrito */}
              {esDosPorUno && cantidadEnCarrito > 0 && (
                <div
                  className="inline-flex w-full items-center justify-center rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700"
                  role="note"
                  aria-label="Resumen de promoción 2 por 1"
                >
                  2x1 aplicado: Llevás {cantidadEnCarrito}, pagás{" "}
                  {unidadesPagas2x1}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
};

export default ProductInfo;
