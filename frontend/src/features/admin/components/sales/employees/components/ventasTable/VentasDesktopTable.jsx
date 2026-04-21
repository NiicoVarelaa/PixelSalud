import { CheckCircle2, CreditCard, User, XCircle } from "lucide-react";
import { VentaActions } from "./VentaActions";

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
      className="hidden overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-md lg:block"
      role="region"
      aria-label="Tabla de ventas"
    >
      <div className="max-h-[410px] overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-primary-50 to-emerald-50/70 border-b border-primary-100/80">
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Empleado
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                DNI
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Hora
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Método
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((venta) => {
              const esAnulada = venta.estado === "anulada";

              return (
                <tr
                  key={venta.idVentaE}
                  className={`transition-colors ${esAnulada ? "bg-red-50/40" : "hover:bg-gray-50"}`}
                >
                  <td className="px-3 py-3 text-sm font-mono text-gray-600">
                    #{venta.idVentaE}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <User size={16} className="text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {venta.nombreEmpleado} {venta.apellidoEmpleado}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-mono text-gray-700">
                    {venta.dniEmpleado || "-"}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {formatearFecha(venta.fechaPago)}
                  </td>
                  <td className="px-3 py-3 text-sm font-mono text-gray-700">
                    {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium capitalize">
                      <CreditCard size={14} aria-hidden="true" />
                      {venta.metodoPago}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-primary-700">
                    {formatearMoneda(venta.totalPago)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
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
                  <td className="px-3 py-3">
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
