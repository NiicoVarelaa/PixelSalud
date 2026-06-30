import { Eye, Edit, Trash2, RotateCcw, Printer, CheckCircle2, XCircle, Clock, CreditCard, Store } from "lucide-react";
import { formatMoneda, formatearFecha, getMetodoPagoUI } from "@features/employee/utils/ventas.utils";

const VentasMobileList = ({ ventas, permisos, onVerDetalle, onImprimir, onEditar, onAnular, onReactivar }) => (
  <div className="space-y-2.5">
    {ventas.map((venta) => {
      const esAnulada = venta.estado === "anulada";
      const { Icon: MetodoIcon, iconColor } = getMetodoPagoUI(venta.metodoPago);

      return (
        <article
          key={venta.idVentaE}
          className={`rounded-xl border overflow-hidden ${
            esAnulada ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-white"
          }`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium text-gray-400">
                    #{String(venta.idVentaE).padStart(3, "0")}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      esAnulada
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {esAnulada ? <XCircle size={10} /> : <CheckCircle2 size={10} />}
                    {venta.estado}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {venta.nombreEmpleado} {venta.apellidoEmpleado}
                </p>
              </div>
              <span className={`text-lg font-extrabold tabular-nums ${esAnulada ? "text-red-400" : "text-green-700"}`}>
                {formatMoneda(venta.totalPago)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gray-300" />
                {formatearFecha(venta.fechaPago)}
              </span>
              <span className="flex items-center gap-1">
                {venta.horaPago?.slice(0, 5) || "-"}
              </span>
              <span className="flex items-center gap-1 capitalize">
                <MetodoIcon size={13} className={iconColor} />
                {venta.metodoPago}
              </span>
            </div>
          </div>

          <div className="flex gap-1.5 border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
            <button onClick={() => onVerDetalle(venta.idVentaE)}
              className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-200 transition-colors cursor-pointer">
              <Eye size={13} /> Ver
            </button>
            <button onClick={() => onImprimir(venta.idVentaE)}
              className="flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-200 transition-colors cursor-pointer">
              <Printer size={13} /> Ticket
            </button>
            {permisos.modificar_ventasE && (
              esAnulada ? (
                <button onClick={() => onReactivar(venta.idVentaE)}
                  className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-200 transition-colors cursor-pointer ml-auto">
                  <RotateCcw size={13} /> Reactivar
                </button>
              ) : (
                <>
                  <button onClick={() => onEditar(venta.idVentaE)}
                    className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 transition-colors cursor-pointer">
                    <Edit size={13} /> Editar
                  </button>
                  <button onClick={() => onAnular(venta.idVentaE)}
                    className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors cursor-pointer ml-auto">
                    <Trash2 size={13} /> Anular
                  </button>
                </>
              )
            )}
          </div>
        </article>
      );
    })}
  </div>
);

export default VentasMobileList;
