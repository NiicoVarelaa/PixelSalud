/**
 * Utilidades para manejo de precios y cálculos monetarios
 */

/**
 * Calcula el precio con descuento aplicado
 * @param {number} precio - Precio original
 * @param {number} porcentajeDescuento - Porcentaje de descuento (0-100)
 * @returns {number} Precio con descuento aplicado (redondeado a 2 decimales)
 */
const aplicarDescuento = (precio, porcentajeDescuento) => {
  if (porcentajeDescuento <= 0) return precio;
  const descuento = precio * (porcentajeDescuento / 100);
  return parseFloat((precio - descuento).toFixed(2));
};

/**
 * Calcula el total de un array de items
 * @param {Array} items - Array de objetos con { precio, cantidad }
 * @returns {number} Total calculado
 */
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

/**
 * Formatea un número como precio (2 decimales)
 * @param {number} precio - Precio a formatear
 * @returns {number} Precio formateado
 */
const formatearPrecio = (precio) => {
  return parseFloat(precio.toFixed(2));
};

/**
 * Calcula el porcentaje de descuento entre dos precios
 * @param {number} precioOriginal - Precio original
 * @param {number} precioFinal - Precio final
 * @returns {number} Porcentaje de descuento
 */
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
