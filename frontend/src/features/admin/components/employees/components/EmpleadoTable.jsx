import { Edit2, Power, RotateCcw, CheckCircle2, XCircle, Shield, Check } from "lucide-react";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

const PermisoBadge = ({ activo, label }) => (
  <div
    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${
      activo
        ? "bg-green-50 text-green-700 border border-green-100"
        : "bg-gray-50 text-gray-400 border border-gray-100"
    }`}
    title={label}
  >
    {activo ? <Check size={10} /> : null}
    <span className="hidden xl:inline">{label}</span>
  </div>
);

export const EmpleadoTable = ({ empleados, onEditar, onCambiarEstado }) => {
  if (empleados.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <p className="text-gray-600 font-medium text-sm">
          No se encontraron empleados
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
                ID
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Empleado
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                DNI
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Permisos
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
            {empleados.map((empleado) => {
              const esActivo = empleado.activo !== 0 && empleado.activo !== false;
              const permisos = {
                crear: empleado.crear_productos === 1 || empleado.crear_productos === true,
                modificar: empleado.modificar_productos === 1 || empleado.modificar_productos === true,
                ventas: empleado.modificar_ventasE === 1 || empleado.modificar_ventasE === true,
                ver: empleado.ver_ventasTotalesE === 1 || empleado.ver_ventasTotalesE === true,
              };
              const totalPermisos = Object.values(permisos).filter(Boolean).length;

              return (
                <tr
                  key={empleado.idEmpleado}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${!esActivo ? "opacity-60" : ""}`}
                >
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-400">
                      #{empleado.idEmpleado}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {empleado.dniEmpleado || "-"}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <span
                      className="text-sm text-gray-600 truncate block max-w-[200px]"
                      title={empleado.emailEmpleado}
                    >
                      {empleado.emailEmpleado}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Shield size={13} className="text-green-600" />
                      <span className="text-xs font-semibold text-green-600">
                        {totalPermisos}/4
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <PermisoBadge activo={permisos.crear} label="Crear" />
                      <PermisoBadge activo={permisos.modificar} label="Modif." />
                      <PermisoBadge activo={permisos.ventas} label="Ventas" />
                      <PermisoBadge activo={permisos.ver} label="Ver" />
                    </div>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        esActivo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      role="status"
                    >
                      {esActivo ? (
                        <CheckCircle2 size={14} aria-hidden="true" />
                      ) : (
                        <XCircle size={14} aria-hidden="true" />
                      )}
                      {esActivo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => onEditar(empleado)}
                        className={`p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500 ${baseBtn}`}
                        title="Editar"
                        aria-label={`Editar ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
                      >
                        <Edit2 size={16} aria-hidden="true" />
                      </button>

                      {esActivo ? (
                        <button
                          onClick={() => onCambiarEstado(empleado)}
                          className={`p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 ${baseBtn}`}
                          title="Desactivar"
                          aria-label={`Desactivar ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
                        >
                          <Power size={16} aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onCambiarEstado(empleado)}
                          className={`p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500 ${baseBtn}`}
                          title="Reactivar"
                          aria-label={`Reactivar ${empleado.nombreEmpleado} ${empleado.apellidoEmpleado}`}
                        >
                          <RotateCcw size={16} aria-hidden="true" />
                        </button>
                      )}
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
