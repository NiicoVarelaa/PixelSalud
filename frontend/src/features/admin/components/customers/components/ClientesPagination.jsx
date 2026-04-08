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
      className="flex justify-center py-2"
    >
      <div className="flex w-full max-w-md items-center justify-between px-2 sm:px-4">
        <button
          onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
          disabled={paginaActual === 1}
          className={`
            h-10 w-10 flex items-center justify-center rounded-full
            transition-all duration-200 bg-slate-200/50
            focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
            ${
              paginaActual === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-300/50 cursor-pointer"
            }
          `}
          aria-label="Página anterior"
          aria-disabled={paginaActual === 1}
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          {getPaginationNumbers().map((number, index) => {
            if (number === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="h-10 w-10 flex items-center justify-center text-gray-400 text-sm font-medium"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isActive = number === paginaActual;

            return (
              <button
                key={number}
                onClick={() => onCambiarPagina(number)}
                className={`
                  h-10 w-10 flex items-center justify-center rounded-full
                  text-sm font-medium transition-all duration-200
                  focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
                  ${
                    isActive
                      ? "text-green-600 border border-green-600"
                      : "text-green-600 hover:bg-green-100 cursor-pointer"
                  }
                `}
                aria-label={
                  isActive
                    ? `Página ${number} (actual)`
                    : `Ir a página ${number}`
                }
                aria-current={isActive ? "page" : undefined}
              >
                {number}
              </button>
            );
          })}
        </div>

        <div className="sm:hidden rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600">
          {paginaActual}/{totalPaginas}
        </div>

        <button
          onClick={() =>
            onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))
          }
          disabled={paginaActual === totalPaginas}
          className={`
            h-10 w-10 flex items-center justify-center rounded-full
            transition-all duration-200 bg-slate-200/50
            focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
            ${
              paginaActual === totalPaginas
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-300/50 cursor-pointer"
            }
          `}
          aria-label="Página siguiente"
          aria-disabled={paginaActual === totalPaginas}
        >
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>
      </div>
    </motion.div>
  );
};
