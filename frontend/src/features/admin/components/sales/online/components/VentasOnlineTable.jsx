import { useMemo } from "react";
import {
  Eye,
  Edit,
  Printer,
  User,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@store/useAuthStore";
import { useVentasOnlineStore } from "../store/useVentasOnlineStore";

const normalizeEstado = (estado) => String(estado || "").toLowerCase();

const EstadoChip = ({ estado }) => {
  const estadoNormalizado = normalizeEstado(estado);

  if (estadoNormalizado === "retirado") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800"
        role="status"
      >
        <CheckCircle2 size={14} aria-hidden="true" />
        Retirado
      </span>
    );
  }

  if (estadoNormalizado === "pendiente") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"
        role="status"
      >
        <AlertCircle size={14} aria-hidden="true" />
        Pendiente
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
      role="status"
    >
      <XCircle size={14} aria-hidden="true" />
      Cancelado
    </span>
  );
};

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
    filtroOrden,
    paginaActual,
    itemsPorPagina,
  } = useVentasOnlineStore();

  const parseHora = (horaRaw) => {
    if (!horaRaw) {
      return { horas: 0, minutos: 0, segundos: 0 };
    }

    const [h = "0", m = "0", s = "0"] = String(horaRaw).split(":");

    return {
      horas: Number.parseInt(h, 10) || 0,
      minutos: Number.parseInt(m, 10) || 0,
      segundos: Number.parseInt(s, 10) || 0,
    };
  };

  const parseVentaTimestamp = (venta) => {
    const fechaRaw = String(venta?.fechaPago || "").trim();
    const horaRaw = String(venta?.horaPago || "").trim();
    const { horas, minutos, segundos } = parseHora(horaRaw);

    if (!fechaRaw) {
      return 0;
    }

    const matchIsoSimple = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(fechaRaw);
    if (matchIsoSimple) {
      const [, y, mo, d] = matchIsoSimple;
      return new Date(
        Number(y),
        Number(mo) - 1,
        Number(d),
        horas,
        minutos,
        segundos,
      ).getTime();
    }

    const matchLatam = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(fechaRaw);
    if (matchLatam) {
      const [, d, mo, y] = matchLatam;
      return new Date(
        Number(y),
        Number(mo) - 1,
        Number(d),
        horas,
        minutos,
        segundos,
      ).getTime();
    }

    const parsed = new Date(fechaRaw);
    if (Number.isNaN(parsed.getTime())) {
      return 0;
    }

    if (horaRaw) {
      parsed.setHours(horas, minutos, segundos, 0);
    }

    return parsed.getTime();
  };

  const itemsActuales = useMemo(() => {
    const ventasFiltradas = ventas.filter((v) => {
      const txt = filtro.toLowerCase();
      const nombre = (v.nombreCliente || "").toLowerCase();
      const apellido = (v.apellidoCliente || "").toLowerCase();
      const nombreCompleto = `${nombre} ${apellido}`;
      const id = v.idVentaO?.toString() || "";
      const dni = v.dniCliente?.toString() || "";

      const coincideBusqueda =
        nombreCompleto.includes(txt) || id.includes(txt) || dni.includes(txt);

      const estadoVenta = normalizeEstado(v.estado);
      const estadoFiltro = normalizeEstado(filtroEstado);
      const coincideEstado =
        estadoFiltro === "todas" ? true : estadoVenta === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });

    const ventasOrdenadas = [...ventasFiltradas].sort((a, b) => {
      const fechaA = parseVentaTimestamp(a);
      const fechaB = parseVentaTimestamp(b);

      if (fechaA === fechaB) {
        return Number(b.idVentaO || 0) - Number(a.idVentaO || 0);
      }

      if (filtroOrden === "mas_viejo") {
        return fechaA - fechaB;
      }

      return fechaB - fechaA;
    });

    const indiceUltimo = paginaActual * itemsPorPagina;
    return ventasOrdenadas.slice(indiceUltimo - itemsPorPagina, indiceUltimo);
  }, [ventas, filtro, filtroEstado, filtroOrden, paginaActual, itemsPorPagina]);

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
            Cargando pedidos online...
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
          {filtro || normalizeEstado(filtroEstado) !== "todas"
            ? "Intenta ajustar los filtros de búsqueda"
            : "No hay ventas online registradas todavía"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="lg:hidden space-y-3"
        role="list"
        aria-label="Lista de ventas online"
      >
        {itemsActuales.map((venta) => (
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
                <div className="relative">
                  <select
                    value={normalizeEstado(venta.estado)}
                    onChange={(e) =>
                      onEstadoChange(venta.idVentaO, e.target.value)
                    }
                    className="
                      w-full h-10 px-3 pr-9 text-sm font-semibold rounded-xl border border-gray-200
                      cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500
                      bg-white text-gray-700 appearance-none
                    "
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="retirado">Retirado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => onVerDetalle(venta)}
                className="
                  flex-1 flex items-center justify-center gap-2 h-11
                  bg-primary-600 hover:bg-primary-700 text-white rounded-lg
                  font-medium text-sm transition-colors cursor-pointer
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                "
                aria-label={`Ver detalle de venta online ${venta.idVentaO}`}
              >
                <Eye size={18} aria-hidden="true" />
                <span>Detalle</span>
              </button>

              <button
                onClick={() => onPrintTicket(venta.idVentaO)}
                className="
                  flex items-center justify-center w-11 h-11
                  bg-orange-500 hover:bg-orange-600 text-white rounded-lg
                  transition-colors cursor-pointer
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
                "
                aria-label={`Imprimir ticket de venta online ${venta.idVentaO}`}
              >
                <Printer size={18} aria-hidden="true" />
              </button>

              {!!permisos.modificar_ventasO && (
                <button
                  onClick={() => onEditar(venta)}
                  className="
                    flex items-center justify-center w-11 h-11
                    bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg
                    transition-colors cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2
                  "
                  aria-label={`Editar venta online ${venta.idVentaO}`}
                >
                  <Edit size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <div
        className="hidden lg:block bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden"
        role="region"
        aria-label="Tabla de ventas online"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-primary-50 to-emerald-50/70 border-b border-primary-100/80">
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Metodo
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {itemsActuales.map((venta) => (
                <tr
                  key={venta.idVentaO}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-sm font-mono text-gray-600">
                    #{venta.idVentaO}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <User size={16} className="text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {venta.nombreCliente} {venta.apellidoCliente}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-mono text-gray-700">
                    {venta.dniCliente || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {formatearFecha(venta.fechaPago)}
                  </td>
                  <td className="px-4 py-4 text-sm font-mono text-gray-700">
                    {venta.horaPago ? venta.horaPago.slice(0, 5) : "-"}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium capitalize">
                      <CreditCard size={14} aria-hidden="true" />
                      {venta.metodoPago}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-primary-700">
                    {formatearMoneda(venta.totalPago)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="relative inline-block">
                      <select
                        value={normalizeEstado(venta.estado)}
                        onChange={(e) =>
                          onEstadoChange(venta.idVentaO, e.target.value)
                        }
                        className="
                          h-9 pl-3 pr-8 text-xs font-semibold rounded-full border border-gray-200
                          cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500
                          bg-white text-gray-700 appearance-none
                        "
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="retirado">Retirado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onVerDetalle(venta)}
                        className="
                          p-2 bg-primary-100 text-primary-700 rounded-lg
                          hover:bg-primary-200 transition-colors cursor-pointer
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                        "
                        aria-label={`Ver detalle de venta online ${venta.idVentaO}`}
                        title="Ver detalle"
                      >
                        <Eye size={16} aria-hidden="true" />
                      </button>

                      <button
                        onClick={() => onPrintTicket(venta.idVentaO)}
                        className="
                          p-2 bg-orange-100 text-orange-700 rounded-lg
                          hover:bg-orange-200 transition-colors cursor-pointer
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                        "
                        aria-label={`Imprimir ticket online ${venta.idVentaO}`}
                        title="Imprimir"
                      >
                        <Printer size={16} aria-hidden="true" />
                      </button>

                      {!!permisos.modificar_ventasO && (
                        <button
                          onClick={() => onEditar(venta)}
                          className="
                            p-2 bg-yellow-100 text-yellow-700 rounded-lg
                            hover:bg-yellow-200 transition-colors cursor-pointer
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
                          "
                          aria-label={`Editar venta online ${venta.idVentaO}`}
                          title="Editar"
                        >
                          <Edit size={16} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
