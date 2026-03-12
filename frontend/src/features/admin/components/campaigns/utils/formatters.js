import Default from "@assets/default.webp";

export const getProductoImageUrl = (producto) => {
  if (!producto) return Default;
  if (producto.imagenes && producto.imagenes.length > 0) {
    const imagenPrincipal =
      producto.imagenes.find((img) => img.esPrincipal) || producto.imagenes[0];
    return imagenPrincipal.urlImagen;
  }
  return producto.img || Default;
};

export const formatearFecha = (fecha) => {
  if (!fecha) return "N/A";
  return new Date(fecha).toLocaleDateString("es-AR");
};

export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(precio);
};
