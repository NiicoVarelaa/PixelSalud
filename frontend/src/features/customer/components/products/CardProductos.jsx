import { Link } from "react-router-dom";
import BotonFavorito from "@features/customer/components/favorites/FavoriteToggleButton";
import { Tag } from "lucide-react";
import { useCardProductos } from "./utils";
import {
  ProductCardImage,
  ProductCardPricing,
  ProductCardActions,
} from "./card";

const CardProductos = ({ product, producto }) => {
  const currentProduct = product || producto;

  const {
    imageLoaded,
    setImageLoaded,
    isLoading,
    principalImage,
    hoverImage,
    cantidadEnCarrito,
    isOffert,
    isPromoDosPorUno,
    isCyberMondayProduct,
    regularPrice,
    discountPercentage,
    priceToDisplay,
    precioSinImpuestos,
    stockStatus,
    handleLoadingAgregar,
    handleDisminuir,
    handleAumentar,
    handleEliminar,
  } = useCardProductos({ product: currentProduct });

  if (!currentProduct) return null;

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full h-full flex flex-col group overflow-hidden">
      {isOffert && (
        <div
          className={`absolute top-3 left-3 z-20 px-2.5 py-1 text-white font-bold rounded-lg text-xs shadow-lg flex items-center gap-1 ${
            isPromoDosPorUno
              ? "bg-linear-to-r from-cyan-600 to-blue-600"
              : "bg-linear-to-r from-red-500 to-red-600"
          }`}
        >
          <Tag className="w-3 h-3" />
          {isPromoDosPorUno
            ? "2x1"
            : discountPercentage > 0
              ? `${Math.round(discountPercentage)}% OFF`
              : "OFERTA"}
        </div>
      )}

      <div className="absolute top-0 right-0 z-20">
        <BotonFavorito product={currentProduct} />
      </div>

      {stockStatus && (
        <div
          className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-md text-xs font-medium ${stockStatus.bg} ${stockStatus.color} ${isOffert ? "mt-7" : ""}`}
        >
          {stockStatus.text}
        </div>
      )}

      <Link
        to={`/productos/${currentProduct.idProducto}`}
        className="flex flex-col flex-1"
      >
        <ProductCardImage
          product={currentProduct}
          principalImage={principalImage}
          hoverImage={hoverImage}
          imageLoaded={imageLoaded}
          onImageLoad={() => setImageLoaded(true)}
          isCyberMondayProduct={isCyberMondayProduct}
        />

        <ProductCardPricing
          product={currentProduct}
          isOffert={isOffert}
          isPromoDosPorUno={isPromoDosPorUno}
          regularPrice={regularPrice}
          priceToDisplay={priceToDisplay}
          precioSinImpuestos={precioSinImpuestos}
        />
      </Link>

      <div className="px-4 pb-4">
        <ProductCardActions
          stock={currentProduct.stock}
          cantidadEnCarrito={cantidadEnCarrito}
          isLoading={isLoading}
          onAdd={handleLoadingAgregar}
          onDecrease={handleDisminuir}
          onIncrease={handleAumentar}
          onDelete={handleEliminar}
        />
      </div>

      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-white/0 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
};

export default CardProductos;
