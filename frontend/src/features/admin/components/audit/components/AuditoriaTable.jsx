import { Eye, Clock } from "lucide-react";
import {
  formatearFecha,
  formatearEvento,
  getEventoBadgeColor,
  getRolBadgeColor,
} from "../utils/helpers";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

export const AuditoriaTable = ({ auditorias, onVerDetalles }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-2">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Fecha/Hora
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Evento
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Modulo
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Usuario
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Descripcion
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {auditorias.map((auditoria) => (
              <tr
                key={auditoria.idAuditoria}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock
                      size={12}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                    {formatearFecha(auditoria.fechaHora)}
                  </span>
                </td>

                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getEventoBadgeColor(auditoria.evento)}`}
                  >
                    {formatearEvento(auditoria.evento)}
                  </span>
                </td>

                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 capitalize">
                    {auditoria.modulo}
                  </span>
                </td>

                <td className="px-3 py-2.5 whitespace-nowrap">
                  <p className="text-xs font-medium text-gray-900">
                    {auditoria.nombreUsuario || "N/A"}
                  </p>
                  <span
                    className={`mt-0.5 inline-block rounded-full px-2 py-0 text-xs font-semibold ${getRolBadgeColor(auditoria.tipoUsuario)}`}
                  >
                    {auditoria.tipoUsuario}
                  </span>
                </td>

                <td className="px-3 py-2.5 max-w-60">
                  <p className="truncate text-xs text-gray-500">
                    {auditoria.descripcion || "-"}
                  </p>
                </td>

                <td className="px-3 py-3 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={() => onVerDetalles(auditoria)}
                    className={`p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500 ${baseBtn}`}
                    title="Ver detalles"
                    aria-label={`Ver detalles del registro ${formatearEvento(auditoria.evento)}`}
                  >
                    <Eye size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
