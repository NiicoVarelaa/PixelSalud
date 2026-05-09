import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Tag, Calendar, Percent, DollarSign, CheckCircle2, XCircle, Clock, History, User } from "lucide-react";
import { useAuthStore } from "@store/useAuthStore";
import axios from "axios";

const getEstadoBadge = (enOferta) => {
  if (enOferta) return { icon: CheckCircle2, cls: "bg-green-100 text-green-800" };
  return { icon: XCircle, cls: "bg-gray-100 text-gray-700" };
};

const DetailRow = ({ Icon, label, value }) => {
  const IconEl = Icon;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <IconEl size={14} className="text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
};

const getAccionBadge = (accion) => {
  switch (accion) {
    case "ACTIVADA":
      return { cls: "bg-green-100 text-green-700 border-green-200", label: "Activada" };
    case "MODIFICADA":
      return { cls: "bg-amber-100 text-amber-700 border-amber-200", label: "Modificada" };
    case "DESACTIVADA":
      return { cls: "bg-red-100 text-red-700 border-red-200", label: "Desactivada" };
    default:
      return { cls: "bg-gray-100 text-gray-700 border-gray-200", label: accion };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryTab = ({ idProducto }) => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const token = useAuthStore((state) => state.token);
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!idProducto) return;
    const fetchHistorial = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/historial-ofertas/producto/${idProducto}`,
          { headers: { Auth: `Bearer ${token}` } },
        );
        setHistorial(res.data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
        setHistorial([]);
      } finally {
        setCargando(false);
      }
    };
    fetchHistorial();
  }, [idProducto, backendUrl, token]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <History size={32} className="mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">No hay registros de cambios</p>
        <p className="text-xs text-gray-400 mt-1">Los cambios en la oferta aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {historial.map((registro) => {
        const { cls, label } = getAccionBadge(registro.accion);
        return (
          <div
            key={registro.idHistorial}
            className="rounded-xl border border-gray-100 bg-gray-50 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
                {label}
              </span>
              <span className="text-xs text-gray-400">{formatDate(registro.fechaHora)}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600">
              {registro.porcentajeAnterior > 0 && (
                <span>
                  <span className="text-gray-400">Antes:</span> {registro.porcentajeAnterior}%
                </span>
              )}
              {registro.porcentajeNuevo > 0 && (
                <span>
                  <span className="text-gray-400">Ahora:</span>{" "}
                  <span className="font-semibold text-green-700">{registro.porcentajeNuevo}%</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <User size={12} />
              <span>{registro.nombreUsuario || "Sistema"}</span>
              <span className="text-gray-300">·</span>
              <span className="capitalize">{registro.tipoUsuario}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const OfertaDetail = ({ producto, onClose }) => {
  const [tabActiva, setTabActiva] = useState("detalle");

  if (!producto) return null;

  const { icon: EstadoIcon, cls: estadoCls } = getEstadoBadge(producto.enOferta);
  const precioRegular = Number(producto.precioRegular || producto.precio || 0);
  const descuento = Number(producto.porcentajeDescuento || 0);
  const precioFinal = producto.enOferta && descuento > 0
    ? precioRegular * (1 - descuento / 100)
    : precioRegular;
  const ahorro = precioRegular - precioFinal;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl max-h-[90vh]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                <Tag size={17} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 leading-none">
                  Detalle de oferta
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">{producto.nombreProducto}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex border-b border-gray-100 shrink-0">
            <button
              type="button"
              onClick={() => setTabActiva("detalle")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                tabActiva === "detalle"
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Detalle
            </button>
            <button
              type="button"
              onClick={() => setTabActiva("historial")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                tabActiva === "historial"
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Historial
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {tabActiva === "detalle" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Precio regular</p>
                    <p className="text-lg font-semibold text-gray-500 line-through">
                      ${precioRegular.toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Precio final</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${precioFinal.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>

                {producto.enOferta && descuento > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200">
                    <p className="text-sm font-semibold text-green-700">
                      Ahorrás ${ahorro.toLocaleString("es-AR")} ({descuento}% OFF)
                    </p>
                  </div>
                )}

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-4 ${estadoCls}`}
                >
                  <EstadoIcon size={14} />
                  {producto.enOferta ? "Oferta activa" : "Sin oferta"}
                </span>

                <div className="space-y-0">
                  <DetailRow
                    Icon={Tag}
                    label="Producto"
                    value={producto.nombreProducto}
                  />
                  {producto.categoria && (
                    <DetailRow
                      Icon={Tag}
                      label="Categoría"
                      value={producto.categoria}
                    />
                  )}
                  {producto.enOferta && (
                    <DetailRow
                      Icon={Percent}
                      label="Descuento"
                      value={`${descuento}% OFF`}
                    />
                  )}
                  <DetailRow
                    Icon={DollarSign}
                    label="Precio regular"
                    value={`$${precioRegular.toLocaleString("es-AR")}`}
                  />
                  <DetailRow
                    Icon={DollarSign}
                    label="Precio final"
                    value={`$${precioFinal.toLocaleString("es-AR")}`}
                  />
                  {producto.stock !== undefined && (
                    <DetailRow
                      Icon={Calendar}
                      label="Stock"
                      value={`${producto.stock} unidades`}
                    />
                  )}
                </div>
              </>
            )}

            {tabActiva === "historial" && (
              <HistoryTab idProducto={producto.idProducto} />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
