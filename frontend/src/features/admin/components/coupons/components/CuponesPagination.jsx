import PaginationProductos from "@features/admin/components/products/components/Pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CuponesPagination = ({
  paginaActual,
  totalPaginas,
  totalItems,
  onCambiarPagina,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="space-y-2" aria-label="Paginación de cupones">
      {totalPaginas > 1 ? (
        <PaginationProductos
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={onCambiarPagina}
        />
      ) : (
        <nav
          className="flex justify-center py-3 bg-white rounded-xl border border-gray-200 shadow-sm"
          role="navigation"
          aria-label="Paginación de cupones"
        >
          <div className="flex items-center justify-between w-full max-w-md px-4">
            <button
              type="button"
              disabled
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 opacity-40 cursor-not-allowed"
              aria-label="Página anterior"
              aria-disabled="true"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <span className="w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium text-green-600 border border-green-600">
              1
            </span>

            <button
              type="button"
              disabled
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 opacity-40 cursor-not-allowed"
              aria-label="Página siguiente"
              aria-disabled="true"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
