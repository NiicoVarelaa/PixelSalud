export const normalizeDiscount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};

export const hasActiveOffer = (product) =>
  Boolean(product.enOferta) &&
  normalizeDiscount(product.porcentajeDescuento) > 0;

const normalizeDiscountFilter = (value) => {
  const normalized = String(value ?? "todos")
    .trim()
    .toLowerCase();

  if (normalized === "todos") {
    return { isAll: true, value: null };
  }

  const numeric = Number(normalized.replace("%", "").replace("off", "").trim());
  return { isAll: false, value: Number.isFinite(numeric) ? numeric : null };
};

export const filterOfferProducts = ({
  productos,
  busqueda,
  filtroCategoria,
  filtroDescuento,
  idsProductosEnCampanas = [],
}) => {
  const idsEnCampana = new Set(idsProductosEnCampanas);
  const descuentoFilter = normalizeDiscountFilter(filtroDescuento);
  const productosConOferta = productos.filter(
    (p) => hasActiveOffer(p) && !idsEnCampana.has(p.idProducto),
  );

  return productosConOferta.filter((p) => {
    const cumpleBusqueda =
      !busqueda ||
      p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleCategoria =
      filtroCategoria === "todas" || p.categoria === filtroCategoria;

    const cumpleDescuento =
      descuentoFilter.isAll ||
      (descuentoFilter.value !== null &&
        normalizeDiscount(p.porcentajeDescuento) === descuentoFilter.value);

    return cumpleBusqueda && cumpleCategoria && cumpleDescuento;
  });
};
