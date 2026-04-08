import { motion } from "framer-motion";
import { Tag, Clock, Users, Power, Trash2 } from "lucide-react";
import {
  formatearFecha,
  getBadgeColor,
  getTipoUsuarioBadge,
} from "../utils/formatters";

const TIPO_USUARIO_LABEL = { todos: "Todos", nuevo: "Nuevos", vip: "VIP" };

export const CuponCard = ({ cupon, onCambiarEstado, onEliminar, index = 0 }) => {
  const esActivo = cupon.estado === "activo";
  const pctUso = cupon.usoMaximo
    ? Math.min(((cupon.vecesUsado || 0) / cupon.usoMaximo) * 100, 100)
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
      aria-label={`Cupón ${cupon.codigo}`}
    >
      {/* Fila 1: código + estado */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Tag size={14} className="shrink-0 text-green-600" aria-hidden="true" />
          <span className="truncate font-bold text-gray-900 tracking-wide">
            {cupon.codigo}
          </span>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getBadgeColor(cupon.estado)}`}>
          {cupon.estado}
        </span>
      </div>

      {/* Descripción */}
      {cupon.descripcion && (
        <p className="text-xs text-gray-500 line-clamp-2">{cupon.descripcion}</p>
      )}

      {/* Descuento + tipo usuario */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
        <div>
          <p className="text-[11px] text-gray-400">Descuento</p>
          <p className="text-base font-bold text-orange-600">
            {cupon.tipoCupon === "porcentaje"
              ? `${cupon.valorDescuento}%`
              : `$${cupon.valorDescuento}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-400">Audiencia</p>
          <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${getTipoUsuarioBadge(cupon.tipoUsuario)}`}>
            {TIPO_USUARIO_LABEL[cupon.tipoUsuario] ?? cupon.tipoUsuario}
          </span>
        </div>
      </div>

      {/* Vigencia */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Clock size={12} aria-hidden="true" />
        <span>
          {formatearFecha(cupon.fechaInicio)} → {formatearFecha(cupon.fechaVencimiento)}
        </span>
      </div>

      {/* Usos */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="inline-flex items-center gap-1">
            <Users size={12} aria-hidden="true" /> Usos
          </span>
          <span className="font-medium text-gray-700">
            {cupon.vecesUsado || 0} / {cupon.usoMaximo || "∞"}
          </span>
        </div>
        {pctUso !== null && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctUso}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-green-500"
            />
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1.5 border-t border-gray-100 pt-2.5">
        <button
          type="button"
          onClick={() => onCambiarEstado(cupon.idCupon, cupon.estado)}
          className={`flex flex-1 items-center justify-center gap-1.5 h-8 rounded-lg border text-xs font-semibold active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
            esActivo
              ? "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400"
              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus-visible:ring-green-500"
          }`}
          aria-label={`${esActivo ? "Desactivar" : "Activar"} cupón ${cupon.codigo}`}
        >
          <Power size={13} aria-hidden="true" />
          {esActivo ? "Desactivar" : "Activar"}
        </button>
        <button
          type="button"
          onClick={() => onEliminar(cupon.idCupon)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
          aria-label={`Eliminar cupón ${cupon.codigo}`}
        >
          <Trash2 size={13} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
};