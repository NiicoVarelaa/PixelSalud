import { formatearFecha } from "../utils/formatters";

export const HistorialTable = ({ historial }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descuento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Venta
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historial.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <p className="text-gray-500">
                    No hay registros de uso de cupones
                  </p>
                </td>
              </tr>
            ) : (
              historial.map((uso) => (
                <tr key={uso.idUso} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">
                      {uso.codigo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {uso.nombreCliente}
                    </div>
                    <div className="text-sm text-gray-500">
                      {uso.emailCliente}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-green-600">
                        ${uso.montoDescuento}
                      </div>
                      <div className="text-gray-500">
                        ${uso.montoOriginal} → ${uso.montoFinal}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatearFecha(uso.fechaUso)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-blue-600">#{uso.idVentaO}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
