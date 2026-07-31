import { ChevronLeft, ChevronRight } from "lucide-react";

export const ProductPagination = ({
  paginaActual,
  totalPaginas,
  totalProductos,
  updateParams,
}) => {
  const productosPorPagina = 12;
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;

  const irAPagina = (numero) => {
    updateParams("pagina", numero);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (totalPaginas <= 1) return null;

  const paginationNumbers = getPaginationNumbers();

  return (
    <div className="mt-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="text-sm text-gray-500 font-medium text-center sm:text-left">
        Mostrando {indiceInicio + 1} - {Math.min(indiceFin, totalProductos)} de{" "}
        {totalProductos} productos
      </div>

      <nav role="navigation" aria-label="Paginación de productos">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => paginaActual > 1 && irAPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`
            w-10 h-10 flex items-center justify-center rounded-full
            transition-all duration-200 bg-slate-100
            focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            ${
              paginaActual === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-200 cursor-pointer"
            }
          `}
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-1">
            {paginationNumbers.map((number, index) => {
              if (number === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="w-8 h-10 sm:w-10 flex items-center justify-center text-gray-400 text-sm font-medium"
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
                  onClick={() => irAPagina(number)}
                  className={`
                  w-10 h-10 flex items-center justify-center rounded-full
                  text-sm font-medium transition-all duration-200
                  focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                  ${
                    isActive
                      ? "text-primary-600 border border-primary-600 bg-primary-50"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary-600 cursor-pointer"
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
              paginaActual < totalPaginas && irAPagina(paginaActual + 1)
            }
            disabled={paginaActual === totalPaginas}
            className={`
            w-10 h-10 flex items-center justify-center rounded-full
            transition-all duration-200 bg-slate-100
            focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            ${
              paginaActual === totalPaginas
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-200 cursor-pointer"
            }
          `}
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </nav>
    </div>
  );
};
