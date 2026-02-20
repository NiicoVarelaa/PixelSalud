const ventasOnlineRepository = require("../repositories/VentasOnlineRepository");
const { createNotFoundError, createValidationError } = require("../errors");

const obtenerVentasPorCliente = async (idCliente) => {
  const ventas = await ventasOnlineRepository.findByClienteId(idCliente);

  return {
    success: true,
    results: ventas,
  };
};

const obtenerTodasLasVentas = async () => {
  const ventas = await ventasOnlineRepository.findAll();

  if (!ventas || ventas.length === 0) {
    return {
      message: "No se encontraron ventas online",
      results: [],
    };
  }

  return {
    message: "Éxito al traer todas las ventas",
    results: ventas,
  };
};

const obtenerDetalleVenta = async (idVentaO) => {
  const detalles = await ventasOnlineRepository.findDetallesByVentaId(idVentaO);

  if (!detalles || detalles.length === 0) {
    throw createNotFoundError(
      `No se encontraron detalles para la venta con ID ${idVentaO}`,
    );
  }

  return detalles;
};

const registrarVentaOnline = async ({
  metodoPago,
  idCliente,
  productos,
  tipoEntrega,
  direccionEnvio,
}) => {
  if (
    !metodoPago ||
    !idCliente ||
    !productos ||
    productos.length === 0 ||
    !tipoEntrega
  ) {
    throw createValidationError(
      "Faltan datos obligatorios para registrar la venta",
    );
  }

  const clienteExists = await ventasOnlineRepository.existsCliente(idCliente);
  if (!clienteExists) {
    throw createNotFoundError(`Cliente con ID ${idCliente} no encontrado`);
  }

  for (const prod of productos) {
    const stock = await ventasOnlineRepository.getProductoStock(
      prod.idProducto,
    );

    if (stock === null) {
      throw createNotFoundError(
        `Producto con ID ${prod.idProducto} no encontrado`,
      );
    }

    if (stock < prod.cantidad) {
      throw createValidationError(
        `Stock insuficiente del producto ID ${prod.idProducto}. Disponible: ${stock}, Solicitado: ${prod.cantidad}`,
      );
    }
  }

  let idDireccion = null;
  if (tipoEntrega === "Envio") {
    if (!direccionEnvio) {
      throw createValidationError(
        "Se requiere dirección de envío para entregas tipo 'Envio'",
      );
    }

    idDireccion = await ventasOnlineRepository.createDireccion({
      idCliente,
      ...direccionEnvio,
    });
  }

  const totalPago = productos.reduce(
    (acc, p) => acc + p.precioUnitario * p.cantidad,
    0,
  );

  const idVentaO = await ventasOnlineRepository.create({
    totalPago,
    metodoPago,
    idCliente,
    tipoEntrega,
    estado: "Pendiente",
    idDireccion,
  });

  for (const prod of productos) {
    await ventasOnlineRepository.createDetalle(
      idVentaO,
      prod.idProducto,
      prod.cantidad,
      prod.precioUnitario,
    );

    await ventasOnlineRepository.updateStockRestar(
      prod.idProducto,
      prod.cantidad,
    );
  }

  return {
    mensaje: "Venta registrada exitosamente",
    idVentaO,
  };
};

const actualizarEstadoVenta = async (idVentaO, nuevoEstado) => {
  if (!idVentaO || !nuevoEstado) {
    throw createValidationError("Faltan datos para actualizar el estado");
  }

  const venta = await ventasOnlineRepository.findById(idVentaO);
  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaO} no encontrada`);
  }

  const affectedRows = await ventasOnlineRepository.updateEstado(
    idVentaO,
    nuevoEstado,
  );

  if (affectedRows === 0) {
    throw createNotFoundError(`Venta con ID ${idVentaO} no encontrada`);
  }

  return {
    mensaje: "Estado actualizado correctamente",
  };
};

const actualizarVentaOnline = async (idVentaO, { metodoPago, productos }) => {
  if (!idVentaO || !productos || productos.length === 0) {
    throw createValidationError("Faltan datos para actualizar la venta");
  }

  const venta = await ventasOnlineRepository.findById(idVentaO);
  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaO} no encontrada`);
  }

  const detallesViejos =
    await ventasOnlineRepository.findDetallesByVentaId(idVentaO);

  for (const det of detallesViejos) {
    await ventasOnlineRepository.updateStockSumar(det.idProducto, det.cantidad);
  }

  await ventasOnlineRepository.deleteDetalles(idVentaO);

  let totalCalculado = 0;

  for (const prod of productos) {
    const idProd = Number(prod.idProducto);
    const cant = Number(prod.cantidad);

    if (!idProd || cant <= 0) {
      throw createValidationError("Producto o cantidad inválida");
    }

    const prodDB = await ventasOnlineRepository.getProductoPrecioYStock(idProd);

    if (!prodDB) {
      throw createNotFoundError(`Producto con ID ${idProd} no encontrado`);
    }

    const { precio, stock } = prodDB;

    if (stock < cant) {
      throw createValidationError(
        `Stock insuficiente para producto ID ${idProd}. Disponible: ${stock}, Solicitado: ${cant}`,
      );
    }

    await ventasOnlineRepository.createDetalle(idVentaO, idProd, cant, precio);

    await ventasOnlineRepository.updateStockRestar(idProd, cant);

    totalCalculado += precio * cant;
  }
  
  await ventasOnlineRepository.update(idVentaO, totalCalculado, metodoPago);

  return {
    message: "Venta online actualizada correctamente",
  };
};

module.exports = {
  obtenerVentasPorCliente,
  obtenerTodasLasVentas,
  obtenerDetalleVenta,
  registrarVentaOnline,
  actualizarEstadoVenta,
  actualizarVentaOnline,
};
