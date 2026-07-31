import Default from "@assets/default.webp";
export { formatCurrency } from "@utils/formatMoneda";

export const getProductoImageUrl = (producto) => {
  if (!producto) return Default;

  if (producto.imagenes && producto.imagenes.length > 0) {
    const imagenPrincipal =
      producto.imagenes.find((img) => img.esPrincipal) || producto.imagenes[0];
    return imagenPrincipal.urlImagen;
  }

  return producto.imagen || producto.img || Default;
};

export const tooltipStyle = {
  backgroundColor: "#16a34a",
  border: "none",
  borderRadius: "12px",
  color: "#fff",
  padding: "12px 16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  fontSize: "14px",
  fontWeight: 600,
};

export const chartLabelStyle = {
  fontSize: "12px",
  fontWeight: 500,
};

export const tickFontSize = 12;

export const getTooltipStyle = (backgroundColor) => ({
  backgroundColor,
  border: "none",
  borderRadius: "12px",
  color: "#fff",
  padding: "12px 16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  fontSize: "14px",
  fontWeight: 600,
});

export const axisStyle = {
  fontSize: "12px",
  fontWeight: 500,
};

export const formatYAxis = (value) => `$${(value / 1000).toFixed(0)}k`;
