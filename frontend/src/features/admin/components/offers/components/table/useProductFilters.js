import { useMemo } from "react";
import { filterOfferProducts } from "../../utils/ofertasFilters";

export const useProductFilters = ({
  productos,
  busqueda,
  filtroCategoria,
  filtroDescuento,
  idsProductosEnCampanas,
  paginaActual,
  itemsPorPagina,
}) => {
  return useMemo(() => {
    const filtrados = filterOfferProducts({
      productos,
      busqueda,
      filtroCategoria,
      filtroDescuento,
      idsProductosEnCampanas,
    });

    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    return filtrados.slice(indiceInicio, indiceFin);
  }, [
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    idsProductosEnCampanas,
    paginaActual,
    itemsPorPagina,
  ]);
};
