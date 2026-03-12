import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaReply } from "react-icons/fa";

export const MensajeRespuesta = ({ mensaje, isOpen, onClose, onEnviar }) => {
  const [respuesta, setRespuesta] = useState("");

  if (!mensaje) return null;

  const handleEnviar = async () => {
    const enviado = await onEnviar(mensaje.idMensaje, respuesta);
    if (enviado) {
      setRespuesta("");
      onClose();
    }
  };

  const handleClose = () => {
    setRespuesta("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={handleClose}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
              <FaReply /> Responder mensaje
            </h2>

            {/* Contexto del mensaje original */}
            <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
              <div className="text-sm mb-2">
                <span className="font-semibold">De:</span> {mensaje.nombre} (
                {mensaje.email})
              </div>
              <div className="text-sm mb-2">
                <span className="font-semibold">Asunto:</span> {mensaje.asunto}
              </div>
              <div className="text-xs text-gray-600 italic line-clamp-3">
                {mensaje.mensaje}
              </div>
            </div>

            {/* Campo de respuesta */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu respuesta:
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe tu respuesta aquí..."
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-1">
                {respuesta.length} caracteres
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={handleClose}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleEnviar}
                disabled={!respuesta.trim()}
              >
                <FaReply /> Enviar respuesta
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
