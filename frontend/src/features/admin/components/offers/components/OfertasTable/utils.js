import Default from "@assets/default.webp";

export const getProductoImageUrl = (producto) => {
  if (!producto) return Default;
  if (producto.imagenes?.length > 0) {
    const imagenPrincipal =
      producto.imagenes.find((img) => img.esPrincipal) || producto.imagenes[0];
    return imagenPrincipal.urlImagen;
  }
  return producto.img || Default;
};

export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(precio);
};

export const calcularPrecioConDescuento = (producto) => {
  const tieneOferta = producto.enOferta && producto.porcentajeDescuento > 0;
  return tieneOferta
    ? producto.precioRegular * (1 - producto.porcentajeDescuento / 100)
    : producto.precioRegular;
};
