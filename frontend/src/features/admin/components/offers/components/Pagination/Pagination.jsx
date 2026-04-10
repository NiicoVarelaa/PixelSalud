import PaginationProductos from "@features/admin/components/products/components/Pagination";
import { useOfertasStore } from "../../store/useOfertasStore";
import { usePagination } from "./usePagination";

export const Pagination = () => {
  const {
    paginaActual,
    setPaginaActual,
    itemsPorPagina,
    productos,
    idsProductosEnCampanas,
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
      idsProductosEnCampanas,
      paginaActual,
      itemsPorPagina,
    });

  if (cargando || productosFiltrados.length === 0 || totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600" aria-live="polite">
        Mostrando {inicio}-{fin} de {totalItems} productos con oferta
      </p>

      <PaginationProductos
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={setPaginaActual}
      />
    </div>
  );
};
