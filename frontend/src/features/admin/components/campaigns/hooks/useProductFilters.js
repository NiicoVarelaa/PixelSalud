import { useMemo } from "react";

export const useProductFilters = ({
  productos,
  busquedaProducto,
  categoriaFiltro,
}) => {
  const productosDisponibles = useMemo(() => {
    return productos.filter((p) => {
      const matchBusqueda = p.nombreProducto
        .toLowerCase()
        .includes(busquedaProducto.toLowerCase());
      const matchCategoria =
        !categoriaFiltro || p.categoria === categoriaFiltro;
      return matchBusqueda && matchCategoria;
    });
  }, [productos, busquedaProducto, categoriaFiltro]);

  return {
    productosDisponibles,
  };
};
