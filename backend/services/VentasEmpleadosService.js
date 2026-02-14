const ventasEmpleadosRepository = require("../repositories/VentasEmpleadosRepository");
const { NotFoundError, ValidationError } = require("../errors");

/**
 * Obtiene todas las ventas de empleados
 * @returns {Promise<Array>}
 */
const obtenerTodasLasVentas = async () => {
  const ventas = await ventasEmpleadosRepository.findAll();

  if (!ventas || ventas.length === 0) {
    return [];
  }

  return ventas;
};

/**
 * Obtiene las ventas de un empleado específico
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<Array>}
 */
const obtenerVentasPorEmpleado = async (idEmpleado) => {
  // Verificar que el empleado existe
  const empleadoExists =
    await ventasEmpleadosRepository.existsEmpleado(idEmpleado);
  if (!empleadoExists) {
    throw new NotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  const ventas = await ventasEmpleadosRepository.findByEmpleadoId(idEmpleado);

  if (!ventas || ventas.length === 0) {
    return [];
  }

  return ventas;
};

/**
 * Obtiene los detalles de una venta específica
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Array>}
 */
const obtenerDetalleVenta = async (idVentaE) => {
  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  if (!detalles || detalles.length === 0) {
    throw new NotFoundError(
      `No se encontraron detalles para la venta con ID ${idVentaE}`,
    );
  }

  return detalles;
};

/**
 * Obtiene las ventas anuladas
 * @returns {Promise<Array>}
 */
const obtenerVentasAnuladas = async () => {
  const ventas = await ventasEmpleadosRepository.findAnuladas();
  return ventas || [];
};

/**
 * Obtiene las ventas completadas
 * @returns {Promise<Array>}
 */
const obtenerVentasCompletadas = async () => {
  const ventas = await ventasEmpleadosRepository.findCompletadas();
  return ventas || [];
};

/**
 * Obtiene una venta por ID (simple, para editar)
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Object>}
 */
const obtenerVentaPorId = async (idVentaE) => {
  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);

  if (!venta) {
    throw new NotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  return venta;
};

/**
 * Obtiene una venta por ID con detalles completos
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Object>}
 */
const obtenerVentaCompleta = async (idVentaE) => {
  const venta = await ventasEmpleadosRepository.findById(idVentaE);

  if (!venta) {
    throw new NotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  return venta;
};

/**
 * Registra una nueva venta de empleado con validación de stock
 * @param {Object} ventaData - Datos de la venta
 * @param {number} ventaData.idEmpleado - ID del empleado
 * @param {number} ventaData.totalPago - Total de la venta
 * @param {string} ventaData.metodoPago - Método de pago
 * @param {Array<Object>} ventaData.productos - Array de productos
 * @returns {Promise<Object>}
 */
const registrarVenta = async ({
  idEmpleado,
  totalPago,
  metodoPago,
  productos,
}) => {
  // Validaciones básicas
  if (!idEmpleado || !productos || productos.length === 0) {
    throw new ValidationError(
      "Faltan datos obligatorios para registrar la venta",
    );
  }

  // Verificar que el empleado existe
  const empleadoExists =
    await ventasEmpleadosRepository.existsEmpleado(idEmpleado);
  if (!empleadoExists) {
    throw new NotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  // 1. Verificar stock de todos los productos
  for (const prod of productos) {
    const productoData =
      await ventasEmpleadosRepository.getProductoStockYNombre(prod.idProducto);

    if (!productoData) {
      throw new NotFoundError(
        `Producto con ID ${prod.idProducto} no encontrado`,
      );
    }

    if (productoData.stock < prod.cantidad) {
      throw new ValidationError(
        `Stock insuficiente para: ${productoData.nombreProducto}. Disponible: ${productoData.stock}, Solicitado: ${prod.cantidad}`,
      );
    }
  }

  // 2. Crear la venta
  const idVentaE = await ventasEmpleadosRepository.create({
    idEmpleado,
    totalPago,
    metodoPago,
    estado: "completada",
  });

  // 3. Crear detalles de la venta y actualizar stock
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

/**
 * Actualiza una venta de empleado
 * Revierte stock anterior, elimina detalles viejos, crea nuevos detalles y actualiza stock
 * @param {number} idVentaE - ID de la venta
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<Object>}
 */
const actualizarVenta = async (
  idVentaE,
  { totalPago, metodoPago, productos, idEmpleado },
) => {
  if (!idVentaE || !productos || productos.length === 0) {
    throw new ValidationError("Faltan datos para actualizar la venta");
  }

  // Verificar que la venta existe
  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);
  if (!venta) {
    throw new NotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  // Verificar que no esté anulada
  if (venta.estado === "anulada") {
    throw new ValidationError("No se puede editar una venta anulada");
  }

  // Verificar que el empleado existe
  const empleadoExists =
    await ventasEmpleadosRepository.existsEmpleado(idEmpleado);
  if (!empleadoExists) {
    throw new NotFoundError(`Empleado con ID ${idEmpleado} no encontrado`);
  }

  // 1. Obtener detalles viejos para devolver stock
  const detallesViejos =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  // 2. Devolver stock de productos anteriores
  for (const det of detallesViejos) {
    await ventasEmpleadosRepository.updateStockSumar(
      det.idProducto,
      det.cantidad,
    );
  }

  // 3. Eliminar detalles viejos
  await ventasEmpleadosRepository.deleteDetalles(idVentaE);

  // 4. Verificar stock de nuevos productos
  for (const prod of productos) {
    const stock = await ventasEmpleadosRepository.getProductoStock(
      prod.idProducto,
    );

    if (stock === null) {
      throw new NotFoundError(
        `Producto con ID ${prod.idProducto} no encontrado`,
      );
    }

    if (stock < prod.cantidad) {
      throw new ValidationError(
        `Stock insuficiente para producto ID ${prod.idProducto}. Disponible: ${stock}, Solicitado: ${prod.cantidad}`,
      );
    }
  }

  // 5. Actualizar cabecera de la venta
  await ventasEmpleadosRepository.update(idVentaE, {
    totalPago,
    metodoPago,
    idEmpleado,
  });

  // 6. Crear nuevos detalles y actualizar stock
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

/**
 * Anula una venta de empleado
 * Devuelve el stock de los productos y cambia el estado a anulada
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Object>}
 */
const anularVenta = async (idVentaE) => {
  // Verificar que la venta existe
  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);
  if (!venta) {
    throw new NotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  // Verificar que no esté ya anulada
  if (venta.estado === "anulada") {
    throw new ValidationError("La venta ya está anulada");
  }

  // 1. Obtener detalles para devolver stock
  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  // 2. Devolver stock de todos los productos
  for (const det of detalles) {
    await ventasEmpleadosRepository.updateStockSumar(
      det.idProducto,
      det.cantidad,
    );
  }

  // 3. Actualizar estado a anulada
  await ventasEmpleadosRepository.updateEstado(idVentaE, "anulada");

  return {
    message: "Venta anulada correctamente",
  };
};

/**
 * Reactiva una venta anulada
 * Verifica stock disponible, descuenta stock y cambia estado a completada
 * @param {number} idVentaE - ID de la venta
 * @returns {Promise<Object>}
 */
const reactivarVenta = async (idVentaE) => {
  // Verificar que la venta existe
  const venta = await ventasEmpleadosRepository.findByIdSimple(idVentaE);
  if (!venta) {
    throw new NotFoundError(`Venta con ID ${idVentaE} no encontrada`);
  }

  // Verificar que esté anulada
  if (venta.estado !== "anulada") {
    throw new ValidationError("Solo se pueden reactivar ventas anuladas");
  }

  // 1. Obtener detalles para verificar y descontar stock
  const detalles =
    await ventasEmpleadosRepository.findDetallesByVentaId(idVentaE);

  // 2. Verificar stock disponible de todos los productos
  for (const det of detalles) {
    const stock = await ventasEmpleadosRepository.getProductoStock(
      det.idProducto,
    );

    if (stock === null) {
      throw new NotFoundError(
        `Producto con ID ${det.idProducto} no encontrado`,
      );
    }

    if (stock < det.cantidad) {
      throw new ValidationError(
        `Stock insuficiente para reactivar (Producto ID: ${det.idProducto}). Disponible: ${stock}, Necesario: ${det.cantidad}`,
      );
    }
  }

  // 3. Descontar stock de todos los productos
  for (const det of detalles) {
    await ventasEmpleadosRepository.updateStockRestar(
      det.idProducto,
      det.cantidad,
    );
  }

  // 4. Actualizar estado a completada
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
