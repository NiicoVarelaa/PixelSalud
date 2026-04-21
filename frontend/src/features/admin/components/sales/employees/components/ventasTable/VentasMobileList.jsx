import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  User,
  XCircle,
} from "lucide-react";
import { VentaActions } from "./VentaActions";

export const VentasMobileList = ({
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
      className="lg:hidden space-y-3"
      role="list"
      aria-label="Lista de ventas"
    >
      {items.map((venta) => {
        const esAnulada = venta.estado === "anulada";

        return (
          <article
            key={venta.idVentaE}
            className={`
              bg-white rounded-lg shadow-sm border-2 transition-all
              ${esAnulada ? "border-red-200 bg-red-50/30" : "border-gray-200 hover:border-primary-300 hover:shadow-md"}
            `}
            aria-label={`Venta ${venta.idVentaE} de ${venta.nombreEmpleado} ${venta.apellidoEmpleado}`}
          >
            <div
              className={`flex items-start justify-between gap-3 p-4 border-b ${esAnulada ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50/50"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-mono text-gray-500"
                    aria-label={`ID de venta ${venta.idVentaE}`}
                  >
                    #{venta.idVentaE}
                  </span>
                  <span
                    className={`
                      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                      ${esAnulada ? "bg-red-100 text-red-800" : "bg-primary-100 text-primary-800"}
                    `}
                    role="status"
                  >
                    {esAnulada ? (
                      <XCircle size={12} aria-hidden="true" />
                    ) : (
                      <CheckCircle2 size={12} aria-hidden="true" />
                    )}
                    {venta.estado}
                  </span>
                </div>
                <p className="text-base font-semibold text-gray-900 truncate">
                  <User
                    size={14}
                    className="inline mr-1 text-gray-400"
                    aria-hidden="true"
                  />
                  {venta.nombreEmpleado} {venta.apellidoEmpleado}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500 mb-0.5">Total</p>
                <p className="text-lg font-bold text-primary-700">
                  {formatearMoneda(venta.totalPago)}
                </p>
              </div>
            </div>

            <div className="p-4 space-y-2.5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">DNI</p>
                  <p className="font-mono text-gray-900">
                    {venta.dniEmpleado || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Método</p>
                  <p className="inline-flex items-center gap-1 font-medium text-gray-900">
                    <CreditCard
                      size={14}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="capitalize">{venta.metodoPago}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Fecha</p>
                  <p className="inline-flex items-center gap-1 text-gray-900">
                    <Calendar
                      size={14}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                    {formatearFecha(venta.fechaPago)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Hora</p>
                  <p className="inline-flex items-center gap-1 font-mono text-gray-900">
                    <Clock
                      size={14}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                    {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-100">
              <VentaActions
                className="flex items-center justify-center w-11 h-11 text-white rounded-lg"
                iconSize={18}
                permisos={permisos}
                venta={venta}
                onAnular={onAnular}
                onEditar={onEditar}
                onPrintTicket={onPrintTicket}
                onReactivar={onReactivar}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
};
