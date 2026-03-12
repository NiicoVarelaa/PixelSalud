import { motion } from "framer-motion";
import { Calendar, Users, Edit2, Power, Trash2 } from "lucide-react";
import { formatearFecha } from "../utils/formatters";

export const CampanaCard = ({
  campana,
  index,
  onEditar,
  onToggleActiva,
  onEliminar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{campana.nombreCampana}</h3>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {campana.tipo}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
            <span className="text-2xl font-bold">
              {campana.porcentajeDescuento}%
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {campana.descripcion && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {campana.descripcion}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {formatearFecha(campana.fechaInicio)} -{" "}
            {formatearFecha(campana.fechaFin)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{campana.cantidadProductos || 0} productos</span>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              campana.esActiva
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {campana.esActiva ? "✓ Activa" : "⊗ Inactiva"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEditar(campana)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleActiva(campana)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              campana.esActiva
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <Power className="w-4 h-4" />
            {campana.esActiva ? "Desactivar" : "Activar"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEliminar(campana)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
