import PaginationProductos from "@features/admin/components/products/components/Pagination";

export const ClientesPagination = ({
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
