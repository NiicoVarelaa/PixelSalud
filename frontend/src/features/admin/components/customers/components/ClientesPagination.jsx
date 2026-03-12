import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Componente de paginación para clientes
 */
export const ClientesPagination = ({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) => {
  if (totalPaginas <= 1) return null;

  const getPaginationNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPaginas; i++) {
      if (
        i === 1 ||
        i === totalPaginas ||
        (i >= paginaActual - delta && i <= paginaActual + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center gap-2 mt-6 pb-6"
    >
      {/* Botón Anterior */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className={`p-2 rounded-lg transition-colors ${
          paginaActual === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-green-600 hover:bg-green-50 shadow-md"
        }`}
      >
        <ChevronLeft size={20} />
      </motion.button>

      {/* Números de página */}
      <div className="flex gap-1">
        {getPaginationNumbers().map((number, index) => (
          <motion.button
            key={index}
            whileHover={typeof number === "number" ? { scale: 1.1 } : {}}
            whileTap={typeof number === "number" ? { scale: 0.9 } : {}}
            onClick={() =>
              typeof number === "number" ? onCambiarPagina(number) : null
            }
            disabled={typeof number !== "number"}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              number === paginaActual
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                : typeof number === "number"
                  ? "bg-white text-gray-600 hover:bg-gray-50 shadow-md"
                  : "bg-transparent text-gray-400 cursor-default"
            }`}
          >
            {number}
          </motion.button>
        ))}
      </div>

      {/* Botón Siguiente */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))
        }
        disabled={paginaActual === totalPaginas}
        className={`p-2 rounded-lg transition-colors ${
          paginaActual === totalPaginas
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-green-600 hover:bg-green-50 shadow-md"
        }`}
      >
        <ChevronRight size={20} />
      </motion.button>
    </motion.div>
  );
};
