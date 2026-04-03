export const normalizeDiscount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};

export const hasActiveOffer = (product) =>
  Boolean(product.enOferta) &&
  normalizeDiscount(product.porcentajeDescuento) > 0;

export const filterOfferProducts = ({
  productos,
  busqueda,
  filtroCategoria,
  filtroDescuento,
}) => {
  const productosConOferta = productos.filter((p) => hasActiveOffer(p));

  return productosConOferta.filter((p) => {
    const cumpleBusqueda =
      !busqueda ||
      p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleCategoria =
      filtroCategoria === "todas" || p.categoria === filtroCategoria;

    const cumpleDescuento =
      filtroDescuento === "todos" ||
      normalizeDiscount(p.porcentajeDescuento) === Number(filtroDescuento);

    return cumpleBusqueda && cumpleCategoria && cumpleDescuento;
  });
};
