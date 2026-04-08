import { motion } from "framer-motion";
import { Percent, Package, Edit2, Power, Trash2 } from "lucide-react";
import { formatearFecha } from "../utils/formatters";

export const CampanaTable = ({
  campanasActuales,
  onEditar,
  onToggleActiva,
  onEliminar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
      role="region"
      aria-label="Tabla de campañas"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {["Campaña", "Tipo", "Descuento", "Vigencia", "Productos", "Estado", ""].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 ${
                    col === "Campaña" ? "text-left" : "text-center"
                  } ${col === "" ? "w-28" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campanasActuales.map((campana, index) => {
              const esDosPorUno = String(campana.tipo || "").toUpperCase() === "2X1";
              return (
                <motion.tr
                  key={campana.idCampana}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.025 }}
                  className="group transition-colors hover:bg-gray-50/80"
                >
                  {/* Campaña */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-6 w-1 rounded-full shrink-0 ${campana.esActiva ? "bg-green-500" : "bg-gray-300"}`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
                          {campana.nombreCampana}
                        </p>
                        {campana.descripcion && (
                          <p className="text-xs text-gray-400 truncate max-w-[220px]">
                            {campana.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {campana.tipo}
                    </span>
                  </td>

                  {/* Descuento */}
                  <td className="px-4 py-3 text-center">
                    {esDosPorUno ? (
                      <span className="text-sm font-bold text-gray-800">2x1</span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-sm font-bold text-orange-600">
                        <Percent size={12} aria-hidden="true" />
                        {campana.porcentajeDescuento}%
                      </span>
                    )}
                  </td>

                  {/* Vigencia */}
                  <td className="px-4 py-3 text-center">
                    <p className="text-xs text-gray-600 whitespace-nowrap">
                      {formatearFecha(campana.fechaInicio)}
                    </p>
                    <p className="text-xs text-gray-400">→</p>
                    <p className="text-xs text-gray-600 whitespace-nowrap">
                      {formatearFecha(campana.fechaFin)}
                    </p>
                  </td>

                  {/* Productos */}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      <Package size={12} aria-hidden="true" />
                      {campana.cantidadProductos || 0}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        campana.esActiva
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${campana.esActiva ? "bg-green-500" : "bg-gray-400"}`}
                        aria-hidden="true"
                      />
                      {campana.esActiva ? "Activa" : "Inactiva"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditar(campana)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        aria-label={`Editar ${campana.nombreCampana}`}
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleActiva(campana)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 ${
                          campana.esActiva
                            ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 focus-visible:ring-red-400"
                            : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 focus-visible:ring-green-500"
                        }`}
                        aria-label={`${campana.esActiva ? "Desactivar" : "Activar"} ${campana.nombreCampana}`}
                        title={campana.esActiva ? "Desactivar" : "Activar"}
                      >
                        <Power size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEliminar(campana)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        aria-label={`Eliminar ${campana.nombreCampana}`}
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
