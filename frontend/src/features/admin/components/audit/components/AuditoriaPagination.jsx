import PaginationProductos from "@features/admin/components/products/components/Pagination";

export const AuditoriaPagination = ({
  offset,
  limite,
  totalPaginas,
  onCambiarPagina,
}) => {
  const paginaActual = Math.floor(offset / limite) + 1;

  return (
    <PaginationProductos
      currentPage={paginaActual}
      totalPages={totalPaginas}
      onPageChange={onCambiarPagina}
    />
  );
};
