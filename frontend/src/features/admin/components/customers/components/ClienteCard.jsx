import { motion } from "framer-motion";
import {
  Mail,
  CreditCard,
  Edit2,
  Power,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

export const ClienteCard = ({ cliente, onEditar, onCambiarEstado }) => {
  const esActivo = cliente.activo !== 0 && cliente.activo !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 overflow-hidden rounded-xl border border-gray-100 bg-white"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {cliente.nombreCliente} {cliente.apellidoCliente}
            </h3>
            <p className="text-xs text-gray-400">ID: #{cliente.idCliente}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              esActivo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {esActivo ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {esActivo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2">
            <Mail className="text-blue-600" size={16} />
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
      </div>

      <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-2.5 justify-end">
        <button
          onClick={() => onEditar(cliente)}
          className={`p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500 ${baseBtn}`}
          title="Editar"
          aria-label={`Editar ${cliente.nombreCliente} ${cliente.apellidoCliente}`}
        >
          <Edit2 size={16} />
        </button>

        {esActivo ? (
          <button
            onClick={() => onCambiarEstado(cliente)}
            className={`p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 ${baseBtn}`}
            title="Desactivar"
            aria-label={`Desativar ${cliente.nombreCliente} ${cliente.apellidoCliente}`}
          >
            <Power size={16} />
          </button>
        ) : (
          <button
            onClick={() => onCambiarEstado(cliente)}
            className={`p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500 ${baseBtn}`}
            title="Reactivar"
            aria-label={`Reactivar ${cliente.nombreCliente} ${cliente.apellidoCliente}`}
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
