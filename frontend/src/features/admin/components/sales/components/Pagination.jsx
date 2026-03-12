import { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { useVentasStore } from "../store/useVentasStore";

export const Pagination = () => {
  const {
    paginaActual,
    setPaginaActual,
    cargando,
    ventas,
    filtro,
    filtroEstado,
    itemsPorPagina,
  } = useVentasStore();

  // Calcular ventas filtradas y paginadas con useMemo
  const { totalPaginas, itemsActuales, inicio, fin, totalItems } =
    useMemo(() => {
      const ventasFiltradas = ventas.filter((v) => {
        const termino = filtro.toLowerCase();
        const id = v.idVentaE?.toString() || "";
        const dni = v.dniEmpleado?.toString() || "";
        const nombre = v.nombreEmpleado?.toLowerCase() || "";
        const apellido = v.apellidoEmpleado?.toLowerCase() || "";
        const nombreCompleto = `${nombre} ${apellido}`;

        const coincideBusqueda =
          id.includes(termino) ||
          dni.includes(termino) ||
          nombreCompleto.includes(termino);
        const coincideEstado =
          filtroEstado === "todas" ? true : v.estado === filtroEstado;
        return coincideBusqueda && coincideEstado;
      });

      const total = Math.ceil(ventasFiltradas.length / itemsPorPagina);
      const indiceUltimo = paginaActual * itemsPorPagina;
      const indicePrimero = indiceUltimo - itemsPorPagina;
      const items = ventasFiltradas.slice(indicePrimero, indiceUltimo);

      return {
        totalPaginas: total,
        itemsActuales: items,
        inicio: indicePrimero + 1,
        fin: Math.min(indiceUltimo, ventasFiltradas.length),
        totalItems: ventasFiltradas.length,
      };
    }, [ventas, filtro, filtroEstado, paginaActual, itemsPorPagina]);

  // Generar números de página con elipsis inteligente
  const getPaginationNumbers = () => {
    const delta = 1; // Páginas a mostrar a cada lado de la actual
    const range = [];
    const rangeWithDots = [];

    // Siempre mostrar primera página
    range.push(1);

    // Calcular rango alrededor de página actual
    for (
      let i = Math.max(2, paginaActual - delta);
      i <= Math.min(totalPaginas - 1, paginaActual + delta);
      i++
    ) {
      range.push(i);
    }

    // Siempre mostrar última página si hay más de una
    if (totalPaginas > 1) {
      range.push(totalPaginas);
    }

    // Agregar elipsis donde sea necesario
    let prevNum = 0;
    range.forEach((num) => {
      if (num - prevNum === 2) {
        rangeWithDots.push(prevNum + 1);
      } else if (num - prevNum > 2) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(num);
      prevNum = num;
    });

    return rangeWithDots;
  };

  const paginationNumbers = getPaginationNumbers();

  // Handler de navegación con teclado
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  if (cargando || itemsActuales.length === 0) {
    return null;
  }

  return (
    <nav
      className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6"
      role="navigation"
      aria-label="Paginación de ventas"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Info de resultados - Mobile first */}
        <div
          className="text-sm text-gray-700 text-center sm:text-left order-2 sm:order-1"
          role="status"
          aria-live="polite"
        >
          Mostrando{" "}
          <span className="font-semibold text-gray-900">{inicio}</span> a{" "}
          <span className="font-semibold text-gray-900">{fin}</span> de{" "}
          <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
          resultado{totalItems !== 1 ? "s" : ""}
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center justify-center gap-1 order-1 sm:order-2">
          {/* Primera página (solo desktop) */}
          <button
            onClick={() => setPaginaActual(1)}
            disabled={paginaActual === 1}
            onKeyDown={(e) => handleKeyDown(e, () => setPaginaActual(1))}
            className={`
              hidden sm:flex items-center justify-center w-9 h-9 rounded-lg
              transition-all
              ${
                paginaActual === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              }
            `}
            aria-label="Primera página"
            aria-disabled={paginaActual === 1}
          >
            <ChevronsLeft size={18} aria-hidden="true" />
          </button>

          {/* Página anterior */}
          <button
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            onKeyDown={(e) =>
              handleKeyDown(e, () =>
                setPaginaActual(Math.max(1, paginaActual - 1)),
              )
            }
            className={`
              flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg
              transition-all font-medium
              ${
                paginaActual === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              }
            `}
            aria-label="Página anterior"
            aria-disabled={paginaActual === 1}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          {/* Números de página */}
          <div className="flex items-center gap-1" role="list">
            {paginationNumbers.map((num, idx) => {
              if (num === "...") {
                return (
                  <div
                    key={`ellipsis-${idx}`}
                    className="hidden sm:flex items-center justify-center w-9 h-9 text-gray-400"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <MoreHorizontal size={18} />
                  </div>
                );
              }

              const isActive = num === paginaActual;

              return (
                <button
                  key={num}
                  onClick={() => setPaginaActual(num)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setPaginaActual(num))
                  }
                  className={`
                    flex items-center justify-center min-w-9 sm:min-w-10 h-9 sm:h-10 px-2 
                    rounded-lg text-sm font-semibold transition-all
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                    ${
                      isActive
                        ? "bg-primary-600 text-white shadow-md focus-visible:ring-primary-500"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-primary-500"
                    }
                    ${
                      // En mobile solo mostrar página actual y adyacentes
                      Math.abs(num - paginaActual) > 1 ? "hidden sm:flex" : ""
                    }
                  `}
                  aria-label={`${isActive ? "Página actual, página" : "Ir a página"} ${num}`}
                  aria-current={isActive ? "page" : undefined}
                  role="listitem"
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Página siguiente */}
          <button
            onClick={() =>
              setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
            }
            disabled={paginaActual === totalPaginas}
            onKeyDown={(e) =>
              handleKeyDown(e, () =>
                setPaginaActual(Math.min(totalPaginas, paginaActual + 1)),
              )
            }
            className={`
              flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg
              transition-all font-medium
              ${
                paginaActual === totalPaginas
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              }
            `}
            aria-label="Página siguiente"
            aria-disabled={paginaActual === totalPaginas}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          {/* Última página (solo desktop) */}
          <button
            onClick={() => setPaginaActual(totalPaginas)}
            disabled={paginaActual === totalPaginas}
            onKeyDown={(e) =>
              handleKeyDown(e, () => setPaginaActual(totalPaginas))
            }
            className={`
              hidden sm:flex items-center justify-center w-9 h-9 rounded-lg
              transition-all
              ${
                paginaActual === totalPaginas
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              }
            `}
            aria-label="Última página"
            aria-disabled={paginaActual === totalPaginas}
          >
            <ChevronsRight size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Input de ir a página (solo desktop) */}
        <div className="hidden lg:flex items-center gap-2 order-3">
          <label
            htmlFor="goto-page"
            className="text-sm text-gray-700 whitespace-nowrap"
          >
            Ir a:
          </label>
          <input
            id="goto-page"
            type="number"
            min="1"
            max={totalPaginas}
            value={paginaActual}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 1 && val <= totalPaginas) {
                setPaginaActual(val);
              }
            }}
            className="
              w-16 h-9 px-2 text-sm text-center
              border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            "
            aria-label="Número de página"
          />
          <span className="text-sm text-gray-500">de {totalPaginas}</span>
        </div>
      </div>
    </nav>
  );
};
