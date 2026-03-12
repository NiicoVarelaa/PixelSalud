import { motion } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  formatearFecha,
  getBadgeColor,
  getTipoUsuarioBadge,
} from "../utils/formatters";

export const CuponTable = ({ cupones, onCambiarEstado, onEliminar }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descuento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vigencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cupones.map((cupon) => (
              <motion.tr
                key={cupon.idCupon}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50"
              >
                {/* Código y Descripción */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {cupon.codigo}
                    </div>
                    {cupon.descripcion && (
                      <div className="text-gray-500 truncate max-w-xs">
                        {cupon.descripcion}
                      </div>
                    )}
                  </div>
                </td>

                {/* Descuento */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-green-600">
                    {cupon.tipoCupon === "porcentaje"
                      ? `${cupon.valorDescuento}%`
                      : `$${cupon.valorDescuento}`}
                  </span>
                </td>

                {/* Tipo Usuario */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoUsuarioBadge(cupon.tipoUsuario)}`}
                  >
                    {cupon.tipoUsuario === "todos" && "Todos"}
                    {cupon.tipoUsuario === "nuevo" && "Nuevos"}
                    {cupon.tipoUsuario === "vip" && "VIP"}
                  </span>
                </td>

                {/* Vigencia */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{formatearFecha(cupon.fechaInicio)}</div>
                  <div>{formatearFecha(cupon.fechaVencimiento)}</div>
                </td>

                {/* Usos */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cupon.vecesUsado || 0} / {cupon.usoMaximo || "∞"}
                </td>

                {/* Estado */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(cupon.estado)}`}
                  >
                    {cupon.estado}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onCambiarEstado(cupon.idCupon, cupon.estado)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        cupon.estado === "activo"
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={
                        cupon.estado === "activo" ? "Desactivar" : "Activar"
                      }
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEliminar(cupon.idCupon)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
