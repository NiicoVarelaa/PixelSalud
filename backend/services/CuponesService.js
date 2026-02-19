const cuponesRepository = require("../repositories/CuponesRepository");
const { createValidationError, createNotFoundError } = require("../errors");
const crypto = require("crypto");

/**
 * Generar código único de cupón
 * @param {string} prefijo - Prefijo del cupón (ej: 'BIENVENIDA10')
 * @returns {string} - Código único
 */
const generarCodigoUnico = (prefijo = "CUPON") => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefijo}-${random}`;
};

/**
 * Crear cupón de bienvenida para nuevo usuario
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Object>} - Cupón creado
 */
const crearCuponBienvenida = async (idCliente) => {
  const codigo = generarCodigoUnico("BIENVENIDA10");

  // Fecha de vencimiento: 60 días desde hoy
  const fechaInicio = new Date();
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 60);

  const cuponData = {
    codigo,
    tipoCupon: "porcentaje",
    valorDescuento: 10.0,
    descripcion: "¡Bienvenido! 10% de descuento en tu primera compra",
    fechaInicio: fechaInicio.toISOString().split("T")[0],
    fechaVencimiento: fechaVencimiento.toISOString().split("T")[0],
    usoMaximo: 1,
    tipoUsuario: "nuevo",
    montoMinimo: 0,
    creadoPor: null, // Autogenerado por sistema
  };

  const idCupon = await cuponesRepository.create(cuponData);

  return {
    idCupon,
    codigo,
    valorDescuento: 10,
    fechaVencimiento: cuponData.fechaVencimiento,
  };
};

/**
 * Crear cupón personalizado (admin)
 * @param {Object} cuponData - Datos del cupón
 * @param {number} adminId - ID del admin que lo crea
 * @returns {Promise<Object>}
 */
const crearCupon = async (cuponData, adminId = null) => {
  // Generar código si no viene
  if (!cuponData.codigo) {
    cuponData.codigo = generarCodigoUnico("CUPON");
  }

  // Validar que el código no exista
  const existe = await cuponesRepository.findByCodigo(cuponData.codigo);
  if (existe) {
    throw createValidationError("El código de cupón ya existe");
  }

  // Validar fechas
  const fechaInicio = new Date(cuponData.fechaInicio);
  const fechaVencimiento = new Date(cuponData.fechaVencimiento);

  if (fechaVencimiento <= fechaInicio) {
    throw createValidationError(
      "La fecha de vencimiento debe ser posterior a la fecha de inicio",
    );
  }

  // Validar valor de descuento
  if (cuponData.tipoCupon === "porcentaje" && cuponData.valorDescuento > 100) {
    throw createValidationError(
      "El porcentaje de descuento no puede ser mayor a 100",
    );
  }

  if (cuponData.valorDescuento <= 0) {
    throw createValidationError("El valor de descuento debe ser mayor a 0");
  }

  cuponData.creadoPor = adminId;

  const idCupon = await cuponesRepository.create(cuponData);

  return {
    idCupon,
    ...cuponData,
  };
};

/**
 * Validar y calcular descuento de un cupón
 * @param {string} codigo - Código del cupón
 * @param {number} idCliente - ID del cliente
 * @param {number} montoCompra - Monto de la compra
 * @returns {Promise<Object>} - { valido, mensaje, descuento, cupon }
 */
const validarYCalcularDescuento = async (codigo, idCliente, montoCompra) => {
  const validacion = await cuponesRepository.validarCupon(
    codigo,
    idCliente,
    montoCompra,
  );

  if (!validacion.valido) {
    return {
      valido: false,
      mensaje: validacion.mensaje,
      descuento: 0,
      cupon: null,
    };
  }

  const { cupon } = validacion;
  let montoDescuento = 0;

  // Calcular descuento según tipo
  if (cupon.tipoCupon === "porcentaje") {
    montoDescuento = (montoCompra * cupon.valorDescuento) / 100;
  } else if (cupon.tipoCupon === "monto_fijo") {
    montoDescuento = cupon.valorDescuento;
  }

  // El descuento no puede ser mayor al monto de compra
  if (montoDescuento > montoCompra) {
    montoDescuento = montoCompra;
  }

  const montoFinal = montoCompra - montoDescuento;

  return {
    valido: true,
    mensaje: `Cupón aplicado: ${cupon.descripcion}`,
    descuento: parseFloat(montoDescuento.toFixed(2)),
    montoFinal: parseFloat(montoFinal.toFixed(2)),
    cupon: {
      idCupon: cupon.idCupon,
      codigo: cupon.codigo,
      tipoCupon: cupon.tipoCupon,
      valorDescuento: cupon.valorDescuento,
      descripcion: cupon.descripcion,
    },
  };
};

/**
 * Obtener todos los cupones (admin)
 * @returns {Promise<Array>}
 */
const obtenerTodosCupones = async () => {
  return await cuponesRepository.findAll();
};

/**
 * Obtener cupones activos
 * @returns {Promise<Array>}
 */
const obtenerCuponesActivos = async () => {
  return await cuponesRepository.findAllActivos();
};

/**
 * Obtener cupón por código
 * @param {string} codigo
 * @returns {Promise<Object>}
 */
const obtenerCuponPorCodigo = async (codigo) => {
  const cupon = await cuponesRepository.findByCodigo(codigo);

  if (!cupon) {
    throw createNotFoundError("Cupón no encontrado");
  }

  return cupon;
};

/**
 * Obtener historial de cupones usados por cliente
 * @param {number} idCliente
 * @returns {Promise<Array>}
 */
const obtenerHistorialCliente = async (idCliente) => {
  return await cuponesRepository.obtenerHistorialCliente(idCliente);
};

/**
 * Actualizar estado de cupón (admin)
 * @param {number} idCupon
 * @param {string} estado - 'activo' | 'inactivo'
 * @returns {Promise<boolean>}
 */
const actualizarEstado = async (idCupon, estado) => {
  const cupon = await cuponesRepository.findById(idCupon);

  if (!cupon) {
    throw createNotFoundError("Cupón no encontrado");
  }

  if (!["activo", "inactivo"].includes(estado)) {
    throw createValidationError("Estado inválido");
  }

  return await cuponesRepository.updateEstado(idCupon, estado);
};

/**
 * Eliminar cupón (admin)
 * @param {number} idCupon
 * @returns {Promise<boolean>}
 */
const eliminarCupon = async (idCupon) => {
  const eliminado = await cuponesRepository.deleteCupon(idCupon);

  if (!eliminado) {
    throw createValidationError(
      "No se puede eliminar un cupón que ya fue usado",
    );
  }

  return true;
};

/**
 * Verificar si cliente puede usar cupón de bienvenida
 * @param {number} idCliente
 * @returns {Promise<boolean>}
 */
const puedeUsarCuponBienvenida = async (idCliente) => {
  return await cuponesRepository.verificarPrimeraCompra(idCliente);
};

/**
 * Obtener todo el historial de uso de cupones (admin)
 * @returns {Promise<Array>}
 */
const obtenerTodoHistorial = async () => {
  return await cuponesRepository.obtenerTodoHistorial();
};

module.exports = {
  generarCodigoUnico,
  crearCuponBienvenida,
  crearCupon,
  validarYCalcularDescuento,
  obtenerTodosCupones,
  obtenerCuponesActivos,
  obtenerCuponPorCodigo,
  obtenerHistorialCliente,
  obtenerTodoHistorial,
  actualizarEstado,
  eliminarCupon,
  puedeUsarCuponBienvenida,
};
