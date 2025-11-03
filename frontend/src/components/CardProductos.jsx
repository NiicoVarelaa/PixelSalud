import { Link } from "react-router-dom";
import { useCarritoStore } from "../store/useCarritoStore";
import BotonFavorito from "./BotonFavorito";
import { Minus, Plus, Trash2, Loader2, Tag, Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

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
  } = useCarritoStore();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const itemEnCarrito = carrito.find(
    (item) => item.idProducto === product.idProducto
  );
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;
  
  // Lógica de precios y oferta
  const isOffert = !!product.enOferta;
  const regularPrice = product.precioRegular; 
  const discountPercentage = product.porcentajeDescuento; 
  const priceToDisplay = product.precioFinal || product.precio; 
  const precioSinImpuestos = priceToDisplay / 1.21;

  // Manejo mejorado de agregar al carrito con feedback visual
  const handleLoadingAgregar = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    // Simulación de tiempo de carga
    await new Promise(resolve => setTimeout(resolve, 800));
    
    agregarCarrito(product);
    setIsLoading(false);
    setIsAdded(true);
    
    // Reset del estado de "añadido" después de 2 segundos
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDisminuir = (e) => {
    e.stopPropagation();
    if (cantidadEnCarrito === 1) {
      eliminarDelCarrito(product.idProducto);
    } else {
      disminuirCantidad(product.idProducto);
    }
  };

  const handleAumentar = (e) => {
    e.stopPropagation();
    aumentarCantidad(product.idProducto);
  };

  const handleEliminar = (e) => {
    e.stopPropagation();
    eliminarDelCarrito(product.idProducto);
  };

  // Estado de stock
  const stockStatus = product.stock === 0 
    ? { text: "Sin stock", color: "text-gray-500", bg: "bg-gray-100" }
    : product.stock <= 10 
      ? { text: "Pocas unidades", color: "text-red-500", bg: "bg-red-50" }
      : null;

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full h-full flex flex-col group overflow-hidden">
      
      {/* Badge de oferta mejorado */}
      {isOffert && (
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg text-xs shadow-lg flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {discountPercentage ? `${Math.round(discountPercentage)}% OFF` : 'OFERTA'}
        </div>
      )}

      {/* Botón favorito reposicionado */}
      <div className="absolute top-3 right-3 z-20">
        <BotonFavorito product={product} />
      </div>

      {/* Estado de stock */}
      {stockStatus && (
        <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-md text-xs font-medium ${stockStatus.bg} ${stockStatus.color} ${isOffert ? 'mt-7' : ''}`}>
          {stockStatus.text}
        </div>
      )}

      <Link
        to={`/productos/${product.idProducto}`}
        className="flex flex-col flex-1"
      >
        {/* Contenedor de imagen mejorado */}
        <div className="w-full h-48 flex items-center justify-center p-4 0 relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-t-2xl flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
          )}
          <img
            src={product.img}
            alt={product.nombreProducto}
            className={`max-h-full object-contain transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {product.categoria}
              </p>
            </div>
            {/* 🚨 CAMBIO AQUÍ: Contenedor con altura mínima */}
            <div className="min-h-[3rem] flex items-center"> {/* Ajustamos a 3rem (aprox. 2 líneas de texto) */}
                <h3
                    className="text-gray-900 font-bold text-base leading-tight line-clamp-2 group-hover:text-primary-700 transition-colors duration-300"
                    title={product.nombreProducto}
                >
                    {product.nombreProducto}
                </h3>
            </div>
            {/* Fin del cambio */}
          </div>

          {/* Información de precios mejorada */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center flex-wrap gap-2">
              <p className={`font-black ${isOffert ? 'text-xl text-red-600' : 'text-xl text-gray-900'}`}>
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(priceToDisplay)}
              </p>
              {isOffert && regularPrice && (
                <p className="text-sm text-gray-500 line-through font-medium">
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
          </div>
        </div>
      </Link>

      {/* Controles del carrito mejorados */}
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
              ${isAdded 
                ? "bg-green-500 text-white" 
                : isLoading 
                  ? "bg-primary-700 cursor-not-allowed" 
                  : "hover:shadow-md text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 cursor-pointer"
              } 
            `}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
              </>
            ) : isLoading ? (
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
      
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/0 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
};

export default CardProductos;