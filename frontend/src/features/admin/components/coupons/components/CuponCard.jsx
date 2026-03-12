import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiTag, FiClock, FiUsers } from "react-icons/fi";
import {
  formatearFecha,
  getBadgeColor,
  getTipoUsuarioBadge,
} from "../utils/formatters";

export const CuponCard = ({ cupon, onCambiarEstado, onEliminar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <FiTag className="text-green-600" />
          <span className="font-bold text-gray-900">{cupon.codigo}</span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(cupon.estado)}`}
        >
          {cupon.estado}
        </span>
      </div>

      {/* Descripción */}
      {cupon.descripcion && (
        <p className="text-sm text-gray-600 mb-3">{cupon.descripcion}</p>
      )}

      {/* Descuento */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b">
        <span className="text-sm text-gray-600">Descuento</span>
        <span className="font-bold text-green-600">
          {cupon.tipoCupon === "porcentaje"
            ? `${cupon.valorDescuento}%`
            : `$${cupon.valorDescuento}`}
        </span>
      </div>

      {/* Tipo Usuario */}
      <div className="flex items-center gap-2 mb-3">
        <FiUsers className="text-gray-400 text-sm" />
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${getTipoUsuarioBadge(cupon.tipoUsuario)}`}
        >
          {cupon.tipoUsuario === "todos" && "Todos"}
          {cupon.tipoUsuario === "nuevo" && "Nuevos"}
          {cupon.tipoUsuario === "vip" && "VIP"}
        </span>
      </div>

      {/* Vigencia */}
      <div className="flex items-center gap-2 mb-3">
        <FiClock className="text-gray-400 text-sm" />
        <span className="text-xs text-gray-600">
          {formatearFecha(cupon.fechaInicio)} -{" "}
          {formatearFecha(cupon.fechaVencimiento)}
        </span>
      </div>

      {/* Usos */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Usos</span>
          <span>
            {cupon.vecesUsado || 0} / {cupon.usoMaximo || "∞"}
          </span>
        </div>
        {cupon.usoMaximo && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((cupon.vecesUsado / cupon.usoMaximo) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={() => onCambiarEstado(cupon.idCupon, cupon.estado)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            cupon.estado === "activo"
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          <FiEdit2 className="inline mr-1" />
          {cupon.estado === "activo" ? "Desactivar" : "Activar"}
        </button>
        <button
          onClick={() => onEliminar(cupon.idCupon)}
          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
};
