import { useMemo } from "react";
import { Eye, Edit, Printer } from "lucide-react";
import { useAuthStore } from "@store/useAuthStore";
import { useVentasOnlineStore } from "../../sales/store/useVentasOnlineStore";

export const VentasOnlineTable = ({
  onVerDetalle,
  onEditar,
  onEstadoChange,
  onPrintTicket,
}) => {
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};

  const {
    cargando,
    ventas,
    filtro,
    filtroEstado,
    paginaActual,
    itemsPorPagina,
  } = useVentasOnlineStore();

  // Calcular ventas filtradas y paginadas con useMemo
  const itemsActuales = useMemo(() => {
    // Filtrar ventas
    const ventasFiltradas = ventas.filter((v) => {
      const txt = filtro.toLowerCase();
      const coincide =
        (v.nombreCliente?.toLowerCase() || "").includes(txt) ||
        v.idVentaO?.toString().includes(txt) ||
        (v.dni?.toString() || "").includes(txt);

      const estadoVenta = (v.estado || "").toLowerCase();
      const estadoFiltro = filtroEstado.toLowerCase();
      const coincideEstado =
        filtroEstado === "Todos" ? true : estadoVenta === estadoFiltro;

      return coincide && coincideEstado;
    });

    // Paginar
    const indiceUltimo = paginaActual * itemsPorPagina;
    return ventasFiltradas.slice(indiceUltimo - itemsPorPagina, indiceUltimo);
  }, [ventas, filtro, filtroEstado, paginaActual, itemsPorPagina]);

  const formatearFecha = (fecha) =>
    !fecha ? "-" : new Date(fecha).toLocaleDateString("es-ES");

  const formatearMoneda = (val) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(val) || 0);

  if (cargando) {
    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
      <div className="w-full">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[5%]">
                ID
              </th>
              <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[17%]">
                Cliente
              </th>
              <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">
                DNI
              </th>
              <th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[8%]">
                Detalle
              </th>
              <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">
                Fecha
              </th>
              <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[8%]">
                Hora
              </th>
              <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">
                Método
              </th>
              <th className="px-2 py-3 text-right text-xs font-bold text-gray-600 uppercase w-[11%]">
                Total
              </th>
              <th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[10%]">
                Estado
              </th>
              <th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[11%]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {itemsActuales.length > 0 ? (
              itemsActuales.map((venta) => (
                <tr
                  key={venta.idVentaO}
                  className={`hover:bg-gray-50 transition-colors ${venta.estado === "Cancelado" ? "bg-red-50/50" : ""}`}
                >
                  <td className="px-2 py-3 text-gray-500 font-mono text-xs break-all leading-tight">
                    #{venta.idVentaO}
                  </td>
                  <td className="px-2 py-3 text-sm font-medium text-gray-800 whitespace-normal leading-tight">
                    {venta.nombreCliente} {venta.apellidoCliente}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-600 font-mono truncate">
                    {venta.dniCliente || "-"}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onVerDetalle(venta)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onPrintTicket(venta.idVentaO)}
                        className="p-1.5 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
                        title="Imprimir Ticket"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-600">
                    {formatearFecha(venta.fechaPago)}
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-500 font-mono">
                    {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                  </td>
                  <td className="px-2 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200 capitalize truncate block">
                      {venta.metodoPago}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right text-sm font-bold text-primary-700">
                    {formatearMoneda(venta.totalPago)}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <select
                      value={venta.estado}
                      onChange={(e) =>
                        onEstadoChange(venta.idVentaO, e.target.value)
                      }
                      className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        venta.estado === "Retirado"
                          ? "bg-green-100 text-green-800"
                          : venta.estado === "Pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Retirado">Retirado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      {!!permisos.modificar_ventasO && (
                        <button
                          onClick={() => onEditar(venta)}
                          className="p-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                          title="Editar Venta"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-8 text-center text-gray-400 text-sm"
                >
                  No se encontraron ventas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
