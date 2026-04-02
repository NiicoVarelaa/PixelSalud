import { Link } from "react-router-dom";
import { useCarritoStore } from "@store/useCarritoStore";
import { useAuthStore } from "@store/useAuthStore";
import BotonFavorito from "@features/customer/components/favorites/FavoriteToggleButton";
import { Minus, Plus, Trash2, Loader2, Tag, ShoppingCart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import cyberMonday from "@assets/Logo-cyber-monday.png";
import Default from "@assets/default.webp";
import apiClient from "@utils/apiClient";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" />
  </div>
);

const CardProductos = ({ product }) => {
  const {
    carrito,
    agregarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    setShowLoginModal,
  } = useCarritoStore();

  const { user } = useAuthStore();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [principalImage, setPrincipalImage] = useState(product.img);

  useEffect(() => {
    const fetchPrincipalImage = async () => {
      if (!product?.idProducto) return;
      try {
        const res = await apiClient.get(
          `/productos/${product.idProducto}/imagenes/principal`,
        );
        if (res.data && res.data.urlImagen) {
          setPrincipalImage(res.data.urlImagen);
        } else if (product.img) {
          setPrincipalImage(product.img);
        } else {
          setPrincipalImage(Default);
        }
      } catch (err) {
        setPrincipalImage(product.img || Default);
      }
    };
    fetchPrincipalImage();
  }, [product]);

  // Lógica para encontrar la segunda imagen para el Hover
  const hoverImage = useMemo(() => {
    // Si el backend ya nos trae img2 directo (por el SQL optimizado)
    if (product.img2) return product.img2;
    
    // Fallback: si viene en el array de imagenes
    if (Array.isArray(product.imagenes) && product.imagenes.length > 1) {
      const sec = product.imagenes.find((img) => !img.esPrincipal);
      if (sec?.urlImagen) return sec.urlImagen;
      return product.imagenes[1]?.urlImagen; 
    }
    
    return null;
  }, [product]);

  const itemEnCarrito = carrito.find(
    (item) => item.idProducto === product.idProducto,
  );
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;

  // Lógica de precios y oferta
  const isOffert = !!product.enOferta;
  const isPromoDosPorUno =
    Boolean(product.promo2x1Activa) ||
    String(product.tipoPromocion || "").toUpperCase() === "2X1";
  const isCyberMondayProduct = Boolean(product.isCyberMonday);
  const regularPrice = product.precioRegular;
  const discountPercentage = Number(product.porcentajeDescuento) || 0;
  const priceToDisplay = product.precioFinal || product.precio;
  const precioSinImpuestos = priceToDisplay / 1.21;

  const handleLoadingAgregar = async (e) => {
    e.stopPropagation();

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    agregarCarrito(product);
    setIsLoading(false);
  };

  const handleDisminuir = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (cantidadEnCarrito === 1) {
      eliminarDelCarrito(product.idProducto);
    } else {
      disminuirCantidad(product.idProducto);
    }
  };

  const handleAumentar = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    aumentarCantidad(product.idProducto);
  };

  const handleEliminar = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    eliminarDelCarrito(product.idProducto);
  };

  const stockStatus =
    product.stock === 0
      ? { text: "Sin stock", color: "text-gray-500", bg: "bg-gray-100" }
      : product.stock <= 10
        ? { text: "Pocas unidades", color: "text-red-500", bg: "bg-red-50" }
        : null;

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
        <BotonFavorito product={product} />
      </div>

      {stockStatus && (
        <div
          className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-md text-xs font-medium ${stockStatus.bg} ${stockStatus.color} ${isOffert ? "mt-7" : ""}`}
        >
          {stockStatus.text}
        </div>
      )}

      <Link
        to={`/productos/${product.idProducto}`}
        className="flex flex-col flex-1"
      >
        <div className="w-full h-48 flex items-center justify-center p-4 relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-t-2xl flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
          )}
          
          {/* Imagen Principal */}
          <img
            src={principalImage}
            alt={product.nombreProducto}
            className={`absolute max-h-[85%] object-contain transition-all duration-500 group-hover:scale-105 
              ${hoverImage ? 'group-hover:opacity-0' : ''} 
              ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = Default;
            }}
            loading="lazy"
          />

          {/* Imagen Secundaria (se muestra en hover) */}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={`${product.nombreProducto} - vista alternativa`}
              className="absolute max-h-[85%] object-contain opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
            />
          )}

          {isCyberMondayProduct && (
            <img
              src={cyberMonday}
              alt="Cyber Monday"
              className="absolute left-3 bottom-3 z-30 w-14 h-auto object-contain drop-shadow-md"
              style={{ imageRendering: "auto" }}
            />
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
        </div>

        <div className="p-4 flex flex-col flex-1 justify-between">
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {product.categoria}
              </p>
            </div>
            <div className="min-h-12 flex items-center">
              <h3
                className="text-gray-900 font-bold text-base leading-tight line-clamp-2 group-hover:text-primary-700 transition-colors duration-300"
                title={product.nombreProducto}
              >
                {product.nombreProducto}
              </h3>
            </div>
          </div>

          <div className="mt-4 space-y-2 min-h-15">
            <div className="flex min-h-8 items-end gap-2">
              <p
                className={`font-black whitespace-nowrap ${isOffert ? "text-xl text-red-600" : "text-xl text-gray-900"}`}
              >
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(priceToDisplay)}
              </p>
              {isOffert && regularPrice && (
                <p className="text-sm text-gray-500 line-through font-medium whitespace-nowrap truncate">
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }).format(regularPrice)}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Precio sin impuestos:{" "}
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(precioSinImpuestos)}
            </p>
            {isPromoDosPorUno && (
              <p className="text-xs text-primary-700 font-semibold">
                Llevas 2 y pagas 1
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {product.stock === 0 ? (
          <button
            disabled
            className="w-full px-3 py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            Sin stock
          </button>
        ) : cantidadEnCarrito === 0 ? (
          <button
            onClick={handleLoadingAgregar}
            aria-label="Agregar al carrito"
            disabled={isLoading}
            className={`
              flex items-center justify-center gap-2 w-full px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm
              ${
                isLoading
                  ? "bg-primary-700 cursor-not-allowed text-white"
                  : "bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
              } 
            `}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Agregar
              </>
            )}
          </button>
        ) : (
          <div className="flex w-full overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-sm">
            <button
              onClick={handleDisminuir}
              className="flex items-center justify-center w-1/5 py-3 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors duration-150 cursor-pointer border-r border-green-200"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center justify-center flex-1 px-2 py-1">
              <span className="text-lg font-bold text-green-700 leading-none">
                {cantidadEnCarrito}
              </span>
            </div>

            <button
              onClick={handleAumentar}
              className="flex items-center justify-center w-1/5 py-3 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-150 cursor-pointer border-l border-green-200"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={handleEliminar}
              className="flex items-center justify-center w-1/5 py-3 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors duration-150 cursor-pointer border-l border-green-200"
              aria-label="Eliminar del carrito"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-white/0 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
};

export default CardProductos;