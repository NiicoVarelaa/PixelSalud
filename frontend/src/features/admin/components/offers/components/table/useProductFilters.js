import { useMemo } from "react";

const normalizeDiscount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};

const hasActiveOffer = (product) =>
  Boolean(product.enOferta) &&
  normalizeDiscount(product.porcentajeDescuento) > 0;

export const useProductFilters = ({
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
