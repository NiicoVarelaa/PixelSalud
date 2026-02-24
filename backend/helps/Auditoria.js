const AuditoriaRepository = require("../repositories/AuditoriaRepository");

/**
 * Constantes de eventos de auditoría
 */
const EVENTOS_AUDITORIA = {
  // Autenticación
  LOGIN_EXITOSO: "LOGIN_EXITOSO",
  LOGIN_FALLIDO: "LOGIN_FALLIDO",
  LOGOUT: "LOGOUT",
  RECUPERACION_CONTRASENA: "RECUPERACION_CONTRASENA",
  CAMBIO_CONTRASENA: "CAMBIO_CONTRASENA",

  // Ventas
  VENTA_CREADA: "VENTA_CREADA",
  VENTA_MODIFICADA: "VENTA_MODIFICADA",
  VENTA_CANCELADA: "VENTA_CANCELADA",
  VENTA_ANULADA: "VENTA_ANULADA",

  // Productos
  PRODUCTO_CREADO: "PRODUCTO_CREADO",
  PRODUCTO_MODIFICADO: "PRODUCTO_MODIFICADO",
  PRODUCTO_ELIMINADO: "PRODUCTO_ELIMINADO",
  PRODUCTO_STOCK_ACTUALIZADO: "PRODUCTO_STOCK_ACTUALIZADO",

  // Permisos
  PERMISO_OTORGADO: "PERMISO_OTORGADO",
  PERMISO_REVOCADO: "PERMISO_REVOCADO",
  PERMISO_MODIFICADO: "PERMISO_MODIFICADO",

  // Usuarios
  USUARIO_CREADO: "USUARIO_CREADO",
  USUARIO_MODIFICADO: "USUARIO_MODIFICADO",
  USUARIO_ELIMINADO: "USUARIO_ELIMINADO",
  USUARIO_DESACTIVADO: "USUARIO_DESACTIVADO",
  USUARIO_ACTIVADO: "USUARIO_ACTIVADO",

  // Ofertas
  OFERTA_CREADA: "OFERTA_CREADA",
  OFERTA_MODIFICADA: "OFERTA_MODIFICADA",
  OFERTA_ELIMINADA: "OFERTA_ELIMINADA",
  CAMPANA_CREADA: "CAMPANA_CREADA",
  CAMPANA_MODIFICADA: "CAMPANA_MODIFICADA",

  // MercadoPago
  PAGO_RECIBIDO: "PAGO_RECIBIDO",
  PAGO_RECHAZADO: "PAGO_RECHAZADO",
  WEBHOOK_PROCESADO: "WEBHOOK_PROCESADO",
};

/**
 * Constantes de módulos
 */
const MODULOS = {
  AUTENTICACION: "autenticacion",
  VENTAS: "ventas",
  PRODUCTOS: "productos",
  PERMISOS: "permisos",
  USUARIOS: "usuarios",
  OFERTAS: "ofertas",
  MERCADOPAGO: "mercadopago",
  CARRITO: "carrito",
  FAVORITOS: "favoritos",
  RECETAS: "recetas",
};

/**
 * Constantes de acciones
 */
const ACCIONES = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  AUTORIZAR: "AUTORIZAR",
  DENEGAR: "DENEGAR",
};

/**
 * Helper principal para registrar auditorías
 * @param {Object} datos - Datos de la auditoría
 * @param {Object} req - Request de Express (opcional, para obtener IP y user agent)
 * @returns {Promise<number>} ID del registro creado
 */
const registrarAuditoria = async (datos, req = null) => {
  try {
    // Extraer información del request si está disponible
    const ip = req ? req.ip || req.connection.remoteAddress : null;
    const userAgent = req ? req.get("user-agent") : null;

    const datosCompletos = {
      ...datos,
      ip,
      userAgent,
    };

    return await AuditoriaRepository.registrarAuditoria(datosCompletos);
  } catch (error) {
    console.error("❌ Error al registrar auditoría:", error);
    // No lanzamos el error para no interrumpir el flujo principal
    return null;
  }
};

/**
 * Registra un login exitoso
 * @param {Object} usuario - Datos del usuario
 * @param {Object} req - Request
 */
const registrarLoginExitoso = async (usuario, req) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.LOGIN_EXITOSO,
      modulo: MODULOS.AUTENTICACION,
      accion: ACCIONES.LOGIN,
      descripcion: `Login exitoso de ${usuario.email}`,
      tipoUsuario: usuario.rol,
      idUsuario: usuario.id,
      nombreUsuario: `${usuario.nombre} ${usuario.apellido || ""}`.trim(),
      emailUsuario: usuario.email,
    },
    req,
  );
};

/**
 * Registra un login fallido
 * @param {string} email - Email del usuario
 * @param {string} motivo - Motivo del fallo
 * @param {Object} req - Request
 */
const registrarLoginFallido = async (email, motivo, req) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.LOGIN_FALLIDO,
      modulo: MODULOS.AUTENTICACION,
      accion: ACCIONES.LOGIN,
      descripcion: `Login fallido para ${email}: ${motivo}`,
      tipoUsuario: "sistema",
      idUsuario: 0,
      emailUsuario: email,
    },
    req,
  );
};

/**
 * Registra una venta creada
 * @param {Object} venta - Datos de la venta
 * @param {Object} usuario - Usuario que realizó la venta
 * @param {Object} req - Request
 */
const registrarVentaCreada = async (venta, usuario, req) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.VENTA_CREADA,
      modulo: MODULOS.VENTAS,
      accion: ACCIONES.CREATE,
      descripcion: `Venta #${venta.id} creada por ${venta.totalPago} ARS`,
      tipoUsuario: usuario.rol,
      idUsuario: usuario.id,
      nombreUsuario: usuario.nombre,
      emailUsuario: usuario.email,
      entidadAfectada:
        venta.tipo === "online" ? "VentasOnlines" : "VentasEmpleados",
      idEntidad: venta.id,
      datosNuevos: venta,
    },
    req,
  );
};

/**
 * Registra un cambio en permisos
 * @param {Object} permiso - Datos del permiso
 * @param {Object} usuario - Usuario que modificó el permiso
 * @param {Object} datosAnteriores - Estado anterior
 * @param {Object} req - Request
 */
const registrarCambioPermiso = async (
  permiso,
  usuario,
  datosAnteriores,
  req,
) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.PERMISO_MODIFICADO,
      modulo: MODULOS.PERMISOS,
      accion: ACCIONES.UPDATE,
      descripcion: `Permisos modificados para empleado #${permiso.idEmpleado}`,
      tipoUsuario: usuario.rol,
      idUsuario: usuario.id,
      nombreUsuario: usuario.nombre,
      emailUsuario: usuario.email,
      entidadAfectada: "Permisos",
      idEntidad: permiso.idPermiso,
      datosAnteriores,
      datosNuevos: permiso,
    },
    req,
  );
};

/**
 * Registra una modificación de producto
 * @param {Object} producto - Datos nuevos del producto
 * @param {Object} usuario - Usuario que modificó
 * @param {Object} datosAnteriores - Estado anterior
 * @param {Object} req - Request
 */
const registrarModificacionProducto = async (
  producto,
  usuario,
  datosAnteriores,
  req,
) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.PRODUCTO_MODIFICADO,
      modulo: MODULOS.PRODUCTOS,
      accion: ACCIONES.UPDATE,
      descripcion: `Producto "${producto.nombreProducto}" modificado`,
      tipoUsuario: usuario.rol,
      idUsuario: usuario.id,
      nombreUsuario: usuario.nombre,
      emailUsuario: usuario.email,
      entidadAfectada: "Productos",
      idEntidad: producto.idProducto,
      datosAnteriores,
      datosNuevos: producto,
    },
    req,
  );
};

/**
 * Registra un pago recibido de MercadoPago
 * @param {Object} pago - Datos del pago
 * @param {Object} req - Request
 */
const registrarPagoRecibido = async (pago, req) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.PAGO_RECIBIDO,
      modulo: MODULOS.MERCADOPAGO,
      accion: ACCIONES.CREATE,
      descripcion: `Pago recibido: ${pago.transaction_amount} ARS - ID: ${pago.id}`,
      tipoUsuario: "sistema",
      idUsuario: 0,
      entidadAfectada: "VentasOnlines",
      idEntidad: pago.external_reference,
      datosNuevos: {
        paymentId: pago.id,
        status: pago.status,
        amount: pago.transaction_amount,
      },
    },
    req,
  );
};

module.exports = {
  // Constantes
  EVENTOS_AUDITORIA,
  MODULOS,
  ACCIONES,

  // Funciones genéricas
  registrarAuditoria,

  // Funciones específicas
  registrarLoginExitoso,
  registrarLoginFallido,
  registrarVentaCreada,
  registrarCambioPermiso,
  registrarModificacionProducto,
  registrarPagoRecibido,
};
