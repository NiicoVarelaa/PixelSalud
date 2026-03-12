import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEnvelope,
  FaReply,
  FaCheck,
  FaArchive,
  FaTrash,
} from "react-icons/fa";
import { MensajeEstadoBadge } from "./MensajeEstadoBadge";
import { formatFecha } from "../utils/helpers";

export const MensajeDetalle = ({
  mensaje,
  isOpen,
  onClose,
  onMarcarLeido,
  onResponder,
  onArchivar,
  onEliminar,
}) => {
  if (!mensaje) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-4 text-primary-700 flex items-center gap-2">
              <FaEnvelope className="text-primary-600" /> Mensaje de{" "}
              {mensaje.nombre}
            </h2>

            {/* Info del mensaje */}
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="font-semibold text-gray-600">Email:</span>{" "}
                <span className="text-gray-800">{mensaje.email}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-600">Asunto:</span>{" "}
                <span className="text-gray-800">{mensaje.asunto}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-600">Fecha:</span>{" "}
                <span className="text-gray-800">
                  {formatFecha(mensaje.fechaEnvio)}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-600">Estado:</span>{" "}
                <MensajeEstadoBadge estado={mensaje.estado} />
              </div>
            </div>

            {/* Mensaje del cliente */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Mensaje:</h3>
              <div className="p-4 bg-gray-50 rounded border border-gray-200 text-gray-800 whitespace-pre-line">
                {mensaje.mensaje}
              </div>
            </div>

            {/* Respuesta del admin (si existe) */}
            {mensaje.respuesta && (
              <div className="mb-4">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <FaReply /> Respuesta:
                </h3>
                <div className="p-4 bg-blue-50 rounded border border-blue-200 text-gray-800 whitespace-pre-line">
                  {mensaje.respuesta}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Respondido por: {mensaje.respondidoPor || "Admin"} •{" "}
                  {formatFecha(mensaje.fechaRespuesta)}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-3 justify-end mt-6 flex-wrap">
              {!mensaje.leido && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                  onClick={() => {
                    onMarcarLeido(mensaje.idMensaje);
                    onClose();
                  }}
                >
                  <FaCheck /> Marcar como leído
                </motion.button>
              )}
              {mensaje.estado !== "respondido" &&
                mensaje.estado !== "cerrado" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                    onClick={() => {
                      onClose();
                      onResponder(mensaje);
                    }}
                  >
                    <FaReply /> Responder
                  </motion.button>
                )}
              {mensaje.estado !== "cerrado" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center gap-2"
                  onClick={() => {
                    onArchivar(mensaje.idMensaje);
                    onClose();
                  }}
                >
                  <FaArchive /> Archivar
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                onClick={async () => {
                  const eliminado = await onEliminar(mensaje.idMensaje);
                  if (eliminado) onClose();
                }}
              >
                <FaTrash /> Eliminar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={onClose}
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
