import {
  FaEnvelopeOpen,
  FaEnvelope,
  FaReply,
  FaArchive,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { MensajeEstadoBadge } from "./MensajeEstadoBadge";
import { formatFecha } from "../utils/helpers";

export const MensajesTable = ({
  mensajes,
  onVerDetalle,
  onResponder,
  onArchivar,
  onEliminar,
}) => {
  return (
    <>
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
            Estado
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
            Nombre
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
            Email
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
            Asunto
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
            Fecha
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {mensajes.map((mensaje, index) => (
          <motion.tr
            key={mensaje.idMensaje}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${mensaje.leido ? "bg-white" : "bg-primary-50"} hover:bg-gray-50 transition-colors`}
          >
            <td className="px-4 py-3 text-center">
              <div className="flex items-center gap-2">
                {mensaje.leido ? (
                  <FaEnvelopeOpen className="text-green-500" />
                ) : (
                  <FaEnvelope className="text-primary-600" />
                )}
                <MensajeEstadoBadge estado={mensaje.estado} />
              </div>
            </td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">
              {mensaje.nombre}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">{mensaje.email}</td>
            <td className="px-4 py-3 text-sm text-gray-900">
              {mensaje.asunto}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {formatFecha(mensaje.fechaEnvio)}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-1 items-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs px-2 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1"
                  onClick={() => onVerDetalle(mensaje)}
                  title="Ver detalle"
                >
                  <FaEnvelopeOpen size={10} /> Ver
                </motion.button>
                {mensaje.estado !== "respondido" &&
                  mensaje.estado !== "cerrado" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
                      onClick={() => onResponder(mensaje)}
                      title="Responder"
                    >
                      <FaReply size={10} /> Responder
                    </motion.button>
                  )}
                {mensaje.estado !== "cerrado" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-2 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 flex items-center gap-1"
                    onClick={() => onArchivar(mensaje.idMensaje)}
                    title="Archivar"
                  >
                    <FaArchive size={10} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                  onClick={() => onEliminar(mensaje.idMensaje)}
                  title="Eliminar"
                >
                  <FaTrash size={10} />
                </motion.button>
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </>
  );
};
