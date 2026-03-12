import { useMemo } from "react";

export const useProductFilters = ({
  productos,
  busqueda,
  filtroCategoria,
  filtroDescuento,
  paginaActual,
  itemsPorPagina,
}) => {
  return useMemo(() => {
    const filtrados = productos.filter((p) => {
      const cumpleBusqueda =
        !busqueda ||
        p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

      const cumpleCategoria =
        filtroCategoria === "todas" || p.categoria === filtroCategoria;

      let cumpleDescuento = true;
      if (filtroDescuento === "sin-oferta") {
        cumpleDescuento = !p.enOferta || p.porcentajeDescuento === 0;
      } else if (filtroDescuento !== "todos") {
        cumpleDescuento =
          p.enOferta && p.porcentajeDescuento === parseInt(filtroDescuento);
      }

      return cumpleBusqueda && cumpleCategoria && cumpleDescuento;
    });

    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    return filtrados.slice(indiceInicio, indiceFin);
  }, [
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    paginaActual,
    itemsPorPagina,
  ]);
};
