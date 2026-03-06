import PropTypes from "prop-types";
import { X, Power, AlertCircle } from "lucide-react";

const ToggleStatusModal = ({ isOpen, onClose, product, onConfirm }) => {
  if (!isOpen || !product) return null;

  const isActivating = !product.activo;
  const action = isActivating ? "Activar" : "Desactivar";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isActivating ? "bg-green-100" : "bg-orange-100"
                }`}
              >
                <Power
                  className={`h-6 w-6 ${
                    isActivating ? "text-green-600" : "text-orange-600"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {action} Producto
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Confirma esta acción
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-lg cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={product.img}
                alt={product.nombreProducto}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/80x80/e5e7eb/6b7280?text=Sin+Imagen")
                }
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {product.nombreProducto}
                </h3>
                <p className="text-sm text-gray-500">{product.categoria}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  Stock: {product.stock} unidades
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div
            className={`flex gap-3 p-4 rounded-xl mb-6 ${
              isActivating
                ? "bg-green-50 border border-green-200"
                : "bg-orange-50 border border-orange-200"
            }`}
          >
            <AlertCircle
              className={`h-5 w-5 shrink-0 mt-0.5 ${
                isActivating ? "text-green-600" : "text-orange-600"
              }`}
            />
            <div className="text-sm">
              <p
                className={`font-medium mb-1 ${
                  isActivating ? "text-green-900" : "text-orange-900"
                }`}
              >
                {isActivating
                  ? "El producto será visible para los clientes"
                  : "El producto dejará de ser visible"}
              </p>
              <p
                className={isActivating ? "text-green-700" : "text-orange-700"}
              >
                {isActivating
                  ? "Los clientes podrán ver y comprar este producto en la tienda online."
                  : "Los clientes no podrán ver ni comprar este producto, pero seguirá en tu inventario."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-6 py-2.5 font-medium rounded-xl text-white transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                isActivating
                  ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
              }`}
            >
              <Power className="h-4 w-4" />
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ToggleStatusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    idProducto: PropTypes.number,
    nombreProducto: PropTypes.string,
    categoria: PropTypes.string,
    img: PropTypes.string,
    stock: PropTypes.number,
    activo: PropTypes.bool,
  }),
  onConfirm: PropTypes.func.isRequired,
};

export default ToggleStatusModal;
