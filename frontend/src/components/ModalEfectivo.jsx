import { useState, useEffect } from "react";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiCopy,
  FiCheck,
  FiX,
} from "react-icons/fi";

const ModalEfectivo = ({ isOpen, onClose, onConfirm }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [retrievalCode, setRetrievalCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRetrievalCode(`PXL-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(retrievalCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  const branches = [
    {
      name: "Sucursal Centro",
      address: "Av. 24 de Septiembre 550, San Miguel de Tucumán",
      phone: "+54 381 123-4567",
      hours: "Lunes a Viernes: 9:00 - 18:00 | Sábados: 9:00 - 13:00",
    },
    {
      name: "Sucursal Yerba Buena",
      address: "Perón 1500, Yerba Buena",
      phone: "+54 381 765-4321",
      hours: "Lunes a Viernes: 8:30 - 17:30 | Sábados: 9:00 - 12:30",
    },
    {
      name: "Sucursal Avenida",
      address: "Av. Brígido Terán 1200, San Miguel de Tucumán",
      phone: "+54 381 987-6543",
      hours: "Lunes a Sábado: 8:00 - 20:00",
    },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Retiro en sucursal
            </h2>
            <p className="text-gray-600">
              Por favor acércate a una de nuestras sucursales con tu código de
              retiro
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 pt-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-5 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Tu código de retiro
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {retrievalCode}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  copiedCode
                    ? "bg-green-200 text-green-800"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {copiedCode ? (
                  <FiCheck className="mr-1" />
                ) : (
                  <FiCopy className="mr-1" />
                )}
                {copiedCode ? "Copiado" : "Copiar"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * Presenta este código al retirar tu pedido en cualquiera de
              nuestras sucursales
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiMapPin className="mr-2 text-green-600" /> Nuestras sucursales en
            Tucumán
          </h3>

          <div className="space-y-4 mb-6">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-200 transition-colors cursor-pointer group"
              >
                <h4 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                  {branch.name}
                </h4>
                <div className="space-y-2">
                  <p className="flex items-start text-gray-700">
                    <FiMapPin className="mt-1 mr-2 flex-shrink-0 text-green-500" />
                    <span>{branch.address}</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <FiPhone className="mr-2 text-green-500" />
                    <span>{branch.phone}</span>
                  </p>
                  <p className="flex items-start text-gray-700">
                    <FiClock className="mt-1 mr-2 flex-shrink-0 text-green-500" />
                    <span>{branch.hours}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg overflow-hidden mb-6 border border-gray-200">
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-green-50 to-gray-100 rounded overflow-hidden">
              <div className="w-full h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                    <FiMapPin size={24} />
                  </div>
                  <p className="text-sm font-medium">
                    Mapa interactivo de sucursales
                  </p>
                  <p className="text-xs mt-1"></p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                * Ubicaciones aproximadas - Consultar dirección exacta
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white font-medium text-primary-700 hover:bg-primary-100 transition-all rounded-lg cursor-pointer border border-primary-700 hover:border-primary-700 shadow-sm hover:shadow-md"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-6 py-3 font-medium bg-primary-700 text-white hover:bg-primary-800 transition-all rounded-lg cursor-pointer border border-primary-700 hover:border-primary-700 shadow-sm hover:shadow-md"
            >
              Confirmar retiro en sucursal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEfectivo;
