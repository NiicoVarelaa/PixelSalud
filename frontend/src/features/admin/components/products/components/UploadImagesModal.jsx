import PropTypes from "prop-types";
import { X } from "lucide-react";
import UploadImagenes from "@components/molecules/admin/UploadImagenes";

const UploadImagesModal = ({ isOpen, onClose, productId, onUploadSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Subir Imágenes
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Agrega imágenes para tu producto
              </p>
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

        {/* Upload Component */}
        <div className="px-8 py-6">
          <UploadImagenes
            idProducto={productId}
            onUploadSuccess={onUploadSuccess}
            maxFiles={5}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-5 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};

UploadImagesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.number,
  onUploadSuccess: PropTypes.func.isRequired,
};

export default UploadImagesModal;
