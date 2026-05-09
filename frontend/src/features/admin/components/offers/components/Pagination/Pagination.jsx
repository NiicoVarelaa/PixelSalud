import { useOfertasStore } from "../../store/useOfertasStore";
import { useOfertasFilters } from "../../hooks/useOfertasFilters";
import PaginationProductos from "@features/admin/components/products/components/Pagination";

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

  const { totalPaginas, totalItems } = useOfertasFilters({
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    idsProductosEnCampanas,
    paginaActual,
    itemsPorPagina,
  });

  if (cargando || totalItems === 0 || totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="space-y-2" aria-label="Paginación de ofertas">
      <PaginationProductos
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={setPaginaActual}
      />
    </div>
  );
};
