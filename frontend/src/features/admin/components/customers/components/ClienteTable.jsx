import { motion } from "framer-motion";
import { Edit, Power } from "lucide-react";

/**
 * Tabla de clientes para vista de escritorio
 * Muestra todos los clientes en formato tabla
 */
export const ClienteTable = ({ clientes, onEditar, onCambiarEstado }) => {
  return (
    <div className="hidden overflow-hidden rounded-xl bg-white lg:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-20 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cliente
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                DNI
              </th>
              <th className="w-64 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
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
            {clientes.map((cliente, index) => {
              const esActivo = cliente.activo !== 0 && cliente.activo !== false;
              return (
                <motion.tr
                  key={cliente.idCliente}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="transition-colors hover:bg-green-50/40"
                >
                  {/* ID */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-400">
                      #{cliente.idCliente}
                    </span>
                  </td>

                  {/* Nombre completo */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {cliente.nombreCliente} {cliente.apellidoCliente}
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {cliente.dni || "---"}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-4">
                    <div
                      className="text-sm text-gray-600 truncate max-w-[200px]"
                      title={cliente.emailCliente}
                    >
                      {cliente.emailCliente}
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
                        onClick={() => onEditar(cliente)}
                        className="flex items-center gap-1.5 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                        title="Editar Cliente"
                      >
                        <Edit size={16} />
                        Editar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCambiarEstado(cliente)}
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
