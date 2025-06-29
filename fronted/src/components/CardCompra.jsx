import { useCarritoStore } from "../store/useCarritoStore";
import ModalCompraCarrito from "./ModalCompraCarrito";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaMoneyBillWave } from "react-icons/fa";

const CardCompra = () => {
  const { carrito } = useCarritoStore();

  const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

  return (
    <div className="max-w-sm w-full bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-5 self-start sticky top-6 max-h-[550px] overflow-y-auto">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Resumen de compra</h2>
        <p className="text-sm text-gray-500">Verificá el total antes de confirmar</p>
      </div>

      <hr className="border-gray-300" />

      {/* Total a pagar */}
      <div className="text-base text-gray-700 mt-4">
        <div className="flex justify-between">
          <span>Total a pagar:</span>
          <span className="font-semibold text-lg text-green-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Íconos de métodos de pago */}
      <div className="flex items-center justify-center gap-4 text-2xl text-gray-500 mt-4">
        <FaCcVisa title="Visa" className="hover:text-blue-600 transition" />
        <FaCcMastercard title="Mastercard" className="hover:text-red-600 transition" />
        <FaCcAmex title="American Express" className="hover:text-indigo-600 transition" />
      </div>

      <ModalCompraCarrito />
    </div>
  );
};

export default CardCompra;

