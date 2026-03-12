import { motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const FirstLastButtons = ({
  paginaActual,
  totalPaginas,
  onFirstPage,
  onLastPage,
}) => {
  const handleKeyDown = (action) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <>
      {/* Primera página */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onFirstPage}
        disabled={paginaActual === 1}
        onKeyDown={handleKeyDown(onFirstPage)}
        className={`
          hidden sm:flex items-center justify-center w-10 h-10 rounded-xl
          transition-all duration-200
          ${
            paginaActual === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          }
        `}
        aria-label="Primera página"
        aria-disabled={paginaActual === 1}
      >
        <ChevronsLeft size={20} />
      </motion.button>

      {/* Última página */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLastPage}
        disabled={paginaActual === totalPaginas}
        onKeyDown={handleKeyDown(onLastPage)}
        className={`
          hidden sm:flex items-center justify-center w-10 h-10 rounded-xl
          transition-all duration-200
          ${
            paginaActual === totalPaginas
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          }
        `}
        aria-label="Última página"
        aria-disabled={paginaActual === totalPaginas}
      >
        <ChevronsRight size={20} />
      </motion.button>
    </>
  );
};
