import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Componente de paginación para empleados
 */
export const EmpleadosPagination = ({
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
      className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-4 shadow-sm"
    >
      <nav
        className="flex justify-center"
        role="navigation"
        aria-label="Paginación de empleados"
      >
        <div className="flex w-full max-w-md items-center justify-between px-1 sm:px-4">
          <motion.button
            whileHover={{ scale: paginaActual === 1 ? 1 : 1.05 }}
            whileTap={{ scale: paginaActual === 1 ? 1 : 0.95 }}
            onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/50 transition-all duration-200 ${
              paginaActual === 1
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-slate-300/50"
            }`}
            aria-label="Página anterior"
            aria-disabled={paginaActual === 1}
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </motion.button>

          <div className="flex items-center gap-2">
            {getPaginationNumbers().map((number, index) => {
              if (number === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="flex h-10 w-10 items-center justify-center text-sm font-medium text-gray-400"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                );
              }

              const isActive = number === paginaActual;

              return (
                <motion.button
                  key={number}
                  whileHover={isActive ? { scale: 1 } : { scale: 1.05 }}
                  whileTap={isActive ? { scale: 1 } : { scale: 0.95 }}
                  onClick={() => onCambiarPagina(number)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border border-green-600 text-green-600"
                      : "cursor-pointer text-green-600 hover:bg-green-100"
                  }`}
                  aria-label={
                    isActive
                      ? `Página ${number} (actual)`
                      : `Ir a página ${number}`
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  {number}
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: paginaActual === totalPaginas ? 1 : 1.05 }}
            whileTap={{ scale: paginaActual === totalPaginas ? 1 : 0.95 }}
            onClick={() =>
              onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))
            }
            disabled={paginaActual === totalPaginas}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/50 transition-all duration-200 ${
              paginaActual === totalPaginas
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-slate-300/50"
            }`}
            aria-label="Página siguiente"
            aria-disabled={paginaActual === totalPaginas}
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </motion.button>
        </div>
      </nav>
    </motion.div>
  );
};
