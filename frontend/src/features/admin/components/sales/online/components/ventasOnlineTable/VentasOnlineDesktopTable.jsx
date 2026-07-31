import {
  CreditCard,
  User,
  Banknote,
  ArrowRightLeft,
  Wallet,
} from "lucide-react";
import { EstadoInlineSelect } from "./EstadoInlineSelect";
import { VentasOnlineActions } from "./VentasOnlineActions";

const getMetodoPagoUI = (metodo) => {
  const normalizado = metodo?.toLowerCase() || "";

  if (normalizado === "efectivo") {
    return { Icon: Banknote, iconColor: "text-emerald-500" };
  }
  if (normalizado === "tarjeta") {
    return { Icon: CreditCard, iconColor: "text-blue-500" };
  }
  if (normalizado === "transferencia") {
    return { Icon: ArrowRightLeft, iconColor: "text-violet-500" };
  }
  if (normalizado === "mercado pago" || normalizado === "mercadopago") {
    return { Icon: Wallet, iconColor: "text-sky-500" };
  }

  return { Icon: CreditCard, iconColor: "text-gray-400" };
};

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
      className="hidden w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white ring-1 ring-gray-100/70 lg:block mb-3"
      role="region"
      aria-label="Tabla de ventas online"
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-primary-100/80 bg-linear-to-r from-primary-50 to-emerald-50/70 backdrop-blur-sm">
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                ID
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Cliente
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
            {items.map((venta) => {
              const { Icon: MetodoIcon, iconColor } = getMetodoPagoUI(
                venta.metodoPago,
              );

              return (
                <tr
                  key={venta.idVentaO}
                  className="group transition-colors duration-150 hover:bg-primary-50/30"
                >
                  <td className="px-4 py-3.5 font-mono text-gray-600 whitespace-nowrap">
                    #{String(venta.idVentaO).padStart(3, "0")}
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
                  <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                    {formatearFecha(venta.fechaPago)}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-gray-700 whitespace-nowrap">
                    {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700 capitalize font-medium">
                      <MetodoIcon
                        size={18}
                        className={iconColor}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{venta.metodoPago}</span>
                    </div>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
