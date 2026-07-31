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

export { formatPrice as formatearPrecio } from "@utils/formatMoneda";

export const calcularPrecioConDescuento = (producto) => {
  const tieneOferta =
    Boolean(producto.enOferta) && Number(producto.porcentajeDescuento) > 0;
  const precioBase = Number(producto.precioRegular) || 0;
  const descuento = Number(producto.porcentajeDescuento) || 0;

  return tieneOferta ? precioBase * (1 - descuento / 100) : precioBase;
};
