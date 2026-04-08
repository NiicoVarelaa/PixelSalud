import { useEffect, useRef } from "react";
import { X, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductSelector } from "./ProductSelector";

const TIPOS = ["DESCUENTO", "2X1", "EVENTO", "LIQUIDACION", "TEMPORADA"];

/* Input field reutilizable */
const Field = ({ label, required, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
      {label}
      {required && (
        <span className="ml-0.5 text-red-400" aria-hidden="true">
          *
        </span>
      )}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed";

export const CampanaModal = ({
  isOpen,
  modoEdicion,
  campana,
  onCampanaChange,
  productosSeleccionados,
  idsProductosBloqueados,
  onToggleProducto,
  onSeleccionarTodos,
  productos,
  categorias,
  busquedaProducto,
  onBusquedaProductoChange,
  categoriaFiltro,
  onCategoriaFiltroChange,
  onClose,
  onGuardar,
}) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
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

  const esDosPorUno = campana.tipo === "2X1";

  const isFormValid =
    campana.nombreCampana?.trim() &&
    (esDosPorUno || campana.porcentajeDescuento) &&
    productosSeleccionados.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) onGuardar();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-campana-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 flex-shrink-0">
              <div>
                <h2
                  id="modal-campana-title"
                  className="text-base font-semibold text-gray-900 leading-none"
                >
                  {modoEdicion ? "Editar campaña" : "Nueva campaña"}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {modoEdicion
                    ? "Modificá los datos y productos"
                    : "Completá los datos para crear la campaña"}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Cerrar modal"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body scrolleable */}
            <form
              id="form-campana"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
            >
              {/* ── Datos básicos ── */}
              <section aria-label="Datos de la campaña">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Datos de la campaña
                </p>
                <div className="space-y-3">
                  <Field label="Nombre" required>
                    <input
                      type="text"
                      value={campana.nombreCampana}
                      onChange={(e) =>
                        onCampanaChange({
                          ...campana,
                          nombreCampana: e.target.value,
                        })
                      }
                      placeholder="Ej: Cyber Monday 2026"
                      className={inputCls}
                      required
                      aria-required="true"
                    />
                  </Field>

                  <Field label="Descripción">
                    <textarea
                      value={campana.descripcion}
                      onChange={(e) =>
                        onCampanaChange({
                          ...campana,
                          descripcion: e.target.value,
                        })
                      }
                      placeholder="Descripción breve (opcional)..."
                      rows={2}
                      className={`${inputCls} h-auto py-2.5 resize-none`}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Tipo">
                      <select
                        value={campana.tipo}
                        onChange={(e) =>
                          onCampanaChange({ ...campana, tipo: e.target.value })
                        }
                        className={`${inputCls} cursor-pointer`}
                      >
                        {TIPOS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      label={
                        esDosPorUno ? "Descuento (no aplica)" : "Descuento (%)"
                      }
                      required={!esDosPorUno}
                    >
                      <div className="relative">
                        <Percent
                          size={14}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          aria-hidden="true"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={esDosPorUno ? 0 : campana.porcentajeDescuento}
                          onChange={(e) =>
                            onCampanaChange({
                              ...campana,
                              porcentajeDescuento: e.target.value,
                            })
                          }
                          placeholder={esDosPorUno ? "—" : "Ej: 20"}
                          className={`${inputCls} pl-8`}
                          required={!esDosPorUno}
                          disabled={esDosPorUno}
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Fecha de inicio" required>
                      <input
                        type="date"
                        value={campana.fechaInicio}
                        onChange={(e) =>
                          onCampanaChange({
                            ...campana,
                            fechaInicio: e.target.value,
                          })
                        }
                        className={`${inputCls} cursor-pointer`}
                        required
                        aria-required="true"
                      />
                    </Field>
                    <Field label="Fecha de fin" required>
                      <input
                        type="date"
                        value={campana.fechaFin}
                        onChange={(e) =>
                          onCampanaChange({
                            ...campana,
                            fechaFin: e.target.value,
                          })
                        }
                        className={`${inputCls} cursor-pointer`}
                        required
                        aria-required="true"
                      />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="border-t border-gray-100" aria-hidden="true" />

              {/* ── Selector de productos ── */}
              <section aria-label="Selección de productos">
                <ProductSelector
                  productos={productos}
                  categorias={categorias}
                  productosSeleccionados={productosSeleccionados}
                  idsProductosBloqueados={idsProductosBloqueados}
                  onToggleProducto={onToggleProducto}
                  onSeleccionarTodos={onSeleccionarTodos}
                  busqueda={busquedaProducto}
                  onBusquedaChange={onBusquedaProductoChange}
                  categoria={categoriaFiltro}
                  onCategoriaChange={onCategoriaFiltroChange}
                />
              </section>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5 flex-shrink-0">
              {!isFormValid && (
                <p className="mr-auto text-xs text-gray-400">
                  {!campana.nombreCampana?.trim()
                    ? "Falta el nombre"
                    : productosSeleccionados.length === 0
                      ? "Seleccioná al menos un producto"
                      : !esDosPorUno && !campana.porcentajeDescuento
                        ? "Falta el descuento"
                        : ""}
                </p>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-campana"
                disabled={!isFormValid}
                className="h-9 px-5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                {modoEdicion ? "Guardar cambios" : "Crear campaña"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
