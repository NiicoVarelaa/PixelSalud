import { useState } from "react";
import { FiCopy, FiCheck, FiX } from "react-icons/fi"; // Import FiX

const ModalTransferencia = ({ isOpen, onClose, onConfirm }) => {
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedCBU, setCopiedCBU] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative"> {/* Add 'relative' class */}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          aria-label="Cerrar modal"
        >
          <FiX size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Datos para transferencia
          </h2>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-500">Alias</span>
                <button
                  onClick={() => copyToClipboard("pixel.salud", setCopiedAlias)}
                  className="text-primary-600 hover:text-primary-800 flex items-center cursor-pointer"
                >
                  {copiedAlias ? (
                    <FiCheck className="mr-1" />
                  ) : (
                    <FiCopy className="mr-1" />
                  )}
                  {copiedAlias ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="font-mono text-lg">pixel.salud</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-500">CBU</span>
                <button
                  onClick={() =>
                    copyToClipboard("1234567890123456789012", setCopiedCBU)
                  }
                  className="text-primary-600 hover:text-primary-800 flex items-center cursor-pointer"
                >
                  {copiedCBU ? (
                    <FiCheck className="mr-1" />
                  ) : (
                    <FiCopy className="mr-1" />
                  )}
                  {copiedCBU ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="font-mono text-lg">1234567890123456789012</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-500">
                  Email para comprobante
                </span>
                <button
                  onClick={() =>
                    copyToClipboard("pagos@pixel.com", setCopiedEmail)
                  }
                  className="text-primary-600 hover:text-primary-800 flex items-center cursor-pointer"
                >
                  {copiedEmail ? (
                    <FiCheck className="mr-1" />
                  ) : (
                    <FiCopy className="mr-1" />
                  )}
                  {copiedEmail ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="font-mono text-lg">pagos@pixel.com</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600">
                <strong>Banco:</strong> Banco Nación
                <br />
                Por favor recorda envíar el comprobante de transferencia al
                email indicado.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-primary-700 hover:bg-primary-100 transition-all rounded-lg cursor-pointer border border-primary-700 hover:border-primary-700 shadow-sm hover:shadow-md"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 font-medium bg-primary-700 text-white hover:bg-primary-800 transition-all rounded-lg cursor-pointer border border-primary-700 hover:border-primary-700 shadow-sm hover:shadow-md"
            >
              Confirmar pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTransferencia;