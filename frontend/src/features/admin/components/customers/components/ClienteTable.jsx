import { Edit2, Power, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

const baseBtn =
  "transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

export const ClienteTable = ({ clientes, onEditar, onCambiarEstado }) => {
  if (clientes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <p className="text-gray-600 font-medium text-sm">
          No se encontraron clientes
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Intenta ajustar los filtros de busqueda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-3">
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
                Cliente
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
            {clientes.map((cliente) => {
              const esActivo = cliente.activo !== 0 && cliente.activo !== false;
              return (
                <tr
                  key={cliente.idCliente}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-400">
                      #{cliente.idCliente}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {cliente.nombreCliente} {cliente.apellidoCliente}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {cliente.dni || "---"}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <span
                      className="text-sm text-gray-600 truncate block max-w-[200px]"
                      title={cliente.emailCliente}
                    >
                      {cliente.emailCliente}
                    </span>
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
                        onClick={() => onEditar(cliente)}
                        className={`p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus-visible:ring-yellow-500 ${baseBtn}`}
                        title="Editar"
                        aria-label={`Editar ${cliente.nombreCliente} ${cliente.apellidoCliente}`}
                      >
                        <Edit2 size={16} aria-hidden="true" />
                      </button>

                      {esActivo ? (
                        <button
                          onClick={() => onCambiarEstado(cliente)}
                          className={`p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 ${baseBtn}`}
                          title="Desactivar"
                          aria-label={`Desactivar ${cliente.nombreCliente} ${cliente.apellidoCliente}`}
                        >
                          <Power size={16} aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onCambiarEstado(cliente)}
                          className={`p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500 ${baseBtn}`}
                          title="Reactivar"
                          aria-label={`Reactivar ${cliente.nombreCliente} ${cliente.apellidoCliente}`}
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
