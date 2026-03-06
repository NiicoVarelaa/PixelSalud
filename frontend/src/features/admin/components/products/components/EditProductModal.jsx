import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import { X, Save, Package, Images } from "lucide-react";
import { cleanPrice, detectAndCleanPrice } from "../utils/productUtils";
import UploadImagenes from "@components/molecules/admin/UploadImagenes";
import CustomSelect from "./CustomSelect";

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  onSave,
  categorias,
  onUpdateImages,
}) => {
  const [activeTab, setActiveTab] = useState("datos");
  const [formData, setFormData] = useState({
    nombreProducto: product?.nombreProducto || "",
    categoria: product?.categoria || "",
    precio: product?.precioRegular || "",
    stock: product?.stock || "",
    descripcion: product?.descripcion || "",
  });

  // Actualizar formData cuando cambia el producto
  useEffect(() => {
    if (product) {
      setFormData({
        nombreProducto: product.nombreProducto || "",
        categoria: product.categoria || "",
        precio: product.precioRegular || "",
        stock: product.stock || "",
        descripcion: product.descripcion || "",
      });
      setActiveTab("datos"); // Resetear a tab datos al abrir
    }
  }, [product]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePrecioChange = (e) => {
    const valorLimpio = cleanPrice(e.target.value);
    handleInputChange("precio", valorLimpio);
  };

  const handlePrecioBlur = (e) => {
    const precioLimpio = detectAndCleanPrice(e.target.value);
    handleInputChange("precio", precioLimpio);
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
    });
  };

  // Convertir categorías a formato para CustomSelect
  const categoriasOptions = [
    { value: "", label: "Seleccionar categoría" },
    ...categorias.map((c) => ({ value: c, label: c })),
  ];

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Editar Producto
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {product.nombreProducto}
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

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab("datos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === "datos"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Package className="h-4 w-4" />
              Datos
            </button>
            <button
              onClick={() => setActiveTab("imagenes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === "imagenes"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Images className="h-4 w-4" />
              Imágenes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {activeTab === "datos" ? (
            <div className="space-y-5">
              {/* Nombre del Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={formData.nombreProducto}
                  onChange={(e) =>
                    handleInputChange("nombreProducto", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900"
                />
              </div>

              {/* Categoría */}
              <CustomSelect
                id="categoria-editar"
                label="Categoría"
                value={formData.categoria}
                onChange={(value) => handleInputChange("categoria", value)}
                options={categoriasOptions}
              />

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Precio
                  </label>
                  <input
                    type="text"
                    value={formData.precio}
                    onChange={handlePrecioChange}
                    onBlur={handlePrecioBlur}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    handleInputChange("descripcion", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 resize-none"
                  rows="4"
                  placeholder="Descripción del producto (opcional)"
                />
              </div>
            </div>
          ) : (
            <div>
              <UploadImagenes
                idProducto={product.idProducto}
                onUploadSuccess={onUpdateImages}
                maxFiles={5}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-5 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          {activeTab === "datos" && (
            <button
              onClick={handleSubmit}
              disabled={
                !formData.nombreProducto ||
                !formData.categoria ||
                !formData.precio
              }
              className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

EditProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    idProducto: PropTypes.number,
    nombreProducto: PropTypes.string,
    categoria: PropTypes.string,
    precioRegular: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.number,
    descripcion: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  categorias: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdateImages: PropTypes.func.isRequired,
};

export default EditProductModal;
