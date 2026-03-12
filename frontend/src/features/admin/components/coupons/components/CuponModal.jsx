import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CuponModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    tipoCupon: "porcentaje",
    valorDescuento: "",
    descripcion: "",
    fechaInicio: "",
    fechaVencimiento: "",
    usoMaximo: "",
    tipoUsuario: "todos",
    montoMinimo: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      tipoCupon: "porcentaje",
      valorDescuento: "",
      descripcion: "",
      fechaInicio: "",
      fechaVencimiento: "",
      usoMaximo: "",
      tipoUsuario: "todos",
      montoMinimo: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Crear Nuevo Cupón
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código del Cupón *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    codigo: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Ej: VERANO2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descripcion: e.target.value,
                  })
                }
                placeholder="Ej: Descuento especial de verano"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Tipo y Valor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Descuento *
                </label>
                <select
                  value={formData.tipoCupon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoCupon: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="monto_fijo">Monto Fijo ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor del Descuento *
                </label>
                <input
                  type="number"
                  value={formData.valorDescuento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valorDescuento: e.target.value,
                    })
                  }
                  placeholder={
                    formData.tipoCupon === "porcentaje" ? "10" : "500"
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio *
                </label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaInicio: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaVencimiento: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Configuración */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usos Máximos
                </label>
                <input
                  type="number"
                  value={formData.usoMaximo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usoMaximo: e.target.value,
                    })
                  }
                  min="1"
                  placeholder="Ilimitado"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo Usuario
                </label>
                <select
                  value={formData.tipoUsuario}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoUsuario: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="nuevo">Nuevos</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Mínimo ($)
                </label>
                <input
                  type="number"
                  value={formData.montoMinimo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      montoMinimo: e.target.value,
                    })
                  }
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Crear Cupón
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
