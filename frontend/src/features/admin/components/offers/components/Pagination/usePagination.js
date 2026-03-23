import { useMemo } from "react";

const normalizeDiscount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};

const hasActiveOffer = (product) =>
  Boolean(product.enOferta) &&
  normalizeDiscount(product.porcentajeDescuento) > 0;

export const usePagination = ({
  productos,
  busqueda,
  filtroCategoria,
  filtroDescuento,
  paginaActual,
  itemsPorPagina,
}) => {
  return useMemo(() => {
    const productosConOferta = productos.filter((p) => hasActiveOffer(p));

    const filtrados = productosConOferta.filter((p) => {
      const cumpleBusqueda =
        !busqueda ||
        p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

      const cumpleCategoria =
        filtroCategoria === "todas" || p.categoria === filtroCategoria;

      let cumpleDescuento = true;
      if (filtroDescuento !== "todos") {
        cumpleDescuento =
          normalizeDiscount(p.porcentajeDescuento) === Number(filtroDescuento);
      }

      return cumpleBusqueda && cumpleCategoria && cumpleDescuento;
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
