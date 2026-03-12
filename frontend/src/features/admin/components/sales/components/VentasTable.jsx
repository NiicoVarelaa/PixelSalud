import { useMemo } from "react";
import {
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Printer,
  User,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@store/useAuthStore";
import { useVentasStore } from "../store/useVentasStore";

export const VentasTable = ({
  onVerDetalle,
  onEditar,
  onAnular,
  onReactivar,
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
  } = useVentasStore();

  // Calcular ventas filtradas y paginadas con useMemo
  const itemsActuales = useMemo(() => {
    const ventasFiltradas = ventas.filter((v) => {
      const termino = filtro.toLowerCase();
      const id = v.idVentaE?.toString() || "";
      const dni = v.dniEmpleado?.toString() || "";
      const nombre = v.nombreEmpleado?.toLowerCase() || "";
      const apellido = v.apellidoEmpleado?.toLowerCase() || "";
      const nombreCompleto = `${nombre} ${apellido}`;

      const coincideBusqueda =
        id.includes(termino) ||
        dni.includes(termino) ||
        nombreCompleto.includes(termino);
      const coincideEstado =
        filtroEstado === "todas" ? true : v.estado === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });

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
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
        role="status"
        aria-live="polite"
      >
        <div className="p-8 sm:p-12 text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 border-primary-600 border-t-transparent mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Cargando ventas...
          </p>
        </div>
      </div>
    );
  }

  if (itemsActuales.length === 0) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center"
        role="status"
      >
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          No se encontraron ventas
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          {filtro || filtroEstado !== "todas"
            ? "Intenta ajustar los filtros de búsqueda"
            : "No hay ventas registradas todavía"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* VISTA MOBILE: Cards (< lg) */}
      <div
        className="lg:hidden space-y-3"
        role="list"
        aria-label="Lista de ventas"
      >
        {itemsActuales.map((venta) => {
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
              {/* Header del card */}
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

                {/* Total destacado */}
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500 mb-0.5">Total</p>
                  <p className="text-lg font-bold text-primary-700">
                    {formatearMoneda(venta.totalPago)}
                  </p>
                </div>
              </div>

              {/* Cuerpo del card: Información */}
              <div className="p-4 space-y-2.5">
                {/* DNI y Método de pago */}
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

                {/* Fecha y Hora */}
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

              {/* Footer: Acciones */}
              <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-100">
                {/* Ver detalle */}
                <button
                  onClick={() => onVerDetalle(venta.idVentaE)}
                  className="
                    flex-1 flex items-center justify-center gap-2 h-11
                    bg-primary-600 hover:bg-primary-700 text-white rounded-lg
                    font-medium text-sm transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                  "
                  aria-label={`Ver detalle de venta ${venta.idVentaE}`}
                >
                  <Eye size={18} aria-hidden="true" />
                  <span>Detalle</span>
                </button>

                {/* Imprimir */}
                <button
                  onClick={() => onPrintTicket(venta.idVentaE)}
                  className="
                    flex items-center justify-center w-11 h-11
                    bg-orange-500 hover:bg-orange-600 text-white rounded-lg
                    transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
                  "
                  aria-label={`Imprimir ticket de venta ${venta.idVentaE}`}
                >
                  <Printer size={18} aria-hidden="true" />
                </button>

                {/* Acciones condicionales */}
                {venta.estado === "completada" ? (
                  <>
                    {!!permisos.modificar_ventasE && (
                      <>
                        <button
                          onClick={() => onEditar(venta)}
                          className="
                            flex items-center justify-center w-11 h-11
                            bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg
                            transition-colors
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2
                          "
                          aria-label={`Editar venta ${venta.idVentaE}`}
                        >
                          <Edit size={18} aria-hidden="true" />
                        </button>

                        <button
                          onClick={() => onAnular(venta.idVentaE)}
                          className="
                            flex items-center justify-center w-11 h-11
                            bg-red-500 hover:bg-red-600 text-white rounded-lg
                            transition-colors
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
                          "
                          aria-label={`Anular venta ${venta.idVentaE}`}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  !!permisos.modificar_ventasE && (
                    <button
                      onClick={() => onReactivar(venta.idVentaE)}
                      className="
                        flex items-center justify-center w-11 h-11
                        bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                        transition-colors
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                      "
                      aria-label={`Reactivar venta ${venta.idVentaE}`}
                    >
                      <RotateCcw size={18} aria-hidden="true" />
                    </button>
                  )
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* VISTA DESKTOP: Tabla (≥ lg) */}
      <div
        className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        role="region"
        aria-label="Tabla de ventas"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-100">
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Empleado
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  DNI
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Hora
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Método
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {itemsActuales.map((venta) => {
                const esAnulada = venta.estado === "anulada";

                return (
                  <tr
                    key={venta.idVentaE}
                    className={`
                      transition-colors
                      ${esAnulada ? "bg-red-50/40" : "hover:bg-gray-50"}
                    `}
                  >
                    <td className="px-4 py-3.5 text-sm font-mono text-gray-600">
                      #{venta.idVentaE}
                    </td>
                    <td className="px-4 py-3.5">
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
                    <td className="px-4 py-3.5 text-sm font-mono text-gray-700">
                      {venta.dniEmpleado || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {formatearFecha(venta.fechaPago)}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-mono text-gray-700">
                      {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium capitalize">
                        <CreditCard size={14} aria-hidden="true" />
                        {venta.metodoPago}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm font-bold text-primary-700">
                      {formatearMoneda(venta.totalPago)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
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
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onVerDetalle(venta.idVentaE)}
                          className="
                            p-2 bg-primary-100 text-primary-700 rounded-lg
                            hover:bg-primary-200 transition-colors
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                          "
                          aria-label={`Ver detalle de venta ${venta.idVentaE}`}
                          title="Ver detalle"
                        >
                          <Eye size={16} aria-hidden="true" />
                        </button>

                        <button
                          onClick={() => onPrintTicket(venta.idVentaE)}
                          className="
                            p-2 bg-orange-100 text-orange-700 rounded-lg
                            hover:bg-orange-200 transition-colors
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                          "
                          aria-label={`Imprimir ticket ${venta.idVentaE}`}
                          title="Imprimir"
                        >
                          <Printer size={16} aria-hidden="true" />
                        </button>

                        {venta.estado === "completada" ? (
                          <>
                            {!!permisos.modificar_ventasE && (
                              <>
                                <button
                                  onClick={() => onEditar(venta)}
                                  className="
                                    p-2 bg-yellow-100 text-yellow-700 rounded-lg
                                    hover:bg-yellow-200 transition-colors
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
                                  "
                                  aria-label={`Editar venta ${venta.idVentaE}`}
                                  title="Editar"
                                >
                                  <Edit size={16} aria-hidden="true" />
                                </button>

                                <button
                                  onClick={() => onAnular(venta.idVentaE)}
                                  className="
                                    p-2 bg-red-100 text-red-700 rounded-lg
                                    hover:bg-red-200 transition-colors
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                                  "
                                  aria-label={`Anular venta ${venta.idVentaE}`}
                                  title="Anular"
                                >
                                  <Trash2 size={16} aria-hidden="true" />
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          !!permisos.modificar_ventasE && (
                            <button
                              onClick={() => onReactivar(venta.idVentaE)}
                              className="
                                p-2 bg-primary-100 text-primary-700 rounded-lg
                                hover:bg-primary-200 transition-colors
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                              "
                              aria-label={`Reactivar venta ${venta.idVentaE}`}
                              title="Reactivar"
                            >
                              <RotateCcw size={16} aria-hidden="true" />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
