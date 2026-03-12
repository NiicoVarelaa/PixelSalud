import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import {
  formatearFecha,
  formatearEvento,
  getEventoBadgeColor,
  getRolBadgeColor,
} from "../utils/helpers";

export const AuditoriaTable = ({ auditorias, onVerDetalles }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha/Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Evento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Módulo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {auditorias.map((auditoria) => (
            <motion.tr
              key={auditoria.idAuditoria}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatearFecha(auditoria.fechaHora)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getEventoBadgeColor(
                    auditoria.evento,
                  )}`}
                >
                  {formatearEvento(auditoria.evento)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                {auditoria.modulo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {auditoria.nombreUsuario || "N/A"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 ${getRolBadgeColor(
                      auditoria.tipoUsuario,
                    )}`}
                  >
                    {auditoria.tipoUsuario}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {auditoria.descripcion || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onVerDetalles(auditoria)}
                  className="text-primary-600 hover:text-primary-800 flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalles
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
