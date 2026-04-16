import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductSelector } from "./ProductSelector";
import { CampanaModalFormSection } from "./CampanaModalFormSection";
import { CampanaModalActions } from "./CampanaModalActions";

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
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

            <form
              id="form-campana"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
            >
              <CampanaModalFormSection
                campana={campana}
                esDosPorUno={esDosPorUno}
                onCampanaChange={onCampanaChange}
              />

              <div className="border-t border-gray-100" aria-hidden="true" />

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

            <CampanaModalActions
              isFormValid={isFormValid}
              campana={campana}
              productosSeleccionados={productosSeleccionados}
              esDosPorUno={esDosPorUno}
              onClose={onClose}
              modoEdicion={modoEdicion}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
