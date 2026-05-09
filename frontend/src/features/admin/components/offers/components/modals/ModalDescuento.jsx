import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Calendar } from "lucide-react";
import { DESCUENTOS_DETALLE } from "../../utils/constants";

export const ModalDescuento = ({
  isOpen,
  onClose,
  producto,
  onConfirm,
  title = "Aplicar descuento",
  description = "Seleccioná el porcentaje a aplicar:",
  confirmLabel = "OFF",
}) => {
  const closeButtonRef = useRef(null);
  const [porcentajeCustom, setPorcentajeCustom] = useState("");
  const [modoCustom, setModoCustom] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [conFechas, setConFechas] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPorcentajeCustom("");
      setModoCustom(false);
      setFechaInicio("");
      setFechaFin("");
      setConFechas(false);
      return;
    }
    closeButtonRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const porcentajeValido = modoCustom
    ? porcentajeCustom !== "" &&
      Number(porcentajeCustom) >= 1 &&
      Number(porcentajeCustom) <= 100
    : null;

  const fechasValidas = conFechas
    ? fechaInicio !== "" && fechaFin !== "" && new Date(fechaFin) > new Date(fechaInicio)
    : true;

  const handleConfirmPreset = (valor) => {
    if (conFechas && !fechasValidas) return;
    onConfirm(valor, conFechas ? { fechaInicio, fechaFin } : null);
    onClose();
  };

  const handleConfirmCustom = () => {
    if (porcentajeValido && fechasValidas) {
      onConfirm(Number(porcentajeCustom), conFechas ? { fechaInicio, fechaFin } : null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="descuento-titulo"
          aria-describedby="descuento-descripcion"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white">
                  <Tag size={16} aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id="descuento-titulo"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Elegí el nivel de descuento
                  </p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar modal"
              >
                <X size={17} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {producto && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">Producto</p>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {producto.nombreProducto}
                      </p>
                      {producto.categoria && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {producto.categoria}
                        </p>
                      )}
                      {producto.enOferta && producto.porcentajeDescuento > 0 && (
                        <p className="mt-1.5 text-xs font-medium text-orange-600">
                          Descuento actual: {producto.porcentajeDescuento}% OFF
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                      Individual
                    </span>
                  </div>
                </div>
              )}

              <p id="descuento-descripcion" className="text-sm text-gray-500">
                {description}
              </p>

              <div
                role="group"
                aria-label="Opciones de descuento"
                className="space-y-2"
              >
                {DESCUENTOS_DETALLE.map((desc) => (
                  <button
                    key={desc.valor}
                    type="button"
                    onClick={() => handleConfirmPreset(desc.valor)}
                    className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition-colors active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${desc.buttonClass}`}
                    aria-label={`Aplicar ${desc.valor}% de descuento`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {desc.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {desc.valor}%
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${desc.badgeClass}`}
                    >
                      {confirmLabel}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setConFechas(!conFechas)}
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:border-blue-400 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Calendar size={14} />
                {conFechas ? "Sin fechas de validez" : "Agregar fechas de validez"}
              </button>

              {conFechas && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Inicio
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Fin
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  {conFechas && fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio) && (
                    <p className="col-span-2 text-xs text-red-500">
                      La fecha de fin debe ser posterior al inicio
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setModoCustom(!modoCustom)}
                  className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:border-green-400 hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {modoCustom ? "Usar descuento predefinido" : "Descuento personalizado"}
                </button>

                {modoCustom && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={porcentajeCustom}
                        onChange={(e) => setPorcentajeCustom(e.target.value)}
                        placeholder="1-100"
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-colors"
                        aria-label="Porcentaje de descuento personalizado"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                        %
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmCustom}
                      disabled={!porcentajeValido || !fechasValidas}
                      className="h-12 cursor-pointer rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                aria-label="Cancelar y cerrar"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

ModalDescuento.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  producto: PropTypes.shape({
    idProducto: PropTypes.number,
    nombreProducto: PropTypes.string,
    categoria: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
};

ModalDescuento.defaultProps = {
  producto: null,
};
