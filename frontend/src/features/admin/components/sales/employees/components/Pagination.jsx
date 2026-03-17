import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const { totalPaginas, totalItems } = useMemo(() => {
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

    return {
      totalPaginas: total,
      totalItems: ventasFiltradas.length,
    };
  }, [ventas, filtro, filtroEstado, itemsPorPagina]);

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

    let prev;
    for (const num of range) {
      if (prev) {
        if (num - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (num - prev !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(num);
      prev = num;
    }

    return rangeWithDots;
  };

  if (cargando || totalItems === 0) {
    return null;
  }

  const paginationNumbers = getPaginationNumbers();

  return (
    <div className="w-full bg-white border border-gray-200/80 rounded-2xl px-4 py-4 shadow-sm">
      <nav
        className="flex justify-center"
        role="navigation"
        aria-label="Paginación de ventas"
      >
        <div className="flex items-center justify-between w-full max-w-md px-1 sm:px-4">
          <button
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            className={`
              w-10 h-10 flex items-center justify-center rounded-full
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
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

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

              const isActive = number === paginaActual;

              return (
                <button
                  key={number}
                  onClick={() => setPaginaActual(number)}
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

          <button
            onClick={() =>
              setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
            }
            disabled={paginaActual === totalPaginas}
            className={`
              w-10 h-10 flex items-center justify-center rounded-full
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
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </nav>
    </div>
  );
};
