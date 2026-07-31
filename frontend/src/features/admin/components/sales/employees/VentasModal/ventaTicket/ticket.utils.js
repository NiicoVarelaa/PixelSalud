import Default from "@assets/default.webp";
export { formatMoneda as formatearMoneda } from "@utils/formatMoneda";

export const OPCIONES_METODO_PAGO = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Transferencia", label: "Transferencia" },
];

export const FALLBACK_IMAGE = Default;

export const getProductImage = (item, imagenesPorProducto) => {
  return (
    item.imagenProducto ||
    item.img ||
    item.urlImagen ||
    item.imagen ||
    item.imagenPrincipal ||
    imagenesPorProducto[item.idProducto] ||
    FALLBACK_IMAGE
  );
};
