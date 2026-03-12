import { motion } from "framer-motion";
import { Edit, XCircle, CheckCircle } from "lucide-react";

export const ProductActions = ({
  producto,
  enCampana,
  tieneOferta,
  onEstablecerDescuento,
  onCambiarOferta,
  isMobile = false,
}) => {
  if (enCampana) {
    if (isMobile) {
      return (
        <div className="w-full text-center py-3 text-sm text-purple-700 font-semibold bg-purple-50 rounded-xl border-2 border-purple-100">
          Producto en campaña activa
        </div>
      );
    }
    return (
      <span className="text-sm text-purple-600 font-semibold">
        Producto en campaña
      </span>
    );
  }

  if (tieneOferta) {
    if (isMobile) {
      return (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEstablecerDescuento(producto)}
            className="
              flex-1 flex items-center justify-center gap-2 h-12
              bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
              text-white rounded-xl
              font-semibold text-sm shadow-lg
              transition-all duration-200
              focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300
            "
            aria-label={`Cambiar descuento de ${producto.nombreProducto}`}
          >
            <Edit size={18} aria-hidden="true" />
            <span>Cambiar %</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCambiarOferta(producto, false)}
            className="
              flex items-center justify-center w-12 h-12
              bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
              text-white rounded-xl shadow-lg
              transition-all duration-200
              focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300
            "
            aria-label={`Quitar oferta de ${producto.nombreProducto}`}
            title="Quitar oferta"
          >
            <XCircle size={22} aria-hidden="true" />
          </motion.button>
        </>
      );
    }

    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEstablecerDescuento(producto)}
          className="
            px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg
            text-sm font-semibold shadow-sm
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
          "
          aria-label={`Cambiar descuento de ${producto.nombreProducto}`}
        >
          Cambiar %
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCambiarOferta(producto, false)}
          className="
            inline-flex items-center gap-1.5 px-4 py-2
            bg-red-500 hover:bg-red-600 text-white rounded-lg
            text-sm font-semibold shadow-sm
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
          "
          aria-label={`Quitar oferta de ${producto.nombreProducto}`}
        >
          <XCircle size={16} aria-hidden="true" />
          Quitar
        </motion.button>
      </>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onEstablecerDescuento(producto)}
      className={`
        inline-flex items-center justify-center gap-2
        bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
        text-white rounded-xl
        font-semibold text-sm shadow-lg
        transition-all duration-200
        focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300
        ${isMobile ? "flex-1 h-12" : "px-5 py-2"}
      `}
      aria-label={`Activar oferta en ${producto.nombreProducto}`}
    >
      <CheckCircle size={isMobile ? 20 : 18} aria-hidden="true" />
      <span>Activar Oferta</span>
    </motion.button>
  );
};
