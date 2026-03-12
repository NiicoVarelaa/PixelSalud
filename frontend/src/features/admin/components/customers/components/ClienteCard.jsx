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
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="bg-white rounded-xl shadow-lg overflow-hidden mb-4"
    >
      {/* Header con gradiente y estado */}
      <div
        className={`bg-gradient-to-r ${esActivo ? "from-green-500 to-green-600" : "from-red-500 to-red-600"} p-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">
              {cliente.nombreCliente} {cliente.apellidoCliente}
            </h3>
            <p className="text-white text-xs opacity-90">
              ID: #{cliente.idCliente}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {esActivo ? (
              <CheckCircle className="text-white" size={20} />
            ) : (
              <XCircle className="text-white" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Información del cliente */}
      <div className="p-4 space-y-3">
        {/* Email */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Mail className="text-blue-600" size={18} />
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
          <div className="bg-purple-50 p-2 rounded-lg">
            <CreditCard className="text-purple-600" size={18} />
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
              <CheckCircle className="text-green-600" size={18} />
            ) : (
              <XCircle className="text-red-600" size={18} />
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
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEditar(cliente)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors shadow-md"
        >
          <Edit size={18} />
          Editar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCambiarEstado(cliente)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium rounded-lg transition-colors shadow-md ${
            esActivo
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <Power size={18} />
          {esActivo ? "Desactivar" : "Activar"}
        </motion.button>
      </div>
    </motion.div>
  );
};
