import React from "react";

const ModalTipoEntrega = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">¿Cómo quieres recibir tu compra?</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelect("Sucursal")}
            className="w-full py-2 bg-primary-700 text-white rounded hover:bg-primary-800"
          >
            Retirar por sucursal
          </button>
          <button
            onClick={() => onSelect("Envio")}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Envío a domicilio
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:underline w-full"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalTipoEntrega;
