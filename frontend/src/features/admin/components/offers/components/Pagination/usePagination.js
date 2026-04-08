import { useMemo } from "react";
import { filterOfferProducts } from "../../utils/ofertasFilters";

export const usePagination = ({
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

    const total = Math.ceil(filtrados.length / itemsPorPagina);
    const indiceUltimo = paginaActual * itemsPorPagina;
    const indicePrimero = indiceUltimo - itemsPorPagina;

    return {
      totalPaginas: total,
      productosFiltrados: filtrados,
      inicio: filtrados.length > 0 ? indicePrimero + 1 : 0,
      fin: Math.min(indiceUltimo, filtrados.length),
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

export const getPaginationNumbers = (totalPaginas, paginaActual) => {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  const numbers = [];
  numbers.push(1);

  if (paginaActual <= 3) {
    numbers.push(2, 3, 4, "...", totalPaginas);
  } else if (paginaActual >= totalPaginas - 2) {
    numbers.push(
      "...",
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    );
  } else {
    numbers.push(
      "...",
      paginaActual - 1,
      paginaActual,
      paginaActual + 1,
      "...",
      totalPaginas,
    );
  }

  return numbers;
};
