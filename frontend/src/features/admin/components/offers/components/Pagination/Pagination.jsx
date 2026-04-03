import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOfertasStore } from "../../store/useOfertasStore";
import { getPaginationNumbers, usePagination } from "./usePagination";

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

  const { totalPaginas, productosFiltrados, inicio, fin, totalItems } =
    usePagination({
      productos,
      busqueda,
      filtroCategoria,
      filtroDescuento,
      paginaActual,
      itemsPorPagina,
    });

  const paginationNumbers = getPaginationNumbers(totalPaginas, paginaActual);

  if (cargando || productosFiltrados.length === 0 || totalPaginas <= 1) {
    return null;
  }

  return (
    <nav
      className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm sm:px-4"
      role="navigation"
      aria-label="Paginación de productos"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-gray-600" aria-live="polite">
          Mostrando {inicio}-{fin} de {totalItems} productos con oferta
        </p>

        <div className="flex items-center justify-between gap-1.5 sm:justify-end">
          <button
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            className={`
              h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full
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
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </button>

          <div className="flex items-center gap-1">
            {paginationNumbers.map((number, index) => {
              if (number === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center text-xs font-medium text-gray-400"
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
                    h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full
                    text-xs font-medium transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
                    ${
                      isActive
                        ? "border border-green-600 bg-green-50 text-green-700 cursor-pointer"
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
              h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full
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
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};
