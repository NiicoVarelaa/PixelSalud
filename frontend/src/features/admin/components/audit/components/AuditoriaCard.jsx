import { Eye, Clock, User } from "lucide-react";
import {
  formatearFecha,
  formatearEvento,
  getEventoBadgeColor,
  getRolBadgeColor,
} from "../utils/helpers";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

export const AuditoriaCard = ({ auditoria, onVerDetalles }) => {
  return (
    <article
      className="overflow-hidden rounded-xl border border-gray-100 bg-white"
      aria-label={`Registro de auditoria: ${formatearEvento(auditoria.evento)} en ${auditoria.modulo}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getEventoBadgeColor(auditoria.evento)}`}
          >
            {formatearEvento(auditoria.evento)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
            <Clock size={12} aria-hidden="true" />
            {formatearFecha(auditoria.fechaHora)}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-sm font-semibold text-gray-900 capitalize">
            {auditoria.modulo}
          </p>
          {auditoria.accion && (
            <p className="mt-0.5 text-xs text-gray-500">{auditoria.accion}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <User size={14} className="text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Usuario
            </p>
            <p className="text-sm text-gray-700 truncate">
              {auditoria.nombreUsuario || "N/A"}
            </p>
          </div>
          <span
            className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRolBadgeColor(auditoria.tipoUsuario)}`}
          >
            {auditoria.tipoUsuario}
          </span>
        </div>

        {auditoria.descripcion && (
          <p className="mt-3 text-xs text-gray-500 line-clamp-2">
            {auditoria.descripcion}
          </p>
        )}
      </div>

      <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-2.5 justify-end">
        <button
          type="button"
          onClick={() => onVerDetalles(auditoria)}
          className={`p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500 ${baseBtn}`}
          title="Ver detalles"
          aria-label={`Ver detalles del registro ${formatearEvento(auditoria.evento)}`}
        >
          <Eye size={16} />
        </button>
      </div>
    </article>
  );
};
