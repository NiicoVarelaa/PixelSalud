import { motion } from "framer-motion";
import { Edit, Power } from "lucide-react";

/**
 * Tabla de clientes para vista de escritorio
 * Muestra todos los clientes en formato tabla
 */
export const ClienteTable = ({ clientes, onEditar, onCambiarEstado }) => {
  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-green-600">
              <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-20">
                ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-32">
                DNI
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-64">
                Email
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider w-32">
                Estado
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider w-48">
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
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* ID */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-gray-500 font-mono text-xs">
                      #{cliente.idCliente}
                    </span>
                  </td>

                  {/* Nombre completo */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
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
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        esActivo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
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
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition-colors shadow-md"
                        title="Editar Cliente"
                      >
                        <Edit size={16} />
                        Editar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCambiarEstado(cliente)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm font-medium rounded-md transition-colors shadow-md ${
                          esActivo
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
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
