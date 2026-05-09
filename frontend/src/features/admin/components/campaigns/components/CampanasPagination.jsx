import { ChevronLeft, ChevronRight } from "lucide-react";

export const CampanasPagination = ({
  paginaActual,
  totalPaginas,
  indiceInicio,
  indiceFin,
  totalItems,
  onCambiarPagina,
}) => {
  if (totalPaginas <= 1) return null;

  const mostrarDesde = indiceInicio + 1;
  const mostrarHasta = Math.min(indiceFin, totalItems);

  return (
    <div className="space-y-2" aria-label="Paginación de campañas">
      <p className="text-xs text-gray-500 text-center" aria-live="polite">
        Mostrando{" "}
        <span className="font-semibold text-gray-700">
          {mostrarDesde}–{mostrarHasta}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-gray-700">{totalItems}</span>{" "}
        campañas
      </p>

      <nav
        className="flex items-center justify-center gap-1"
        role="navigation"
        aria-label="Navegación de páginas"
      >
        <button
          type="button"
          onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
          disabled={paginaActual === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {[...Array(totalPaginas)].map((_, i) => {
          const page = i + 1;
          const active = paginaActual === page;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onCambiarPagina(page)}
              className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                active
                  ? "border border-green-600 bg-green-50 text-green-700"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
              aria-label={
                active ? `Página ${page} (actual)` : `Ir a página ${page}`
              }
              aria-current={active ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() =>
            onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))
          }
          disabled={paginaActual === totalPaginas}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};
