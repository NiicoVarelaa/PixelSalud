import { X, Tag, Percent } from "lucide-react";
import { ProductSelector } from "./ProductSelector";

export const CampanaModal = ({
  isOpen,
  modoEdicion,
  campana,
  onCampanaChange,
  productosSeleccionados,
  onToggleProducto,
  onSeleccionarTodos,
  productos,
  categorias,
  busquedaProducto,
  onBusquedaProductoChange,
  categoriaFiltro,
  onCategoriaFiltroChange,
  onClose,
  onGuardar,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar();
  };

  const isFormValid =
    campana.nombreCampana &&
    campana.porcentajeDescuento &&
    productosSeleccionados.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 text-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {modoEdicion ? "Editar Campaña" : "Nueva Campaña"}
              </h2>
              <p className="text-purple-100 mt-1">
                {modoEdicion
                  ? "Modifica los datos y productos de la campaña"
                  : "Crea una campaña con múltiples productos"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Formulario de Campaña */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Datos de la Campaña
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Campaña *
                </label>
                <input
                  type="text"
                  value={campana.nombreCampana}
                  onChange={(e) =>
                    onCampanaChange({
                      ...campana,
                      nombreCampana: e.target.value,
                    })
                  }
                  placeholder="Ej: Cyber Monday 2026, Ofertas de Primavera, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={campana.descripcion}
                  onChange={(e) =>
                    onCampanaChange({
                      ...campana,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Descripción breve de la campaña..."
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje de Descuento * (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={campana.porcentajeDescuento}
                    onChange={(e) =>
                      onCampanaChange({
                        ...campana,
                        porcentajeDescuento: e.target.value,
                      })
                    }
                    placeholder="Ej: 15, 25, 50"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Campaña
                </label>
                <select
                  value={campana.tipo}
                  onChange={(e) =>
                    onCampanaChange({
                      ...campana,
                      tipo: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="DESCUENTO">Descuento</option>
                  <option value="EVENTO">Evento</option>
                  <option value="LIQUIDACION">Liquidación</option>
                  <option value="TEMPORADA">Temporada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={campana.fechaInicio}
                  onChange={(e) =>
                    onCampanaChange({
                      ...campana,
                      fechaInicio: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={campana.fechaFin}
                  onChange={(e) =>
                    onCampanaChange({
                      ...campana,
                      fechaFin: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Selector de Productos */}
          <ProductSelector
            productos={productos}
            categorias={categorias}
            productosSeleccionados={productosSeleccionados}
            onToggleProducto={onToggleProducto}
            onSeleccionarTodos={onSeleccionarTodos}
            busqueda={busquedaProducto}
            onBusquedaChange={onBusquedaProductoChange}
            categoria={categoriaFiltro}
            onCategoriaChange={onCategoriaFiltroChange}
          />

          {/* Botones de Acción */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {modoEdicion ? "Actualizar Campaña" : "Crear Campaña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
