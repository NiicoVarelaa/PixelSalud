const ventasEmpleadosRepository = require("../repositories/VentasEmpleadosRepository");
const { createNotFoundError, createValidationError } = require("../errors");

const obtenerTodasLasVentas = async () => {
  const ventas = await ventasEmpleadosRepository.findAll();

  if (!ventas || ventas.length === 0) {
    return [];
  }

  return ventas;
};

const obtenerVentasPorEmpleado = async (idEmpleado) => {
  const empleadoExists =
    await ventasEmpleadosRepository.existsEmpleado(idEmpleado);
  if (!empleadoExists) {
    throw createNotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  const ventas = await ventasEmpleadosRepository.findByEmpleadoId(idEmpleado);

  if (!ventas || ventas.length === 0) {
    return [];
  }

  return ventas;
};

const obtenerDetalleVenta = async (idVentaE) => {
  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  if (!detalles || detalles.length === 0) {
    throw createNotFoundError(
      `No se encontraron detalles para la venta con ID ${idVentaE}`,
    );
  }

  return detalles;
};

const obtenerVentasAnuladas = async () => {
  const ventas = await ventasEmpleadosRepository.findAnuladas();
  return ventas || [];
};

const obtenerVentasCompletadas = async () => {
  const ventas = await ventasEmpleadosRepository.findCompletadas();
  return ventas || [];
};

const obtenerVentaPorId = async (idVentaE) => {
  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);

  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  return venta;
};

const obtenerVentaCompleta = async (idVentaE) => {
  const venta = await ventasEmpleadosRepository.findById(idVentaE);

  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  return venta;
};

const registrarVenta = async ({
  idEmpleado,
  totalPago,
  metodoPago,
  productos,
}) => {
  if (!idEmpleado || !productos || productos.length === 0) {
    throw createValidationError(
      "Faltan datos obligatorios para registrar la venta",
    );
  }

  const empleadoExists =
    await ventasEmpleadosRepository.existsEmpleado(idEmpleado);
  if (!empleadoExists) {
    throw createNotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  for (const prod of productos) {
    const productoData =
      await ventasEmpleadosRepository.getProductoStockYNombre(prod.idProducto);

    if (!productoData) {
      throw createNotFoundError(
        `Producto con ID ${prod.idProducto} no encontrado`,
      );
    }

    if (productoData.stock < prod.cantidad) {
      throw createValidationError(
        `Stock insuficiente para: ${productoData.nombreProducto}. Disponible: ${productoData.stock}, Solicitado: ${prod.cantidad}`,
      );
    }
  }

  const idVentaE = await ventasEmpleadosRepository.create({
    idEmpleado,
    totalPago,
    metodoPago,
    estado: "completada",
  });

  for (const prod of productos) {
    await ventasEmpleadosRepository.createDetalle(
      idVentaE,
      prod.idProducto,
      prod.cantidad,
      prod.precioUnitario,
      prod.recetaFisica || null,
    );

    await ventasEmpleadosRepository.updateStockRestar(
      prod.idProducto,
      prod.cantidad,
    );
  }

  return {
    message: "Venta registrada con éxito",
    idVentaE,
  };
};

const actualizarVenta = async (
  idVentaE,
  { totalPago, metodoPago, productos, idEmpleado },
) => {
  if (!idVentaE || !productos || productos.length === 0) {
    throw createValidationError("Faltan datos para actualizar la venta");
  }

  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);
  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  if (venta.estado === "anulada") {
    throw createValidationError("No se puede editar una venta anulada");
  }

  const empleadoExists =
    await ventasEmpleadosRepository.existsEmpleado(idEmpleado);
  if (!empleadoExists) {
    throw createNotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  const detallesViejos =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  for (const det of detallesViejos) {
    await ventasEmpleadosRepository.updateStockSumar(
      det.idProducto,
      det.cantidad,
    );
  }

  await ventasEmpleadosRepository.deleteDetalles(idVentaE);

  for (const prod of productos) {
    const stock = await ventasEmpleadosRepository.getProductoStock(
      prod.idProducto,
    );

    if (stock === null) {
      throw createNotFoundError(
        `Producto con ID ${prod.idProducto} no encontrado`,
      );
    }

    if (stock < prod.cantidad) {
      throw createValidationError(
        `Stock insuficiente para producto ID ${prod.idProducto}. Disponible: ${stock}, Solicitado: ${prod.cantidad}`,
      );
    }
  }

  await ventasEmpleadosRepository.update(idVentaE, {
    totalPago,
    metodoPago,
    idEmpleado,
  });

  for (const prod of productos) {
    await ventasEmpleadosRepository.createDetalle(
      idVentaE,
      prod.idProducto,
      prod.cantidad,
      prod.precioUnitario,
      prod.recetaFisica || null,
    );

    await ventasEmpleadosRepository.updateStockRestar(
      prod.idProducto,
      prod.cantidad,
    );
  }

  return {
    message: "Venta editada correctamente",
  };
};

const anularVenta = async (idVentaE) => {
  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);
  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  if (venta.estado === "anulada") {
    throw createValidationError("La venta ya está anulada");
  }

  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  for (const det of detalles) {
    await ventasEmpleadosRepository.updateStockSumar(
      det.idProducto,
      det.cantidad,
    );
  }

  await ventasEmpleadosRepository.updateEstado(idVentaE, "anulada");

  return {
    message: "Venta anulada correctamente",
  };
};

const reactivarVenta = async (idVentaE) => {
  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);
  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  if (venta.estado !== "anulada") {
    throw createValidationError("Solo se pueden reactivar ventas anuladas");
  }

  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  for (const det of detalles) {
    const stock = await ventasEmpleadosRepository.getProductoStock(
      det.idProducto,
    );

    if (stock === null) {
      throw createNotFoundError(
        `Producto con ID ${det.idProducto} no encontrado`,
      );
    }

    if (stock < det.cantidad) {
      throw createValidationError(
        `Stock insuficiente para reactivar (Producto ID: ${det.idProducto}). Disponible: ${stock}, Necesario: ${det.cantidad}`,
      );
    }
  }

  for (const det of detalles) {
    await ventasEmpleadosRepository.updateStockRestar(
      det.idProducto,
      det.cantidad,
    );
  }

  await ventasEmpleadosRepository.updateEstado(idVentaE, "completada");

  return {
    message: "Venta reactivada exitosamente",
  };
};

module.exports = {
  obtenerTodasLasVentas,
  obtenerVentasPorEmpleado,
  obtenerDetalleVenta,
  obtenerVentasAnuladas,
  obtenerVentasCompletadas,
  obtenerVentaPorId,
  obtenerVentaCompleta,
  registrarVenta,
  actualizarVenta,
  anularVenta,
  reactivarVenta,
};
