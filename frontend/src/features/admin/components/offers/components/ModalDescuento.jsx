import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Percent, Sparkles } from "lucide-react";

/**
 * Modal personalizado para seleccionar porcentaje de descuento
 * Reemplaza a SweetAlert2 con un diseño mobile-first y accesible
 */
export const ModalDescuento = ({ isOpen, onClose, producto, onConfirm }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Opciones de descuento
  const descuentos = [
    {
      valor: 10,
      color:
        "bg-primary-500 hover:bg-primary-600 focus-visible:ring-primary-500",
      label: "10% OFF",
    },
    {
      valor: 15,
      color: "bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500",
      label: "15% OFF",
    },
    {
      valor: 20,
      color: "bg-red-500 hover:bg-red-600 focus-visible:ring-red-500",
      label: "20% OFF",
    },
  ];

  // Gestión de foco y escape
  useEffect(() => {
    if (isOpen) {
      // Enfocar el botón de cerrar al abrir
      closeButtonRef.current?.focus();

      // Prevenir scroll del body
      document.body.style.overflow = "hidden";

      // Trap focus dentro del modal
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
    }
  }, [isOpen, onClose]);

  // Click fuera del modal para cerrar
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:p-0"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
          aria-describedby="modal-descripcion"
        >
          {/* Backdrop con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              relative w-full max-w-md
              bg-white rounded-2xl shadow-2xl
              overflow-hidden
              transform transition-all
            "
          >
            {/* Header con gradiente decorativo */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 pb-20">
              {/* Botón cerrar */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="
                  absolute top-4 right-4 z-10
                  w-10 h-10 flex items-center justify-center
                  text-white/80 hover:text-white hover:bg-white/20
                  rounded-full transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500
                "
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>

              {/* Icono decorativo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
              </div>

              <h2
                id="modal-titulo"
                className="text-xl sm:text-2xl font-bold text-white text-center leading-tight"
              >
                Aplicar Descuento
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 -mt-12 relative z-10">
              {/* Producto info card */}
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

              {/* Mensaje */}
              <p
                id="modal-descripcion"
                className="text-center text-gray-600 mb-6"
              >
                Selecciona el porcentaje de descuento a aplicar:
              </p>

              {/* Botones de descuento */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {descuentos.map((desc) => (
                  <button
                    key={desc.valor}
                    onClick={() => {
                      onConfirm(desc.valor);
                      onClose();
                    }}
                    className={`
                      group relative
                      ${desc.color}
                      text-white rounded-xl
                      py-6 px-4
                      font-bold text-lg
                      shadow-lg hover:shadow-xl
                      transform hover:scale-105 active:scale-95
                      transition-all duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    `}
                    aria-label={`Aplicar descuento de ${desc.valor} por ciento`}
                  >
                    {/* Icono decorativo */}
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center group-hover:bg-white/40 transition-colors">
                        <Percent
                          size={18}
                          className="text-white"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <div className="text-2xl font-extrabold">
                        {desc.valor}%
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wide opacity-90">
                        OFF
                      </div>
                    </div>

                    {/* Efecto hover shimmer */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                ))}
              </div>

              {/* Botón cancelar */}
              <button
                onClick={onClose}
                className="
                  w-full h-12
                  bg-gray-100 hover:bg-gray-200 text-gray-700
                  rounded-xl font-medium text-base
                  transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
                "
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
    idProducto: PropTypes.number.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    categoria: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
};

ModalDescuento.defaultProps = {
  producto: null,
};
