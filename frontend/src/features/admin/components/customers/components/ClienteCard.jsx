import { motion } from "framer-motion";
import {
  Mail,
  CreditCard,
  Edit,
  Power,
  CheckCircle,
  XCircle,
} from "lucide-react";

/**
 * Tarjeta de cliente para vista móvil
 * Muestra toda la información del cliente en formato card
 */
export const ClienteCard = ({ cliente, onEditar, onCambiarEstado }) => {
  const esActivo = cliente.activo !== 0 && cliente.activo !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 18px -8px rgb(0 0 0 / 0.12)" }}
      className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className={`h-1 ${esActivo ? "bg-green-500" : "bg-red-500"}`} />

      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {cliente.nombreCliente} {cliente.apellidoCliente}
            </h3>
            <p className="text-xs text-gray-400">ID: #{cliente.idCliente}</p>
          </div>
          <div className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1.5">
            {esActivo ? (
              <CheckCircle className="text-green-600" size={18} />
            ) : (
              <XCircle className="text-red-600" size={18} />
            )}
          </div>
        </div>
      </div>

      {/* Información del cliente */}
      <div className="space-y-3 px-4 pb-4">
        {/* Email */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-50 p-2">
            <Mail className="text-sky-600" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Email
            </p>
            <p
              className="text-sm text-gray-700 truncate"
              title={cliente.emailCliente}
            >
              {cliente.emailCliente}
            </p>
          </div>
        </div>

        {/* DNI */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-50 p-2">
            <CreditCard className="text-violet-600" size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">DNI</p>
            <p className="text-sm text-gray-700">
              {cliente.dni || "No especificado"}
            </p>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-3">
          <div
            className={`${esActivo ? "bg-green-50" : "bg-red-50"} p-2 rounded-lg`}
          >
            {esActivo ? (
              <CheckCircle className="text-green-600" size={16} />
            ) : (
              <XCircle className="text-red-600" size={16} />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Estado
            </p>
            <p
              className={`text-sm font-semibold ${esActivo ? "text-green-600" : "text-red-600"}`}
            >
              {esActivo ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEditar(cliente)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2.5 font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
        >
          <Edit size={16} />
          Editar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCambiarEstado(cliente)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors ${
            esActivo
              ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          <Power size={16} />
          {esActivo ? "Desactivar" : "Activar"}
        </motion.button>
      </div>
    </motion.div>
  );
};
