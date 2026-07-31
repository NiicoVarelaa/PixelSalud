import {
  CheckCircle2,
  CreditCard,
  User,
  XCircle,
  Banknote,
  ArrowRightLeft,
} from "lucide-react";
import { VentaActions } from "./VentaActions";

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
  return { Icon: CreditCard, iconColor: "text-gray-400" };
};

export const VentasDesktopTable = ({
  items,
  permisos,
  onAnular,
  onEditar,
  onPrintTicket,
  onReactivar,
  formatearFecha,
  formatearMoneda,
}) => {
  return (
    <div
      className="hidden w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white ring-1 ring-gray-100/70 lg:block mb-8 lg:mb-3"
      role="region"
      aria-label="Tabla de ventas"
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-primary-100/80 bg-linear-to-r from-primary-50 to-emerald-50/70 backdrop-blur-sm">
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                Empleado
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                Hora
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                Método
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((venta) => {
              const esAnulada = venta.estado === "anulada";
              const { Icon: MetodoIcon, iconColor } = getMetodoPagoUI(
                venta.metodoPago,
              );

              return (
                <tr
                  key={venta.idVentaE}
                  className={`group transition-colors duration-150 ${
                    esAnulada
                      ? "bg-red-50/40 hover:bg-red-50"
                      : "hover:bg-primary-50/30"
                  }`}
                >
                  <td className="px-4 py-3.5 font-mono text-gray-600 whitespace-nowrap">
                    #{String(venta.idVentaE).padStart(3, "0")}
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
                        {venta.nombreEmpleado} {venta.apellidoEmpleado}
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
                    <span
                      className={`
                        inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
                        ${esAnulada ? "bg-red-100 text-red-800" : "bg-primary-100 text-primary-800"}
                      `}
                      role="status"
                    >
                      {esAnulada ? (
                        <XCircle size={14} aria-hidden="true" />
                      ) : (
                        <CheckCircle2 size={14} aria-hidden="true" />
                      )}
                      {venta.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <VentaActions
                        className="p-2 rounded-lg"
                        iconSize={16}
                        permisos={permisos}
                        venta={venta}
                        onAnular={onAnular}
                        onEditar={onEditar}
                        onPrintTicket={onPrintTicket}
                        onReactivar={onReactivar}
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
