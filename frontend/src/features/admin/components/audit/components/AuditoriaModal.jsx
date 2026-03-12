import { motion, AnimatePresence } from "framer-motion";
import { formatearFecha, getRolBadgeColor } from "../utils/helpers";

export const AuditoriaModal = ({ auditoria, isOpen, onClose }) => {
  if (!isOpen || !auditoria) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Detalles de Auditoría
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-4">
            {/* Información General */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Evento
                </label>
                <p className="mt-1 text-gray-900">
                  {auditoria.evento.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Módulo
                </label>
                <p className="mt-1 text-gray-900 capitalize">
                  {auditoria.modulo}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Acción
                </label>
                <p className="mt-1 text-gray-900">{auditoria.accion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Fecha/Hora
                </label>
                <p className="mt-1 text-gray-900">
                  {formatearFecha(auditoria.fechaHora)}
                </p>
              </div>
            </div>

            {/* Usuario */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Usuario
              </label>
              <div className="mt-1 bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900 font-medium">
                  {auditoria.nombreUsuario || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {auditoria.emailUsuario || "N/A"}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${getRolBadgeColor(
                    auditoria.tipoUsuario,
                  )}`}
                >
                  {auditoria.tipoUsuario} #{auditoria.idUsuario}
                </span>
              </div>
            </div>

            {/* Descripción */}
            {auditoria.descripcion && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Descripción
                </label>
                <p className="mt-1 text-gray-900">{auditoria.descripcion}</p>
              </div>
            )}

            {/* Entidad Afectada */}
            {auditoria.entidadAfectada && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Entidad Afectada
                </label>
                <p className="mt-1 text-gray-900">
                  {auditoria.entidadAfectada} #{auditoria.idEntidad}
                </p>
              </div>
            )}

            {/* Datos Anteriores */}
            {auditoria.datosAnteriores && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Datos Anteriores
                </label>
                <pre className="mt-1 bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                  {JSON.stringify(auditoria.datosAnteriores, null, 2)}
                </pre>
              </div>
            )}

            {/* Datos Nuevos */}
            {auditoria.datosNuevos && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Datos Nuevos
                </label>
                <pre className="mt-1 bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                  {JSON.stringify(auditoria.datosNuevos, null, 2)}
                </pre>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Dirección IP
                </label>
                <p className="mt-1 text-gray-900 text-sm">
                  {auditoria.ip || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  User Agent
                </label>
                <p className="mt-1 text-gray-900 text-sm truncate">
                  {auditoria.userAgent || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
