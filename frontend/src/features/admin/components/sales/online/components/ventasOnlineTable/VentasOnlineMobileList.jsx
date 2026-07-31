import { Calendar, Clock, CreditCard, User } from "lucide-react";
import { EstadoChip } from "./EstadoChip";
import { EstadoInlineSelect } from "./EstadoInlineSelect";
import { VentasOnlineActions } from "./VentasOnlineActions";

export const VentasOnlineMobileList = ({
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
      className="space-y-4 lg:hidden"
      role="list"
      aria-label="Lista de ventas online"
    >
      {items.map((venta) => (
        <article
          key={venta.idVentaO}
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:border-primary-300 hover:shadow-md active:scale-[0.998]"
          aria-label={`Venta online ${venta.idVentaO} de ${venta.nombreCliente} ${venta.apellidoCliente}`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-gray-100 bg-linear-to-r from-gray-50/80 to-primary-50/35 p-4">
            <div className="flex-1 min-w-0">
              <span className="rounded-md bg-white px-2 py-0.5 text-xs font-mono text-gray-500 ring-1 ring-gray-200">
                #{venta.idVentaO}
              </span>
              <p className="text-base font-semibold text-gray-900 truncate mt-1">
                <User
                  size={14}
                  className="inline mr-1 text-gray-400"
                  aria-hidden="true"
                />
                {venta.nombreCliente} {venta.apellidoCliente}
              </p>
            </div>
            <EstadoChip estado={venta.estado} />
          </div>

          <div className="space-y-2.5 p-4">
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

            <div className="grid grid-cols-2 gap-2.5 text-sm">
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Método
                </p>
                <p className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 font-semibold text-gray-900 capitalize">
                  <CreditCard
                    size={14}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                  {venta.metodoPago}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Total
                </p>
                <p className="text-3xl leading-none font-black text-primary-700">
                  {formatearMoneda(venta.totalPago)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Estado
              </p>
              <EstadoInlineSelect
                value={venta.estado}
                onChange={(nextValue) =>
                  onEstadoChange(venta.idVentaO, nextValue)
                }
              />
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Acciones
            </p>
            <div className="flex gap-2">
              <VentasOnlineActions
                className="
                  flex h-11 min-w-11 flex-1 items-center justify-center rounded-xl border border-white/80 shadow-sm
                  transition-colors cursor-pointer
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                "
                iconSize={18}
                permisos={permisos}
                venta={venta}
                onEditar={onEditar}
                onPrintTicket={onPrintTicket}
                tone="strong"
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
