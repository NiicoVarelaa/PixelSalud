const ventasEmpleadosRepository = require("../repositories/VentasEmpleadosRepository");
const ventasOnlineRepository = require("../repositories/VentasOnlineRepository");
const { createNotFoundError } = require("../errors");

/**
 * Formatea los datos de una venta para generar el ticket
 * @param {Object} venta - Datos de la venta
 * @param {Array} detalles - Detalles de productos de la venta
 * @param {string} tipo - 'empleado' o 'online'
 * @returns {Object} Ticket formateado
 */
const formatearTicket = (venta, detalles, tipo) => {
  const fecha = new Date(venta.fechaPago || venta.fechaVenta || venta.fecha);

  const ticket = {
    numero: venta.idVentaE || venta.idVentaO,
    tipo: tipo,
    fecha: fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    hora:
      venta.horaPago ||
      fecha.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    vendedor:
      tipo === "empleado"
        ? `${venta.nombreEmpleado || ""} ${venta.apellidoEmpleado || ""}`.trim() ||
          "Empleado"
        : "Venta Online",
    cliente:
      tipo === "online" && venta.nombreCliente
        ? `${venta.nombreCliente || ""} ${venta.apellidoCliente || ""}`.trim()
        : null,
    metodoPago: venta.metodoPago || "Efectivo",
    estado: venta.estado,
    productos: detalles.map((detalle) => ({
      cantidad: detalle.cantidad,
      descripcion: detalle.nombreProducto,
      precioUnitario: parseFloat(detalle.precioUnitario),
      subtotal: parseFloat(detalle.precioUnitario) * parseInt(detalle.cantidad),
    })),
    subtotal: parseFloat(venta.totalPago || 0),
    descuento: parseFloat(venta.descuento || 0),
    total: parseFloat(venta.totalPago || 0),
  };

  return ticket;
};

/**
 * Obtiene el ticket de una venta de empleado
 * @param {number} idVentaE - ID de la venta de empleado
 * @returns {Object} Ticket formateado
 */
const obtenerTicketVentaEmpleado = async (idVentaE) => {
  // Obtener datos de la venta
  const venta = await ventasEmpleadosRepository.findById(idVentaE);

  if (!venta) {
    throw createNotFoundError(
      `Venta de empleado con ID ${idVentaE} no encontrada`,
    );
  }

  // Obtener detalles de los productos
  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  if (!detalles || detalles.length === 0) {
    throw createNotFoundError(
      `No se encontraron detalles para la venta ${idVentaE}`,
    );
  }

  return formatearTicket(venta, detalles, "empleado");
};

/**
 * Obtiene el ticket de una venta online
 * @param {number} idVentaO - ID de la venta online
 * @returns {Object} Ticket formateado
 */
const obtenerTicketVentaOnline = async (idVentaO) => {
  // Obtener datos de la venta
  const venta = await ventasOnlineRepository.findById(idVentaO);

  if (!venta) {
    throw createNotFoundError(`Venta online con ID ${idVentaO} no encontrada`);
  }

  // Obtener detalles de los productos
  const detalles = await ventasOnlineRepository.findDetallesByVentaId(idVentaO);

  if (!detalles || detalles.length === 0) {
    throw createNotFoundError(
      `No se encontraron detalles para la venta online ${idVentaO}`,
    );
  }

  return formatearTicket(venta, detalles, "online");
};

module.exports = {
  obtenerTicketVentaEmpleado,
  obtenerTicketVentaOnline,
};
