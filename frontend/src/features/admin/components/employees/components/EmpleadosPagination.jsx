import PaginationProductos from "@features/admin/components/products/components/Pagination";

export const EmpleadosPagination = ({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) => {
  return (
    <PaginationProductos
      currentPage={paginaActual}
      totalPages={totalPaginas}
      onPageChange={onCambiarPagina}
    />
  );
};
