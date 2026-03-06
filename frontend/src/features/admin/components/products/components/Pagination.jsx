import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const paginationNumbers = getPaginationNumbers();

  return (
    <nav
      className="flex justify-center py-3 bg-white rounded-xl border border-gray-200 shadow-sm"
      role="navigation"
      aria-label="Paginación de productos"
    >
      <div className="flex items-center justify-between w-full max-w-md px-4">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`
            w-10 h-10 flex items-center justify-center rounded-full
            transition-all duration-200 bg-slate-200/50
            focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
            ${
              currentPage === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-300/50 cursor-pointer"
            }
          `}
          aria-label="Página anterior"
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-2">
          {paginationNumbers.map((number, index) => {
            if (number === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm font-medium"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isActive = number === currentPage;

            return (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full
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

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`
            w-10 h-10 flex items-center justify-center rounded-full
            transition-all duration-200 bg-slate-200/50
            focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
            ${
              currentPage === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-300/50 cursor-pointer"
            }
          `}
          aria-label="Página siguiente"
          aria-disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
