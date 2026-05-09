import { Power, Trash2, CheckCircle2, XCircle, Clock, Edit2, Eye } from "lucide-react";
import {
  formatearFecha,
  getTipoUsuarioBadge,
} from "../utils/formatters";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

const TIPO_USUARIO_LABEL = { todos: "Todos", nuevo: "Nuevos", vip: "VIP" };

const getEstadoBadge = (estado) => {
  switch (estado) {
    case "activo":
      return { icon: CheckCircle2, cls: "bg-green-100 text-green-800" };
    case "expirado":
      return { icon: Clock, cls: "bg-red-100 text-red-800" };
    default:
      return { icon: XCircle, cls: "bg-gray-100 text-gray-700" };
  }
};

export const CuponTable = ({ cupones, onCambiarEstado, onEliminar, onEditar, onVerDetalle }) => {
  if (cupones.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <p className="text-gray-600 font-medium text-sm">
          No se encontraron cupones
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Intenta ajustar los filtros de busqueda
        </p>
      </div>
    );
  }

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
                Codigo
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Descuento
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Audiencia
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Vigencia
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Usos
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Estado
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
            {cupones.map((cupon) => {
              const esActivo = cupon.estado === "activo";
              const pctUso = cupon.usoMaximo
                ? Math.min(((cupon.vecesUsado || 0) / cupon.usoMaximo) * 100, 100)
                : null;
              const { icon: EstadoIcon, cls: estadoCls } = getEstadoBadge(cupon.estado);

              return (
                <tr
                  key={cupon.idCupon}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 tracking-wide">
                        {cupon.codigo}
                      </p>
                      {cupon.descripcion && (
                        <p className="truncate max-w-[180px] text-xs text-gray-400 mt-0.5">
                          {cupon.descripcion}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="text-sm font-bold text-orange-600">
                      {cupon.tipoCupon === "porcentaje"
                        ? `${cupon.valorDescuento}%`
                        : `$${cupon.valorDescuento}`}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTipoUsuarioBadge(cupon.tipoUsuario)}`}
                    >
                      {TIPO_USUARIO_LABEL[cupon.tipoUsuario] ?? cupon.tipoUsuario}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <p className="text-xs text-gray-600">
                      {formatearFecha(cupon.fechaInicio)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatearFecha(cupon.fechaVencimiento)}
                    </p>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap text-center">
                    <p className="text-xs font-medium text-gray-700">
                      {cupon.vecesUsado || 0} / {cupon.usoMaximo || "∞"}
                    </p>
                    {pctUso !== null && (
                      <div
                        className="mt-1 h-1 w-16 mx-auto overflow-hidden rounded-full bg-gray-100"
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${pctUso}%` }}
                        />
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${estadoCls}`}
                      role="status"
                    >
                      <EstadoIcon size={14} aria-hidden="true" />
                      {cupon.estado}
                    </span>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => onVerDetalle(cupon)}
                        className={`p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:ring-blue-500 ${baseBtn}`}
                        title="Ver detalle"
                        aria-label={`Ver detalle cupon ${cupon.codigo}`}
                      >
                        <Eye size={16} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onEditar(cupon)}
                        className={`p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 focus-visible:ring-amber-500 ${baseBtn}`}
                        title="Editar"
                        aria-label={`Editar cupon ${cupon.codigo}`}
                      >
                        <Edit2 size={16} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onCambiarEstado(cupon.idCupon, cupon.estado)}
                        className={`p-2 rounded-lg ${baseBtn} ${
                          esActivo
                            ? "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500"
                            : "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500"
                        }`}
                        title={esActivo ? "Desactivar" : "Activar"}
                        aria-label={`${esActivo ? "Desactivar" : "Activar"} cupon ${cupon.codigo}`}
                      >
                        <Power size={16} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onEliminar(cupon.idCupon)}
                        className={`p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 ${baseBtn}`}
                        title="Eliminar"
                        aria-label={`Eliminar cupon ${cupon.codigo}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
