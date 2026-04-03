import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCarritoStore } from "@store/useCarritoStore";
import { useShallow } from "zustand/react/shallow";
import { ProductCartActions, ProductPrice, ProductTrustBadges } from "./info";
import { getProductPricing } from "./utils";

const ProductInfo = ({ product, precioOriginal }) => {
  const {
    carrito,
    agregarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCarritoStore(
    useShallow((state) => ({
      carrito: state.carrito,
      agregarCarrito: state.agregarCarrito,
      aumentarCantidad: state.aumentarCantidad,
      disminuirCantidad: state.disminuirCantidad,
      eliminarDelCarrito: state.eliminarDelCarrito,
    })),
  );

  const navigate = useNavigate();

  const productId = product?.idProducto;
  const stock = Number(product?.stock ?? 0);

  const itemEnCarrito = useMemo(
    () => carrito.find((item) => item.idProducto === productId),
    [carrito, productId],
  );
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;
  const isInCart = cantidadEnCarrito > 0;

  const { esDosPorUno, currentPrice, originalPrice, discountPct, savings } =
    useMemo(
      () =>
        getProductPricing({
          precio: product?.precio,
          precioOriginal,
          promo2x1Activa: product?.promo2x1Activa,
          tipoPromocion: product?.tipoPromocion,
        }),
      [
        precioOriginal,
        product?.precio,
        product?.promo2x1Activa,
        product?.tipoPromocion,
      ],
    );

  const unidadesPagas2x1 = Math.ceil(cantidadEnCarrito / 2);

  const isOutOfStock = stock <= 0;
  const atStockLimit = stock > 0 && cantidadEnCarrito >= stock;

  const handleAddToCart = useCallback(async () => {
    await agregarCarrito(product);
  }, [agregarCarrito, product]);

  const handleBuyNow = useCallback(async () => {
    if (cantidadEnCarrito === 0) await agregarCarrito(product);
    navigate("/checkout");
  }, [agregarCarrito, cantidadEnCarrito, navigate, product]);

  const handleDisminuir = useCallback(async () => {
    if (cantidadEnCarrito === 1) await eliminarDelCarrito(productId);
    else await disminuirCantidad(productId);
  }, [cantidadEnCarrito, disminuirCantidad, eliminarDelCarrito, productId]);

  const handleAumentar = useCallback(async () => {
    if (!atStockLimit) await aumentarCantidad(productId);
  }, [atStockLimit, aumentarCantidad, productId]);

  const handleEliminar = useCallback(async () => {
    await eliminarDelCarrito(productId);
  }, [eliminarDelCarrito, productId]);

  return (
    <article
      aria-label={`Información de ${product?.nombreProducto || "producto"}`}
      className="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 h-full"
    >
      <div className="flex flex-col gap-3">
        {product?.categoria && (
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-600">
            {product.categoria}
          </p>
        )}

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
          {product?.nombreProducto}
        </h1>
      </div>

      <ProductPrice
        currentPrice={currentPrice}
        discountPct={discountPct}
        originalPrice={originalPrice}
        savings={savings}
        esDosPorUno={esDosPorUno}
      />

      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-1.5">
          Descripción
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">
          {product?.descripcion || "Sin descripción disponible."}
        </p>
      </div>

      <ProductTrustBadges />

      <ProductCartActions
        isInCart={isInCart}
        isOutOfStock={isOutOfStock}
        atStockLimit={atStockLimit}
        cantidadEnCarrito={cantidadEnCarrito}
        esDosPorUno={esDosPorUno}
        unidadesPagas2x1={unidadesPagas2x1}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onDisminuir={handleDisminuir}
        onAumentar={handleAumentar}
        onEliminar={handleEliminar}
      />
    </article>
  );
};

export default ProductInfo;
