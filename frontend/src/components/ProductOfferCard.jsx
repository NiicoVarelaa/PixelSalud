import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Zap } from "lucide-react";
import { useState } from "react";

// Helper para formatear moneda
const formatCurrency = (number) =>
  new Intl.NumberFormat("es-AR", { 
    style: "currency", 
    currency: "ARS",
    minimumFractionDigits: 0
  }).format(number);

const ProductOfferCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculamos el precio original sumando 21% al precio base
  const precioOriginalCalculado = product.precio * 1.21;
  const esOferta = true;
  const porcentajeDescuento = Math.round(((precioOriginalCalculado - product.precio) / precioOriginalCalculado) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Aquí iría la lógica para agregar al carrito
    console.log('Agregar al carrito:', product.idProducto);
  };

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link
      to={`/productos/${product.idProducto}`}
      className="relative flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-4 transition-all duration-500 hover:shadow-2xl hover:border-primary-400 group cursor-pointer overflow-hidden"
    >
      {/* --- BADGE DE OFERTA MEJORADO --- */}
      {esOferta && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3" fill="white" />
              -{porcentajeDescuento}%
            </div>
          </div>
        </div>
      )}

      {/* --- Botón de favoritos --- */}
      <button
        onClick={toggleLike}
        className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 group-hover:bg-white"
      >
        <Heart 
          className={`h-4 w-4 transition-all duration-300 ${
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
          }`} 
        />
      </button>

      {/* --- Contenedor de imagen mejorado --- */}
      <div className="w-full aspect-square flex items-center justify-center mb-5 bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl"></div>
        )}
        <img
          src={product.img}
          alt={product.nombreProducto}
          className={`max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Overlay de acción */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 rounded-xl"></div>
      </div>

      {/* --- Contenido mejorado --- */}
      <div className="flex flex-col flex-grow text-left">
        {/* Marca */}
        {product.marca && (
          <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">
            {product.marca}
          </p>
        )}
        
        {/* Nombre del producto */}
        <h3 className="text-gray-900 text-sm font-semibold mb-3 line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-primary-700 transition-colors duration-300">
          {product.nombreProducto}
        </h3>
        
        <div className="mt-auto pt-3">
          {/* Precio original tachado */}
          {esOferta && (
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-400 text-sm line-through">
                {formatCurrency(precioOriginalCalculado)}
              </p>
              <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded">
                {porcentajeDescuento}% OFF
              </span>
            </div>
          )}
          
          {/* Precio actual y acciones */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xl text-primary-700 mb-1">
                {formatCurrency(product.precio)}
              </p>
              
              {/* Cuotas */}
              {product.cuotas && product.precioCuota && (
                <p className="text-green-600 text-xs font-semibold">
                  {product.cuotas} cuotas de {formatCurrency(product.precioCuota)}
                </p>
              )}
            </div>
            
            {/* Botón de agregar al carrito */}
            <button
              onClick={handleAddToCart}
              className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
          
          {/* Envío gratis */}
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-green-600 text-xs font-medium">Envío gratis</span>
          </div>
        </div>
      </div>

      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/0 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    </Link>
  );
};

export default ProductOfferCard;