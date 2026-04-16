import { motion } from "framer-motion";
import { History } from "lucide-react";
import { formatearFecha } from "../utils/formatters";

export const HistorialTable = ({ historial }) => {
  if (historial.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
        role="status"
      >
        <div
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
          aria-hidden="true"
        >
          <History size={22} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700">Sin historial</p>
        <p className="mt-1 text-xs text-gray-400">
          Aún no se han usado cupones
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" aria-label="Historial de uso de cupones">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {["Código", "Cliente", "Descuento", "Fecha", "Venta"].map((col) => (
              <th
                key={col}
                scope="col"
                className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {historial.map((uso, i) => (
            <motion.tr
              key={uso.idUso}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="transition-colors hover:bg-gray-50/80"
            >
              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className="text-sm font-bold text-gray-900 tracking-wide">
                  {uso.codigo}
                </span>
              </td>

              <td className="px-4 py-2.5">
                <p className="text-xs font-medium text-gray-800">
                  {uso.nombreCliente}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[180px]">
                  {uso.emailCliente}
                </p>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <p className="text-sm font-bold text-green-600">
                  ${uso.montoDescuento}
                </p>
                <p className="text-xs text-gray-400">
                  ${uso.montoOriginal} → ${uso.montoFinal}
                </p>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className="text-xs text-gray-500">
                  {formatearFecha(uso.fechaUso)}
                </span>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  #{uso.idVentaO}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
