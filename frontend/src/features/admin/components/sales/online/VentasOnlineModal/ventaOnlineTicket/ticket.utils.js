import Default from "@assets/default.webp";

export const OPCIONES_METODO_PAGO = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta", label: "Tarjeta" },
  { value: "Transferencia", label: "Transferencia" },
];

export const formatearMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(valor) || 0);

export const getProductImage = (item, imagenesPorProducto) => {
  return (
    item.imagenProducto ||
    item.img ||
    item.urlImagen ||
    item.imagen ||
    item.imagenPrincipal ||
    imagenesPorProducto[item.idProducto] ||
    Default
  );
};

export const FALLBACK_IMAGE = Default;
