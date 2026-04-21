import { CreditCard, User } from "lucide-react";
import { EstadoInlineSelect } from "./EstadoInlineSelect";
import { VentasOnlineActions } from "./VentasOnlineActions";

export const VentasOnlineDesktopTable = ({
  items,
  permisos,
  onEditar,
  onEstadoChange,
  onPrintTicket,
  formatearFecha,
  formatearMoneda,
}) => {
  return (
    <div
      className="hidden overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-md lg:block"
      role="region"
      aria-label="Tabla de ventas online"
    >
      <div className="max-h-[410px] overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-primary-50 to-emerald-50/70 border-b border-primary-100/80">
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                DNI
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Hora
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Metodo
              </th>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {items.map((venta) => (
              <tr
                key={venta.idVentaO}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-4 py-4 text-sm font-mono text-gray-600">
                  #{venta.idVentaO}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <User size={16} className="text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {venta.nombreCliente} {venta.apellidoCliente}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-mono text-gray-700">
                  {venta.dniCliente || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {formatearFecha(venta.fechaPago)}
                </td>
                <td className="px-4 py-4 text-sm font-mono text-gray-700">
                  {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium capitalize">
                    <CreditCard size={14} aria-hidden="true" />
                    {venta.metodoPago}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-sm font-bold text-primary-700">
                  {formatearMoneda(venta.totalPago)}
                </td>
                <td className="px-4 py-4 text-center">
                  <EstadoInlineSelect
                    value={venta.estado}
                    compact
                    onChange={(nextValue) =>
                      onEstadoChange(venta.idVentaO, nextValue)
                    }
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <VentasOnlineActions
                      className="
                        p-2 rounded-lg transition-colors cursor-pointer
                        focus:outline-none focus-visible:ring-2
                      "
                      iconSize={16}
                      permisos={permisos}
                      venta={venta}
                      onEditar={onEditar}
                      onPrintTicket={onPrintTicket}
                      showTitles
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
