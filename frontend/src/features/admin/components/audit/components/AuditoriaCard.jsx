import { motion } from "framer-motion";
import { Eye, Clock, User } from "lucide-react";
import {
  formatearFecha,
  formatearEvento,
  getEventoBadgeColor,
  getRolBadgeColor,
} from "../utils/helpers";

export const AuditoriaCard = ({ auditoria, onVerDetalles, index = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
      aria-label={`Registro de auditoría: ${formatearEvento(auditoria.evento)} en ${auditoria.modulo}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getEventoBadgeColor(auditoria.evento)}`}
        >
          {formatearEvento(auditoria.evento)}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap">
          <Clock size={11} aria-hidden="true" />
          {formatearFecha(auditoria.fechaHora)}
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900 capitalize">
          {auditoria.modulo}
        </p>
        {auditoria.accion && (
          <p className="mt-0.5 text-xs text-gray-500">{auditoria.accion}</p>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 pt-2.5">
        <User size={13} className="shrink-0 text-gray-400" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-gray-800">
            {auditoria.nombreUsuario || "N/A"}
          </p>
        </div>
        <span
          className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${getRolBadgeColor(auditoria.tipoUsuario)}`}
        >
          {auditoria.tipoUsuario}
        </span>
      </div>

      {auditoria.descripcion && (
        <p className="line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {auditoria.descripcion}
        </p>
      )}

      <button
        type="button"
        onClick={() => onVerDetalles(auditoria)}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
        aria-label={`Ver detalles del registro ${formatearEvento(auditoria.evento)}`}
      >
        <Eye size={13} aria-hidden="true" />
        Ver detalles
      </button>
    </motion.article>
  );
};
