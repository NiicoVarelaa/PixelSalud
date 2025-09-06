import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { useCarritoStore } from "../store/useCarritoStore";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    value
  );

const CardResumen = () => {
  const { carrito } = useCarritoStore();

  const totalArticulos = useMemo(
    () => carrito.reduce((acc, prod) => acc + prod.cantidad, 0),
    [carrito]
  );

  const subtotal = useMemo(
    () =>
      carrito.reduce(
        (acc, prod) => acc + parseFloat(prod.precio) * prod.cantidad,
        0
      ),
    [carrito]
  );

  const total = subtotal;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
          <BsFillClipboardCheckFill className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Resumen del Carrito</h2>
      </div>

      <div className="space-y-3 mb-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Artículos</span>
          <span className="font-medium text-gray-900">{totalArticulos}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-primary-700">
            {formatPrice(total)}
          </span>
        </div>
        <Link
          to="/checkout"
          className="w-full py-3 px-6 rounded-lg font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors text-center flex items-center justify-center group"
        >
          Checkout
          <FiArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default CardResumen;
