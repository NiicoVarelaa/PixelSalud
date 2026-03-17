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
    <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">
                ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-32">
                DNI
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Permisos
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-28">
                Estado
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-40">
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
                  className={`hover:bg-green-50/50 transition-colors ${!esActivo ? "opacity-70 bg-gray-50" : ""}`}
                >
                  {/* ID */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="text-gray-500 font-mono text-xs">
                      #{empleado.idEmpleado}
                    </span>
                  </td>

                  {/* Nombre completo */}
                  <td className="px-3 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {empleado.nombreEmpleado} {empleado.apellidoEmpleado}
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {empleado.dniEmpleado || "---"}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-3 py-4">
                    <div
                      className="text-sm text-gray-600 truncate max-w-[180px]"
                      title={empleado.emailEmpleado}
                    >
                      {empleado.emailEmpleado}
                    </div>
                  </td>

                  {/* Permisos */}
                  <td className="px-3 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Shield className="text-green-700" size={16} />
                      <span className="text-xs font-semibold text-green-700">
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
                      <PermisoBadge activo={permisos.ver} label="Ver $$" />
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        esActivo
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {esActivo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditar(empleado)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
                        title="Editar Empleado"
                      >
                        <Edit size={14} />
                        Editar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCambiarEstado(empleado)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 text-white text-xs font-medium rounded-md transition-colors shadow-sm ${
                          esActivo
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        title={esActivo ? "Desactivar" : "Activar"}
                      >
                        <Power size={14} />
                        {esActivo ? "Baja" : "Activar"}
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
