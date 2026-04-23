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
      className="hidden w-full min-w-0 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm ring-1 ring-gray-100/70 lg:block lg:h-full"
      role="region"
      aria-label="Tabla de ventas online"
    >
      <div className="h-full min-h-0 w-full overflow-auto overscroll-contain touch-pan-x touch-pan-y [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-primary-100/80 bg-linear-to-r from-primary-50 to-emerald-50/70 backdrop-blur-sm">
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                ID
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Cliente
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                DNI
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Fecha
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Hora
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Metodo
              </th>
              <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Total
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Estado
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.map((venta) => (
              <tr
                key={venta.idVentaO}
                className="group transition-colors duration-150 hover:bg-primary-50/30"
              >
                <td className="px-4 py-3.5 font-mono text-gray-600 whitespace-nowrap">
                  #{venta.idVentaO}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100"
                      aria-hidden="true"
                    >
                      <User size={16} className="text-primary-600" />
                    </div>
                    <span className="truncate font-semibold text-gray-900">
                      {venta.nombreCliente} {venta.apellidoCliente}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-gray-700 whitespace-nowrap">
                  {venta.dniCliente || "-"}
                </td>
                <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                  {formatearFecha(venta.fechaPago)}
                </td>
                <td className="px-4 py-3.5 font-mono text-gray-700 whitespace-nowrap">
                  {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 font-medium capitalize text-gray-700">
                    <CreditCard size={14} aria-hidden="true" />
                    {venta.metodoPago}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right text-base font-extrabold text-primary-700 whitespace-nowrap">
                  {formatearMoneda(venta.totalPago)}
                </td>
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <EstadoInlineSelect
                    value={venta.estado}
                    compact
                    onChange={(nextValue) =>
                      onEstadoChange(venta.idVentaO, nextValue)
                    }
                  />
                </td>
                <td className="px-4 py-3.5">
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
