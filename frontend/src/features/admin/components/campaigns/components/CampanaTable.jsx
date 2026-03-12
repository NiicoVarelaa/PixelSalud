import { motion } from "framer-motion";
import { Percent, Package, Edit2, Power, Trash2 } from "lucide-react";
import { formatearFecha } from "../utils/formatters";

export const CampanaTable = ({
  campanasActuales,
  onEditar,
  onToggleActiva,
  onEliminar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold">Campaña</th>
              <th className="px-6 py-4 text-center text-sm font-bold">Tipo</th>
              <th className="px-6 py-4 text-center text-sm font-bold">
                Descuento
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold">
                Vigencia
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold">
                Productos
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campanasActuales.map((campana, index) => (
              <motion.tr
                key={campana.idCampana}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`hover:bg-purple-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {campana.nombreCampana}
                    </p>
                    {campana.descripcion && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {campana.descripcion}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {campana.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-md">
                    <Percent className="w-4 h-4" />
                    {campana.porcentajeDescuento}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm">
                    <p className="text-gray-600">
                      {formatearFecha(campana.fechaInicio)}
                    </p>
                    <p className="text-gray-400">hasta</p>
                    <p className="text-gray-600">
                      {formatearFecha(campana.fechaFin)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    <Package className="w-4 h-4" />
                    {campana.cantidadProductos || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      campana.esActiva
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {campana.esActiva ? "✓ Activa" : "⊗ Inactiva"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEditar(campana)}
                      className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggleActiva(campana)}
                      className={`p-2 rounded-lg transition-all ${
                        campana.esActiva
                          ? "bg-red-100 hover:bg-red-200 text-red-600"
                          : "bg-green-100 hover:bg-green-200 text-green-600"
                      }`}
                      title={campana.esActiva ? "Desactivar" : "Activar"}
                    >
                      <Power className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEliminar(campana)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
