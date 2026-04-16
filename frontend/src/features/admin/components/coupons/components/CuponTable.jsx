import { motion } from "framer-motion";
import { Power, Trash2 } from "lucide-react";
import {
  formatearFecha,
  getBadgeColor,
  getTipoUsuarioBadge,
} from "../utils/formatters";

const TIPO_USUARIO_LABEL = { todos: "Todos", nuevo: "Nuevos", vip: "VIP" };

export const CuponTable = ({ cupones, onCambiarEstado, onEliminar }) => (
  <div className="overflow-x-auto">
    <table className="w-full" aria-label="Lista de cupones">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          {[
            "Código",
            "Descuento",
            "Audiencia",
            "Vigencia",
            "Usos",
            "Estado",
            "",
          ].map((col) => (
            <th
              key={col}
              scope="col"
              className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 ${
                col === "" ? "w-20" : "text-left"
              }`}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {cupones.map((cupon, index) => {
          const esActivo = cupon.estado === "activo";
          const pctUso = cupon.usoMaximo
            ? Math.min(((cupon.vecesUsado || 0) / cupon.usoMaximo) * 100, 100)
            : null;

          return (
            <motion.tr
              key={cupon.idCupon}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className="group transition-colors hover:bg-gray-50/80"
            >
              <td className="px-4 py-2.5">
                <p className="text-sm font-bold text-gray-900 tracking-wide">
                  {cupon.codigo}
                </p>
                {cupon.descripcion && (
                  <p className="truncate max-w-[180px] text-xs text-gray-400 mt-0.5">
                    {cupon.descripcion}
                  </p>
                )}
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className="text-sm font-bold text-orange-600">
                  {cupon.tipoCupon === "porcentaje"
                    ? `${cupon.valorDescuento}%`
                    : `$${cupon.valorDescuento}`}
                </span>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getTipoUsuarioBadge(cupon.tipoUsuario)}`}
                >
                  {TIPO_USUARIO_LABEL[cupon.tipoUsuario] ?? cupon.tipoUsuario}
                </span>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <p className="text-xs text-gray-600">
                  {formatearFecha(cupon.fechaInicio)}
                </p>
                <p className="text-xs text-gray-400">
                  → {formatearFecha(cupon.fechaVencimiento)}
                </p>
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <p className="text-xs font-medium text-gray-700">
                  {cupon.vecesUsado || 0} / {cupon.usoMaximo || "∞"}
                </p>
                {pctUso !== null && (
                  <div
                    className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-gray-100"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${pctUso}%` }}
                    />
                  </div>
                )}
              </td>

              <td className="px-4 py-2.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getBadgeColor(cupon.estado)}`}
                >
                  {cupon.estado}
                </span>
              </td>

              <td className="px-4 py-2.5">
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => onCambiarEstado(cupon.idCupon, cupon.estado)}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                      esActivo
                        ? "border-gray-200 bg-white text-gray-500 hover:bg-gray-100 focus-visible:ring-gray-400"
                        : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 focus-visible:ring-green-500"
                    }`}
                    aria-label={`${esActivo ? "Desactivar" : "Activar"} cupón ${cupon.codigo}`}
                    title={esActivo ? "Desactivar" : "Activar"}
                  >
                    <Power size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEliminar(cupon.idCupon)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                    aria-label={`Eliminar cupón ${cupon.codigo}`}
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
);
