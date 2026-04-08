import { ChevronLeft, ChevronRight } from "lucide-react";

const getPaginationNumbers = (totalPaginas, paginaActual) => {
  const delta = 1;
  const range = [];
  const withDots = [];

  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= paginaActual - delta && i <= paginaActual + delta)) {
      range.push(i);
    }
  }

  let last;
  for (const i of range) {
    if (last) {
      if (i - last === 2) withDots.push(last + 1);
      else if (i - last !== 1) withDots.push("...");
    }
    withDots.push(i);
    last = i;
  }
  return withDots;
};

export const EmpleadosPagination = ({ paginaActual, totalPaginas, onCambiarPagina }) => {
  if (totalPaginas <= 1) return null;

  const pages = getPaginationNumbers(totalPaginas, paginaActual);

  return (
    <nav
      className="flex items-center justify-center gap-1"
      role="navigation"
      aria-label="Paginación de empleados"
    >
      <button
        type="button"
        onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-label="Página anterior"
      >
        <ChevronLeft size={15} />
      </button>

      <div className="flex items-center gap-0.5">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="flex h-8 w-8 items-center justify-center text-xs text-gray-400" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onCambiarPagina(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                p === paginaActual
                  ? "border border-green-600 bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label={p === paginaActual ? `Página ${p} (actual)` : `Ir a página ${p}`}
              aria-current={p === paginaActual ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => onCambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
        disabled={paginaActual === totalPaginas}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-label="Página siguiente"
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
};