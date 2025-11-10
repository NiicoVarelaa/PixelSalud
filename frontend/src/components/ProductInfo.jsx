import { useNavigate } from "react-router-dom";
import { useCarritoStore } from "../store/useCarritoStore";
// Asegúrate de importar useAuthStore si quieres poner la lógica de login/modal aquí
// Pero la lógica de autenticación ya está delegada a useCarritoStore.
import { Minus, Plus, Trash2 } from "lucide-react";
import promoImg from "../assets/medio-de-pago.png";

// Función robusta para limpiar y parsear precios con formato regional (ej: 50.268,75)
const cleanAndParsePrice = (price) => {
  // Si ya es un número o nulo/indefinido, devuelve el valor o 0
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;

  // 1. Deja solo números, comas y puntos.
  let cleaned = price.replace(/[^0-9,.]/g, ''); 
  
  // 2. Si contiene coma (asumimos formato AR: 1.000,00), reemplaza puntos por nada y coma por punto decimal.
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  const parsed = parseFloat(cleaned);
  // Devuelve 0 si el resultado no es un número válido
  return isNaN(parsed) ? 0 : parsed;
};


const formatCurrency = (number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    number
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
    (item) => item.idProducto === product.idProducto
  );
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;
  const isInCart = cantidadEnCarrito > 0;

  // 1. LIMPIEZA: Aseguramos que los precios sean números válidos
  // Usamos el precio final de la BD
  const currentPrice = cleanAndParsePrice(product.precio);
  
  // Usamos el precio original. Si es null/undefined del store, será 0.
  const originalPrice = precioOriginal ? cleanAndParsePrice(precioOriginal) : 0; 
  

  const handleAddToCart = async () => {
    // La lógica de login/modal se gestiona dentro de useCarritoStore.js
    await agregarCarrito(product);
  };

  const handleBuyNow = async () => {
    // Asegura que el producto esté en el carrito antes de navegar
    if (cantidadEnCarrito === 0) {
      await agregarCarrito(product);
    }
    navigate("/carrito");
  };

  const handleDisminuir = async () => {
    if (cantidadEnCarrito === 1) {
      await eliminarDelCarrito(product.idProducto);
    } else {
      await disminuirCantidad(product.idProducto);
    }
  };

  const handleAumentar = async () => {
    if (cantidadEnCarrito < product.stock) {
      await aumentarCantidad(product.idProducto);
    }
  };

  const handleEliminar = async () => {
    await eliminarDelCarrito(product.idProducto);
  };

  // 2. CÁLCULO SEGURO: Usamos los precios limpios (currentPrice y originalPrice)
  const discountPercentage =
    originalPrice > 0 && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const getStockBadgeColor = (stock) => {
    if (stock === 0) return "bg-red-100 border-red-300 text-red-800";
    if (stock <= 5) return "bg-orange-100 border-orange-300 text-orange-800";
    if (stock <= 15) return "bg-yellow-100 border-yellow-300 text-yellow-800";
    return "bg-green-100 border-green-300 text-green-800";
  };

  const getStockText = (stock) => {
    if (stock === 0) return "Sin stock";
    if (stock <= 5) return `Últimas ${stock} unidades`;
    if (stock <= 15) return `Stock bajo (${stock})`;
    return "Stock disponible";
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col h-full justify-between">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {product.nombreProducto}
            </h2>

            <div
              className={`inline-flex items-center gap-2 self-start p-2 px-4 rounded-full border ${getStockBadgeColor(
                product.stock
              )}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock === 0
                    ? "bg-red-500"
                    : product.stock <= 5
                    ? "bg-orange-500"
                    : product.stock <= 15
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {getStockText(product.stock)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-extrabold text-primary-700">
                {formatCurrency(currentPrice)}
              </p>
              {discountPercentage > 0 && (
                <p className="text-lg text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </p>
              )}
            </div>

            {discountPercentage > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-700 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  {discountPercentage} % DE DESCUENTO
                </div>
                <p className="text-primary-600 font-semibold text-sm">
                  Ahorrás {formatCurrency(originalPrice - currentPrice)}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600 leading-relaxed text-md">
              {product.descripcion}
            </p>
          </div>
        </div>

        <div className="w-full">
          <img
            src={promoImg}
            alt="Promoción Medios de Pago"
            className="rounded-xl w-full object-cover aspect-[4/1] md:aspect-[5/1] border border-gray-100"
          />
        </div>
      </div>{" "}
      <div className="flex flex-col gap-6 pt-6">
        {!isInCart && (
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-3 py-3 font-semibold rounded-xl transform hover:scale-[1.02] transition-all duration-200 group bg-white text-primary-700 border-2 border-primary-700  hover:bg-primary-100 shadow-sm hover:shadow-md cursor-pointer
              
              disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:hover:bg-gray-200 disabled:cursor-not-allowed disabled:transform-none"
              disabled={product.stock === 0}
            >
              Agregar al carrito
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-3 py-3 font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg group cursor-pointer
              
              disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              disabled={product.stock === 0}
            >
              Comprar
            </button>
          </div>
        )}

        {isInCart && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="flex items-stretch rounded-xl overflow-hidden border-2 border-primary-700 bg-white shadow-md">
                <button
                  onClick={handleDisminuir}
                  className="flex items-center justify-center w-14 py-4 text-base font-bold text-gray-700 bg-white hover:bg-red-50 hover:text-red-700 active:bg-red-50 transition-all duration-150 cursor-pointer border-r border-gray-200"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center flex-1 px-4 ">
                  <div className="text-center">
                    <span className="text-xl font-bold text-primary-700 block">
                      {cantidadEnCarrito}
                    </span>
                    <span className="text-xs text-primary-700 font-medium -mt-1 block">
                      en carrito
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleAumentar}
                  className="flex items-center justify-center w-14 py-4 text-base font-bold text-gray-600 bg-white hover:bg-gray-50 hover:text-primary-600 active:bg-gray-100 transition-all duration-150 cursor-pointer border-l border-gray-200
                  
                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                  aria-label="Aumentar cantidad"
                  disabled={cantidadEnCarrito >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleEliminar}
                  className="flex items-center justify-center w-14 py-4 text-base font-bold text-gray-600 bg-white hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 border-l border-gray-200 cursor-pointer"
                  aria-label="Quitar del carrito"
                  title="Quitar del carrito"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full md:w-1/2 flex items-center justify-center gap-3 py-4 font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg group cursor-pointer"
            >
              Comprar ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;