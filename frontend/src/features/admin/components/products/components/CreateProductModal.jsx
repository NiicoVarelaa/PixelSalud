import PropTypes from "prop-types";
import { X, ArrowRight } from "lucide-react";
import { cleanPrice } from "../utils/productUtils";
import CustomSelect from "./CustomSelect";

const CreateProductModal = ({
  isOpen,
  onClose,
  nuevoProducto,
  setNuevoProducto,
  onSubmit,
  categorias,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrecioChange = (e) => {
    const valorLimpio = cleanPrice(e.target.value);
    handleInputChange("precio", valorLimpio);
  };

  const handlePrecioBlur = (e) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      handleInputChange("precio", num.toFixed(2));
    }
  };

  const isFormValid =
    nuevoProducto.nombreProducto &&
    nuevoProducto.categoria &&
    nuevoProducto.precio;

  // Convertir categorías a formato para CustomSelect
  const categoriasOptions = [
    { value: "", label: "Seleccionar categoría" },
    ...categorias.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Nuevo Producto
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Completa la información básica del producto
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-lg"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-5">
            {/* Nombre del Producto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre del producto
              </label>
              <input
                type="text"
                value={nuevoProducto.nombreProducto}
                onChange={(e) =>
                  handleInputChange("nombreProducto", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Ej: Perfume Carolina Herrera"
              />
            </div>

            {/* Categoría */}
            <CustomSelect
              id="categoria-nuevo"
              label="Categoría"
              value={nuevoProducto.categoria}
              onChange={(value) => handleInputChange("categoria", value)}
              options={categoriasOptions}
            />

            {/* Precio y Stock en grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Precio
                </label>
                <input
                  type="text"
                  value={nuevoProducto.precio}
                  onChange={handlePrecioChange}
                  onBlur={handlePrecioBlur}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stock inicial
                </label>
                <input
                  type="number"
                  min="0"
                  value={nuevoProducto.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción
              </label>
              <textarea
                value={nuevoProducto.descripcion}
                onChange={(e) =>
                  handleInputChange("descripcion", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                rows="3"
                placeholder="Descripción del producto (opcional)"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-5 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={!isFormValid}
            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 flex items-center gap-2"
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

CreateProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  nuevoProducto: PropTypes.shape({
    nombreProducto: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.string,
    categoria: PropTypes.string,
    stock: PropTypes.string,
  }).isRequired,
  setNuevoProducto: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categorias: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CreateProductModal;
