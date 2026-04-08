import { motion } from "framer-motion";
import { Edit, Power, Shield, Check, X } from "lucide-react";

/**
 * Tabla de empleados para vista de escritorio
 * Muestra todos los empleados con sus permisos en formato tabla
 */
export const EmpleadoTable = ({ empleados, onEditar, onCambiarEstado }) => {
  /**
   * Componente Badge de Permiso
   */
  const PermisoBadge = ({ activo, label }) => {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
          activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
        }`}
        title={label}
      >
        {activo ? <Check size={12} /> : <X size={12} />}
        <span className="hidden xl:inline">{label}</span>
      </div>
    );
  };

  return (
    <div className="hidden overflow-hidden rounded-xl bg-white lg:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-16 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Empleado
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                DNI
              </th>
              <th className="w-64 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Permisos
              </th>
              <th className="w-32 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Estado
              </th>
              <th className="w-48 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {empleados.map((empleado, index) => {
              const esActivo =
                empleado.activo !== 0 && empleado.activo !== false;

              // Permisos
              const permisos = {
                crear:
                  empleado.crear_productos === 1 ||
                  empleado.crear_productos === true,
                modificar:
                  empleado.modificar_productos === 1 ||
                  empleado.modificar_productos === true,
                ventas:
                  empleado.modificar_ventasE === 1 ||
                  empleado.modificar_ventasE === true,
                ver:
                  empleado.ver_ventasTotalesE === 1 ||
                  empleado.ver_ventasTotalesE === true,
              };

              const totalPermisos =
                Object.values(permisos).filter(Boolean).length;

              return (
                <motion.tr
                  key={empleado.idEmpleado}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`transition-colors hover:bg-green-50/40 ${!esActivo ? "bg-gray-50/40 opacity-70" : ""}`}
                >
                  {/* ID */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-400">
                      #{empleado.idEmpleado}
                    </span>
                  </td>

                  {/* Nombre completo */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {empleado.dniEmpleado || "---"}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-4">
                    <div
                      className="max-w-[200px] truncate text-sm text-gray-600"
                      title={empleado.emailEmpleado}
                    >
                      {empleado.emailEmpleado}
                    </div>
                  </td>

                  {/* Permisos */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Shield className="text-green-600" size={16} />
                      <span className="text-xs font-semibold text-green-600">
                        {totalPermisos}/4
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 justify-center">
                      <PermisoBadge activo={permisos.crear} label="Crear" />
                      <PermisoBadge
                        activo={permisos.modificar}
                        label="Editar"
                      />
                      <PermisoBadge activo={permisos.ventas} label="Ventas" />
                      <PermisoBadge activo={permisos.ver} label="Ver Ventas" />
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        esActivo
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {esActivo ? "✓ Activo" : "✗ Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditar(empleado)}
                        className="flex items-center gap-1.5 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                        title="Editar Empleado"
                      >
                        <Edit size={16} />
                        Editar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCambiarEstado(empleado)}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          esActivo
                            ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                        title={esActivo ? "Desactivar" : "Activar"}
                      >
                        <Power size={16} />
                        {esActivo ? "Desactivar" : "Activar"}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
