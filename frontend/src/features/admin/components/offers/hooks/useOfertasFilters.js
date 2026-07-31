import { useMemo } from "react";
import { filterOfferProducts } from "../utils/ofertasFilters";

export const useOfertasFilters = ({
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

    const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    const productosPaginados = filtrados.slice(indiceInicio, indiceFin);

    return {
      productosPaginados,
      productosFiltrados: filtrados,
      totalPaginas,
      indiceInicio,
      indiceFin,
      totalItems: filtrados.length,
    };
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
