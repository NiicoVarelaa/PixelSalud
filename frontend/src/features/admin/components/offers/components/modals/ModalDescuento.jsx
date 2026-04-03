import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Percent, Sparkles } from "lucide-react";

/**
 * Modal para seleccionar porcentaje de descuento.
 * En mobile se comporta como drawer inferior.
 */
export const ModalDescuento = ({
  isOpen,
  onClose,
  producto,
  onConfirm,
  title = "Aplicar descuento",
  description = "Selecciona el porcentaje de descuento a aplicar:",
  confirmLabel = "OFF",
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const descuentos = [
    {
      valor: 10,
      color:
        "bg-primary-500 hover:bg-primary-600 focus-visible:ring-primary-500",
    },
    {
      valor: 15,
      color: "bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500",
    },
    {
      valor: 20,
      color: "bg-red-500 hover:bg-red-600 focus-visible:ring-red-500",
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
          aria-describedby="modal-descripcion"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh]"
          >
            <div className="bg-linear-to-r from-primary-500 to-primary-600 p-5 sm:p-6 pb-16 sm:pb-20">
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex cursor-pointer items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>

              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
              </div>

              <h2
                id="modal-titulo"
                className="text-xl sm:text-2xl font-bold text-white text-center leading-tight"
              >
                {title}
              </h2>
            </div>

            <div className="px-5 sm:px-6 pb-6 -mt-10 sm:-mt-12 relative z-10 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">
                  Producto seleccionado:
                </p>
                <p className="font-semibold text-gray-900 line-clamp-2">
                  {producto?.nombreProducto}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {producto?.categoria}
                </p>
              </div>

              <p
                id="modal-descripcion"
                className="text-center text-gray-600 mb-6"
              >
                {description}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {descuentos.map((desc) => (
                  <button
                    key={desc.valor}
                    type="button"
                    onClick={() => {
                      onConfirm(desc.valor);
                      onClose();
                    }}
                    className={`group relative ${desc.color} text-white rounded-xl py-5 px-3 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                    aria-label={`Aplicar descuento de ${desc.valor} por ciento`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center group-hover:bg-white/40 transition-colors">
                        <Percent
                          size={18}
                          className="text-white"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-extrabold">
                        {desc.valor}%
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-90">
                        {confirmLabel}
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-xl bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-base transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
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
