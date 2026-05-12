import { Eye, Edit, Trash2, RotateCcw, Printer, XCircle, CheckCircle2 } from "lucide-react";
import { formatMoneda, formatearFecha, getMetodoPagoUI } from "@features/employee/utils/ventas.utils";

const VentasTableRow = ({ venta, permisos, onVerDetalle, onImprimir, onEditar, onAnular, onReactivar }) => {
  const esAnulada = venta.estado === "anulada";
  const { Icon: MetodoIcon, iconColor } = getMetodoPagoUI(venta.metodoPago);

  return (
    <tr key={venta.idVentaE} className={`transition-colors ${esAnulada ? "bg-red-50/40 hover:bg-red-50" : "hover:bg-green-50/30"}`}>
      <td className="px-4 py-3.5 font-mono text-gray-600 whitespace-nowrap">
        #{String(venta.idVentaE).padStart(3, "0")}
      </td>
      <td className="px-4 py-3.5">
        <span className="font-semibold text-gray-900">{venta.nombreEmpleado} {venta.apellidoEmpleado}</span>
      </td>
      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{formatearFecha(venta.fechaPago)}</td>
      <td className="px-4 py-3.5 font-mono text-gray-700 whitespace-nowrap">
        {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2 text-gray-700 capitalize font-medium">
          <MetodoIcon size={18} className={iconColor} strokeWidth={2} />
          <span>{venta.metodoPago}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-right text-base font-extrabold text-green-700 whitespace-nowrap">
        {formatMoneda(venta.totalPago)}
      </td>
      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${esAnulada ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {esAnulada ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          {venta.estado}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => onVerDetalle(venta.idVentaE)} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer" title="Ver detalle">
            <Eye size={15} />
          </button>
          <button onClick={() => onImprimir(venta.idVentaE)} className="p-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors cursor-pointer" title="Imprimir ticket">
            <Printer size={15} />
          </button>
          {permisos.modificar_ventasE && (
            esAnulada ? (
              <button onClick={() => onReactivar(venta.idVentaE)} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer" title="Reactivar">
                <RotateCcw size={15} />
              </button>
            ) : (
              <>
                <button onClick={() => onEditar(venta.idVentaE)} className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors cursor-pointer" title="Editar">
                  <Edit size={15} />
                </button>
                <button onClick={() => onAnular(venta.idVentaE)} className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer" title="Anular">
                  <Trash2 size={15} />
                </button>
              </>
            )
          )}
        </div>
      </td>
    </tr>
  );
};

export default VentasTableRow;
