import { motion } from "framer-motion";
import { Edit, Power, Shield, Check, X } from "lucide-react";

const PermisoBadge = ({ activo, label }) => (
  <div
    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${
      activo ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-400 border border-gray-100"
    }`}
    title={label}
  >
    {activo
      ? <Check size={10} aria-hidden="true" />
      : <X size={10} aria-hidden="true" />
    }
    <span className="hidden xl:inline">{label}</span>
  </div>
);

export const EmpleadoTable = ({ empleados, onEditar, onCambiarEstado }) => (
  <div className="overflow-x-auto">
    <table className="w-full" aria-label="Lista de empleados">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          {["ID", "Empleado", "DNI", "Email", "Permisos", "Estado", ""].map((col) => (
            <th
              key={col}
              scope="col"
              className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 ${
                ["Permisos", "Estado", ""].includes(col) ? "text-center" : "text-left"
              } ${col === "" ? "w-40" : ""}`}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {empleados.map((empleado, index) => {
          const esActivo = empleado.activo !== 0 && empleado.activo !== false;
          const permisos = {
            crear:    empleado.crear_productos   === 1 || empleado.crear_productos   === true,
            modificar:empleado.modificar_productos=== 1 || empleado.modificar_productos=== true,
            ventas:   empleado.modificar_ventasE  === 1 || empleado.modificar_ventasE  === true,
            ver:      empleado.ver_ventasTotalesE === 1 || empleado.ver_ventasTotalesE === true,
          };
          const totalPermisos = Object.values(permisos).filter(Boolean).length;

          return (
            <motion.tr
              key={empleado.idEmpleado}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.025 }}
              className={`group transition-colors hover:bg-gray-50/80 ${!esActivo ? "opacity-60" : ""}`}
            >
              {/* ID */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`h-5 w-0.5 rounded-full shrink-0 ${esActivo ? "bg-green-500" : "bg-orange-400"}`}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs text-gray-400">
                    #{empleado.idEmpleado}
                  </span>
                </div>
              </td>

              {/* Nombre */}
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                </p>
              </td>

              {/* DNI */}
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-600">
                  {empleado.dniEmpleado || "—"}
                </span>
              </td>

              {/* Email */}
              <td className="px-4 py-3">
                <span
                  className="block max-w-[200px] truncate text-sm text-gray-600"
                  title={empleado.emailEmpleado}
                >
                  {empleado.emailEmpleado}
                </span>
              </td>

              {/* Permisos */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Shield size={13} className="text-green-600" aria-hidden="true" />
                  <span className="text-xs font-semibold text-green-600">{totalPermisos}/4</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  <PermisoBadge activo={permisos.crear}    label="Crear"    />
                  <PermisoBadge activo={permisos.modificar}label="Modificar"/>
                  <PermisoBadge activo={permisos.ventas}   label="Ventas"   />
                  <PermisoBadge activo={permisos.ver}      label="Ver"      />
                </div>
              </td>

              {/* Estado */}
              <td className="px-4 py-3 text-center whitespace-nowrap">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    esActivo
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-orange-50 text-orange-700 border border-orange-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${esActivo ? "bg-green-500" : "bg-orange-400"}`}
                    aria-hidden="true"
                  />
                  {esActivo ? "Activo" : "Inactivo"}
                </span>
              </td>

              {/* Acciones */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditar(empleado)}
                    className="flex h-7 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                    aria-label={`Editar ${empleado.nombreEmpleado}`}
                  >
                    <Edit size={12} aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onCambiarEstado(empleado)}
                    className={`flex h-7 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 ${
                      esActivo
                        ? "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 focus-visible:ring-orange-400"
                        : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus-visible:ring-green-500"
                    }`}
                    aria-label={`${esActivo ? "Desactivar" : "Activar"} ${empleado.nombreEmpleado}`}
                  >
                    <Power size={12} aria-hidden="true" />
                    {esActivo ? "Desactivar" : "Activar"}
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