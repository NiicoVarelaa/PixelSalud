import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import {
  formatearFecha,
  formatearEvento,
  getEventoBadgeColor,
  getRolBadgeColor,
} from "../utils/helpers";

export const AuditoriaCard = ({ auditoria, onVerDetalles }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getEventoBadgeColor(
            auditoria.evento,
          )}`}
        >
          {formatearEvento(auditoria.evento)}
        </span>
        <span className="text-xs text-gray-500">
          {formatearFecha(auditoria.fechaHora)}
        </span>
      </div>

      {/* Módulo */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-900 capitalize">
          {auditoria.modulo}
        </span>
      </div>

      {/* Usuario */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-900">
          {auditoria.nombreUsuario || "N/A"}
        </p>
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getRolBadgeColor(
            auditoria.tipoUsuario,
          )}`}
        >
          {auditoria.tipoUsuario}
        </span>
      </div>

      {/* Descripción */}
      {auditoria.descripcion && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {auditoria.descripcion}
        </p>
      )}

      {/* Acción */}
      <button
        onClick={() => onVerDetalles(auditoria)}
        className="w-full px-3 py-2 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Ver Detalles
      </button>
    </motion.div>
  );
};
