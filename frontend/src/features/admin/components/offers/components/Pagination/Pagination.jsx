import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOfertasStore } from "../../store/useOfertasStore";
import { usePagination } from "./usePagination";

export const Pagination = () => {
  const {
    paginaActual,
    setPaginaActual,
    itemsPorPagina,
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    cargando,
  } = useOfertasStore();

  const { totalPaginas, productosFiltrados } = usePagination({
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    paginaActual,
    itemsPorPagina,
  });

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

    let previous;
    for (const page of range) {
      if (previous) {
        if (page - previous === 2) rangeWithDots.push(previous + 1);
        else if (page - previous !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(page);
      previous = page;
    }

    return rangeWithDots;
  };

  if (cargando || productosFiltrados.length === 0 || totalPaginas <= 1) {
    return null;
  }

  const paginationNumbers = getPaginationNumbers();

  return (
    <nav
      className="flex justify-center py-2 bg-white rounded-xl border border-gray-200 shadow-sm"
      role="navigation"
      aria-label="Paginación de productos"
    >
      <div className="flex items-center justify-between w-full max-w-md px-3">
        <button
          onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
          disabled={paginaActual === 1}
          className={`
            w-9 h-9 flex items-center justify-center rounded-full
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
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <div className="flex items-center gap-1.5">
          {paginationNumbers.map((number, index) => {
            if (number === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs font-medium"
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
                onClick={() => setPaginaActual(number)}
                className={`
                  w-9 h-9 flex items-center justify-center rounded-full
                  text-xs font-medium transition-all duration-200
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

        <button
          onClick={() =>
            setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
          }
          disabled={paginaActual === totalPaginas}
          className={`
            w-9 h-9 flex items-center justify-center rounded-full
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
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </nav>
  );
};
