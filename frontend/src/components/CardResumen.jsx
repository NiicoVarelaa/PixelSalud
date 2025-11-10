import { useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  FiClipboard, 
  FiArrowRight, 
  FiShoppingBag,
  FiTag,
  FiCreditCard,
  FiShield,
  FiTruck
} from "react-icons/fi";
import { useCarritoStore } from "../store/useCarritoStore";

const formatPrice = (value) => {
  // Manejar casos donde value pueda ser NaN, undefined o null
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("es-AR", { 
    style: "currency", 
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
};

const CardResumen = () => {
  const { carrito } = useCarritoStore();

  const { totalArticulos, subtotal, total, hasDiscounts } = useMemo(() => {
    const articulos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    
    const sub = carrito.reduce((acc, prod) => {
      const priceToUse = prod.precioFinal || prod.precioRegular || prod.precio || 0;
      const price = typeof priceToUse === 'string' ? 
        parseFloat(priceToUse.replace(/[^0-9.-]+/g, "")) || 0 : 
        Number(priceToUse) || 0;
      return acc + price * prod.cantidad;
    }, 0);

    const hasDisc = carrito.some(product => 
      product.enOferta && product.porcentajeDescuento > 0
    );

    return {
      totalArticulos: articulos,
      subtotal: sub,
      total: sub,
      hasDiscounts: hasDisc
    };
  }, [carrito]);

  const isCartEmpty = carrito.length === 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <FiClipboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Resumen del Pedido</h2>
            <p className="text-primary-100 text-sm opacity-90">
              {totalArticulos} {totalArticulos === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Resumen de precios */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <FiShoppingBag className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Artículos</span>
            </div>
            <span className="font-semibold text-gray-900">{totalArticulos}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <FiTag className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Subtotal</span>
            </div>
            <span className="font-semibold text-gray-900">
              {formatPrice(subtotal)}
            </span>
          </div>

          {hasDiscounts && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-700">
                <FiTag className="w-4 h-4" />
                <span className="text-sm font-medium">¡Descuentos aplicados!</span>
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary-700 block">
                {formatPrice(total)}
              </span>
              <span className="text-xs text-gray-500">IVA incluido</span>
            </div>
          </div>
        </div>

        {/* Botón de Checkout */}
        <Link
          to={isCartEmpty ? "#" : "/checkout"}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center group ${
            isCartEmpty
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
          onClick={(e) => isCartEmpty && e.preventDefault()}
        >
          {isCartEmpty ? (
            "Carrito vacío"
          ) : (
            <>
              <FiCreditCard className="w-5 h-5 mr-2" />
              Proceder al Pago
              <FiArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Link>

        {/* Beneficios */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <FiShield className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>Compra 100% segura</span>
          </div>
        </div>

        {/* Mensaje de seguridad */}
        <div className="mt-4 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            Tu información está protegida con encriptación SSL
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardResumen;