import { ChevronLeft, ChevronRight } from "lucide-react";

export const CuponesPagination = ({
  paginaActual,
  totalPaginas,
  indicePrimero,
  indiceUltimo,
  totalItems,
  onPaginaAnterior,
  onPaginaSiguiente,
}) => {
  if (totalItems === 0) return null;

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3"
      aria-label="Paginación de cupones"
    >
      <p className="text-xs text-gray-500" aria-live="polite">
        <span className="font-semibold text-gray-700">{indicePrimero + 1}–{Math.min(indiceUltimo, totalItems)}</span>
        {" "}de{" "}
        <span className="font-semibold text-gray-700">{totalItems}</span> cupones
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPaginaAnterior}
          disabled={paginaActual === 1}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-2 text-xs text-gray-500">
          {paginaActual} / {totalPaginas}
        </span>
        <button
          type="button"
          onClick={onPaginaSiguiente}
          disabled={paginaActual === totalPaginas}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Página siguiente"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
};