const aplicarDescuento = (precio, porcentajeDescuento) => {
  if (porcentajeDescuento <= 0) return precio;
  const descuento = precio * (porcentajeDescuento / 100);
  return parseFloat((precio - descuento).toFixed(2));
};

const calcularTotal = (
  items,
  precioField = "precio",
  cantidadField = "cantidad",
) => {
  return items.reduce((total, item) => {
    const precio = parseFloat(item[precioField]) || 0;
    const cantidad = parseInt(item[cantidadField]) || 0;
    return total + precio * cantidad;
  }, 0);
};

const formatearPrecio = (precio) => {
  return parseFloat(precio.toFixed(2));
};

const calcularPorcentajeDescuento = (precioOriginal, precioFinal) => {
  if (precioOriginal <= 0) return 0;
  const descuento = ((precioOriginal - precioFinal) / precioOriginal) * 100;
  return parseFloat(descuento.toFixed(2));
};

module.exports = {
  aplicarDescuento,
  calcularTotal,
  formatearPrecio,
  calcularPorcentajeDescuento,
};
