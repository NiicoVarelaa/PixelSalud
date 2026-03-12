import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CampanasPagination = ({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) => {
  if (totalPaginas <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 flex justify-center items-center gap-2"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {[...Array(totalPaginas)].map((_, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCambiarPagina(index + 1)}
          className={`px-4 py-2 rounded-lg transition-all ${
            paginaActual === index + 1
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
              : "bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {index + 1}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))
        }
        disabled={paginaActual === totalPaginas}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};
