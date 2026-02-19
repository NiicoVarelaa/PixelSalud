const ventasOnlineRepository = require("../repositories/VentasOnlineRepository");
const { createNotFoundError, createValidationError } = require("../errors");

/**
 * Obtiene todas las ventas online de un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Object>}
 */
const obtenerVentasPorCliente = async (idCliente) => {
  const ventas = await ventasOnlineRepository.findByClienteId(idCliente);

  return {
    success: true,
    results: ventas,
  };
};

/**
 * Obtiene todas las ventas online del sistema
 * @returns {Promise<Object>}
 */
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

/**
 * Obtiene los detalles de una venta online específica
 * @param {number} idVentaO - ID de la venta online
 * @returns {Promise<Array>}
 */
const obtenerDetalleVenta = async (idVentaO) => {
  const detalles = await ventasOnlineRepository.findDetallesByVentaId(idVentaO);

  if (!detalles || detalles.length === 0) {
    throw createNotFoundError(
      `No se encontraron detalles para la venta con ID ${idVentaO}`,
    );
  }

  return detalles;
};

/**
 * Registra una nueva venta online con validación de stock y creación de dirección si es necesario
 * @param {Object} ventaData - Datos de la venta
 * @param {string} ventaData.metodoPago - Método de pago
 * @param {number} ventaData.idCliente - ID del cliente
 * @param {Array<Object>} ventaData.productos - Array de productos [{idProducto, cantidad, precioUnitario}]
 * @param {string} ventaData.tipoEntrega - Tipo de entrega ("Envio" o "Retiro")
 * @param {Object} [ventaData.direccionEnvio] - Datos de dirección si es envío
 * @returns {Promise<Object>}
 */
const registrarVentaOnline = async ({
  metodoPago,
  idCliente,
  productos,
  tipoEntrega,
  direccionEnvio,
}) => {
  // Validaciones básicas
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

  // Verificar que el cliente existe
  const clienteExists = await ventasOnlineRepository.existsCliente(idCliente);
  if (!clienteExists) {
    throw createNotFoundError(`Cliente con ID ${idCliente} no encontrado`);
  }

  // 1. Verificar stock de todos los productos
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

  // 2. Crear dirección de envío si es necesario
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

  // 3. Calcular total de la venta
  const totalPago = productos.reduce(
    (acc, p) => acc + p.precioUnitario * p.cantidad,
    0,
  );

  // 4. Crear la venta
  const idVentaO = await ventasOnlineRepository.create({
    totalPago,
    metodoPago,
    idCliente,
    tipoEntrega,
    estado: "Pendiente",
    idDireccion,
  });

  // 5. Crear detalles de la venta y actualizar stock
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

/**
 * Actualiza el estado de una venta online
 * @param {number} idVentaO - ID de la venta online
 * @param {string} nuevoEstado - Nuevo estado
 * @returns {Promise<Object>}
 */
const actualizarEstadoVenta = async (idVentaO, nuevoEstado) => {
  if (!idVentaO || !nuevoEstado) {
    throw createValidationError("Faltan datos para actualizar el estado");
  }

  // Verificar que la venta existe
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

/**
 * Actualiza una venta online completa (productos y método de pago)
 * Devuelve el stock de los productos anteriores, elimina detalles viejos,
 * crea nuevos detalles y actualiza el stock
 * @param {number} idVentaO - ID de la venta online
 * @param {Object} updateData - Datos a actualizar
 * @param {string} updateData.metodoPago - Método de pago
 * @param {Array<Object>} updateData.productos - Array de productos [{idProducto, cantidad}]
 * @returns {Promise<Object>}
 */
const actualizarVentaOnline = async (idVentaO, { metodoPago, productos }) => {
  if (!idVentaO || !productos || productos.length === 0) {
    throw createValidationError("Faltan datos para actualizar la venta");
  }

  // Verificar que la venta existe
  const venta = await ventasOnlineRepository.findById(idVentaO);
  if (!venta) {
    throw createNotFoundError(`Venta con ID ${idVentaO} no encontrada`);
  }

  // 1. Obtener detalles viejos para devolver stock
  const detallesViejos =
    await ventasOnlineRepository.findDetallesByVentaId(idVentaO);

  // 2. Devolver stock de productos anteriores
  for (const det of detallesViejos) {
    await ventasOnlineRepository.updateStockSumar(det.idProducto, det.cantidad);
  }

  // 3. Eliminar detalles viejos
  await ventasOnlineRepository.deleteDetalles(idVentaO);

  let totalCalculado = 0;

  // 4. Validar y crear nuevos detalles con precio actual de la BD
  for (const prod of productos) {
    const idProd = Number(prod.idProducto);
    const cant = Number(prod.cantidad);

    if (!idProd || cant <= 0) {
      throw createValidationError("Producto o cantidad inválida");
    }

    // Obtener precio y stock actual del producto
    const prodDB = await ventasOnlineRepository.getProductoPrecioYStock(idProd);

    if (!prodDB) {
      throw createNotFoundError(`Producto con ID ${idProd} no encontrado`);
    }

    const { precio, stock } = prodDB;

    // Verificar stock disponible
    if (stock < cant) {
      throw createValidationError(
        `Stock insuficiente para producto ID ${idProd}. Disponible: ${stock}, Solicitado: ${cant}`,
      );
    }

    // Crear nuevo detalle con precio actual
    await ventasOnlineRepository.createDetalle(idVentaO, idProd, cant, precio);

    // Descontar stock
    await ventasOnlineRepository.updateStockRestar(idProd, cant);

    totalCalculado += precio * cant;
  }

  // 5. Actualizar cabecera de la venta (total y método de pago)
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
