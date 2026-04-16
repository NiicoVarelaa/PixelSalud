import { motion } from "framer-motion";
import { Eye, Clock } from "lucide-react";
import {
  formatearFecha,
  formatearEvento,
  getEventoBadgeColor,
  getRolBadgeColor,
} from "../utils/helpers";

const COL_HEADERS = [
  "Fecha/Hora",
  "Evento",
  "Módulo",
  "Usuario",
  "Descripción",
  "",
];

export const AuditoriaTable = ({ auditorias, onVerDetalles }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" aria-label="Registros de auditoría">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {COL_HEADERS.map((col) => (
              <th
                key={col}
                scope="col"
                className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 ${
                  col === "" ? "w-12" : "text-left"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {auditorias.map((auditoria, index) => (
            <motion.tr
              key={auditoria.idAuditoria}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className="group transition-colors hover:bg-gray-50/80"
            >
              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Clock
                    size={11}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                  {formatearFecha(auditoria.fechaHora)}
                </span>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getEventoBadgeColor(auditoria.evento)}`}
                >
                  {formatearEvento(auditoria.evento)}
                </span>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize">
                  {auditoria.modulo}
                </span>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <p className="text-xs font-medium text-gray-900">
                  {auditoria.nombreUsuario || "N/A"}
                </p>
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0 text-[11px] font-semibold ${getRolBadgeColor(auditoria.tipoUsuario)}`}
                >
                  {auditoria.tipoUsuario}
                </span>
              </td>

              <td className="px-4 py-2.5 max-w-60">
                <p className="truncate text-xs text-gray-500">
                  {auditoria.descripcion || "—"}
                </p>
              </td>

              <td className="px-4 py-2.5 text-center">
                <button
                  type="button"
                  onClick={() => onVerDetalles(auditoria)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 mx-auto"
                  aria-label={`Ver detalles del registro ${formatearEvento(auditoria.evento)}`}
                  title="Ver detalles"
                >
                  <Eye size={13} aria-hidden="true" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
