import ModalCompraCarrito from "./ModalCompraCarrito";


const CardCompra = () => {
  return (
    <div className="max-w-sm w-full bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Resumen de compra</h2>
        <p className="text-sm text-gray-500">Verificá el total antes de confirmar</p>
      </div>

      <hr className="border-gray-300" />

      <div className="text-base text-gray-700 space-y-2">
        <div className="flex justify-between">
          <span>Total a pagar:</span>
          <span className="font-semibold text-lg text-green-600">$20</span>
        </div>
      </div>

      <ModalCompraCarrito/>
    </div>
  );
};

export default CardCompra;

