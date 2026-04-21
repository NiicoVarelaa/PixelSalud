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
      className="lg:hidden space-y-3"
      role="list"
      aria-label="Lista de ventas online"
    >
      {items.map((venta) => (
        <article
          key={venta.idVentaO}
          className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
          aria-label={`Venta online ${venta.idVentaO} de ${venta.nombreCliente} ${venta.apellidoCliente}`}
        >
          <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono text-gray-500">
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
              <p className="text-xs text-gray-500 mt-1">
                DNI: {venta.dniCliente || "-"}
              </p>
            </div>
            <EstadoChip estado={venta.estado} />
          </div>

          <div className="p-4 space-y-2.5">
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

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Método</p>
                <p className="inline-flex items-center gap-1 font-medium text-gray-900 capitalize">
                  <CreditCard
                    size={14}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                  {venta.metodoPago}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Total</p>
                <p className="text-lg font-bold text-primary-700">
                  {formatearMoneda(venta.totalPago)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Estado</p>
              <EstadoInlineSelect
                value={venta.estado}
                onChange={(nextValue) =>
                  onEstadoChange(venta.idVentaO, nextValue)
                }
              />
            </div>
          </div>

          <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-100">
            <VentasOnlineActions
              className="
                flex items-center justify-center w-11 h-11 text-white rounded-lg
                transition-colors cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              "
              iconSize={18}
              permisos={permisos}
              venta={venta}
              onEditar={onEditar}
              onPrintTicket={onPrintTicket}
            />
          </div>
        </article>
      ))}
    </div>
  );
};
