import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const DESCUENTOS = [
  { valor: 10, label: "Suave" },
  { valor: 15, label: "Medio" },
  { valor: 20, label: "Alto" },
];

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

  useEffect(() => {
    if (!isOpen) return;
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
            className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2
                id="descuento-titulo"
                className="text-base font-semibold text-gray-900"
              >
                {title}
              </h2>
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
                  <p className="text-xs text-gray-500 mb-0.5">Producto</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {producto.nombreProducto}
                  </p>
                  {producto.categoria && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {producto.categoria}
                    </p>
                  )}
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
                {DESCUENTOS.map((desc) => (
                  <button
                    key={desc.valor}
                    type="button"
                    onClick={() => {
                      onConfirm(desc.valor);
                      onClose();
                    }}
                    className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition-colors hover:border-green-500 hover:bg-green-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    aria-label={`Aplicar ${desc.valor}% de descuento`}
                  >
                    <span>{desc.label}</span>
                    <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                      {desc.valor}% {confirmLabel}
                    </span>
                  </button>
                ))}
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
