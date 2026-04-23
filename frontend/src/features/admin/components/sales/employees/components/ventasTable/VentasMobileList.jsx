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
      className="space-y-4 lg:hidden"
      role="list"
      aria-label="Lista de ventas"
    >
      {items.map((venta) => {
        const esAnulada = venta.estado === "anulada";

        return (
          <article
            key={venta.idVentaE}
            className={`
              overflow-hidden rounded-3xl border bg-white shadow-sm ring-1 ring-gray-100 transition-all
              ${
                esAnulada
                  ? "border-red-200 bg-red-50/30"
                  : "border-gray-200 hover:border-primary-300 hover:shadow-md active:scale-[0.998]"
              }
            `}
            aria-label={`Venta ${venta.idVentaE} de ${venta.nombreEmpleado} ${venta.apellidoEmpleado}`}
          >
            <div
              className={`flex items-start justify-between gap-3 border-b p-4 ${
                esAnulada
                  ? "border-red-200 bg-red-50"
                  : "border-gray-100 bg-linear-to-r from-gray-50/80 to-primary-100/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="rounded-md bg-white px-2 py-0.5 text-xs font-mono text-gray-500 ring-1 ring-gray-200"
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
                <p className="truncate text-base font-semibold text-gray-900">
                  <User
                    size={14}
                    className="inline mr-1 text-gray-400"
                    aria-hidden="true"
                  />
                  {venta.nombreEmpleado} {venta.apellidoEmpleado}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-500">
                  Total
                </p>
                <p className="text-3xl leading-none font-black text-primary-700">
                  {formatearMoneda(venta.totalPago)}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 p-4">
              <div className="grid grid-cols-2 gap-2.5 text-sm">
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    DNI
                  </p>
                  <p className="font-mono text-[15px] text-gray-900">
                    {venta.dniEmpleado || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Método
                  </p>
                  <p className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 font-semibold text-gray-900">
                    <CreditCard
                      size={14}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="capitalize">{venta.metodoPago}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-sm">
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Fecha
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-[15px] text-gray-900">
                    <Calendar
                      size={14}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                    {formatearFecha(venta.fechaPago)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Hora
                  </p>
                  <p className="inline-flex items-center gap-1.5 font-mono text-[15px] text-gray-900">
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

            <div className="border-t border-gray-100 bg-gray-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Acciones
              </p>
              <div className="flex gap-2">
                <VentaActions
                  className="flex h-11 min-w-11 flex-1 items-center justify-center rounded-xl border border-white/80 shadow-sm"
                  iconSize={18}
                  permisos={permisos}
                  venta={venta}
                  onAnular={onAnular}
                  onEditar={onEditar}
                  onPrintTicket={onPrintTicket}
                  onReactivar={onReactivar}
                  tone="strong"
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
