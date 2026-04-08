import { useMemo } from "react";

export const useProductFilters = ({
  productos,
  busquedaProducto,
  categoriaFiltro,
  idsProductosBloqueados = [],
}) => {
  const productosDisponibles = useMemo(() => {
    const idsBloqueadosSet = new Set(idsProductosBloqueados);

    return productos.filter((p) => {
      if (idsBloqueadosSet.has(p.idProducto)) return false;

      const matchBusqueda = p.nombreProducto
        .toLowerCase()
        .includes(busquedaProducto.toLowerCase());
      const matchCategoria =
        !categoriaFiltro || p.categoria === categoriaFiltro;
      return matchBusqueda && matchCategoria;
    });
  }, [productos, busquedaProducto, categoriaFiltro, idsProductosBloqueados]);

  return {
    productosDisponibles,
  };
};
