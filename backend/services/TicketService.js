const ventasEmpleadosRepository = require("../repositories/VentasEmpleadosRepository");
const ventasOnlineRepository = require("../repositories/VentasOnlineRepository");
const { createNotFoundError } = require("../errors");

const formatearTicket = (venta, detalles, tipo) => {
  const fecha = new Date(venta.fechaPago || venta.fechaVenta || venta.fecha);
  const esOnline = tipo === "online";

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
    entrega: esOnline
      ? {
          tipoEntrega: venta.tipoEntrega || null,
          sucursalNombre: venta.sucursalNombre || null,
          sucursalDireccion: venta.sucursalDireccion || null,
          direccionEnvio: venta.direccionEnvio || null,
        }
      : null,
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

const obtenerTicketVentaEmpleado = async (idVentaE) => {
  const venta = await ventasEmpleadosRepository.findById(idVentaE);

  if (!venta) {
    throw createNotFoundError(
      `Venta de empleado con ID ${idVentaE} no encontrada`,
    );
  }

  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  if (!detalles || detalles.length === 0) {
    throw createNotFoundError(
      `No se encontraron detalles para la venta ${idVentaE}`,
    );
  }

  return formatearTicket(venta, detalles, "empleado");
};

const obtenerTicketVentaOnline = async (idVentaO) => {
  const venta = await ventasOnlineRepository.findById(idVentaO);

  if (!venta) {
    throw createNotFoundError(`Venta online con ID ${idVentaO} no encontrada`);
  }

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
