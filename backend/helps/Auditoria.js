const AuditoriaRepository = require("../repositories/AuditoriaRepository");

const EVENTOS_AUDITORIA = {
  LOGIN_EXITOSO: "LOGIN_EXITOSO",
  LOGIN_FALLIDO: "LOGIN_FALLIDO",
  LOGOUT: "LOGOUT",
  RECUPERACION_CONTRASENA: "RECUPERACION_CONTRASENA",
  CAMBIO_CONTRASENA: "CAMBIO_CONTRASENA",

  VENTA_CREADA: "VENTA_CREADA",
  VENTA_MODIFICADA: "VENTA_MODIFICADA",
  VENTA_ESTADO_CAMBIADO: "VENTA_ESTADO_CAMBIADO",
  VENTA_CANCELADA: "VENTA_CANCELADA",
  VENTA_ANULADA: "VENTA_ANULADA",

  PRODUCTO_CREADO: "PRODUCTO_CREADO",
  PRODUCTO_MODIFICADO: "PRODUCTO_MODIFICADO",
  PRODUCTO_ELIMINADO: "PRODUCTO_ELIMINADO",
  PRODUCTO_STOCK_ACTUALIZADO: "PRODUCTO_STOCK_ACTUALIZADO",

  PERMISO_OTORGADO: "PERMISO_OTORGADO",
  PERMISO_REVOCADO: "PERMISO_REVOCADO",
  PERMISO_MODIFICADO: "PERMISO_MODIFICADO",

  USUARIO_CREADO: "USUARIO_CREADO",
  USUARIO_MODIFICADO: "USUARIO_MODIFICADO",
  USUARIO_ELIMINADO: "USUARIO_ELIMINADO",
  USUARIO_DESACTIVADO: "USUARIO_DESACTIVADO",
  USUARIO_ACTIVADO: "USUARIO_ACTIVADO",

  OFERTA_CREADA: "OFERTA_CREADA",
  OFERTA_MODIFICADA: "OFERTA_MODIFICADA",
  OFERTA_ELIMINADA: "OFERTA_ELIMINADA",
  CAMPANA_CREADA: "CAMPANA_CREADA",
  CAMPANA_MODIFICADA: "CAMPANA_MODIFICADA",

  PAGO_RECIBIDO: "PAGO_RECIBIDO",
  PAGO_RECHAZADO: "PAGO_RECHAZADO",
  WEBHOOK_PROCESADO: "WEBHOOK_PROCESADO",
};

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

const ACCIONES = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  AUTORIZAR: "AUTORIZAR",
  DENEGAR: "DENEGAR",
};

const registrarAuditoria = async (datos, req = null) => {
  try {
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
    return null;
  }
};

const registrarLoginExitoso = async (usuario, req) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.LOGIN_EXITOSO,
      modulo: MODULOS.AUTENTICACION,
      accion: ACCIONES.LOGIN,
      descripcion: `Login exitoso de ${usuario.email}`,
      tipoUsuario: usuario.role || usuario.rol,
      idUsuario: usuario.id,
      nombreUsuario: `${usuario.nombre} ${usuario.apellido || ""}`.trim(),
      emailUsuario: usuario.email,
    },
    req,
  );
};

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

const registrarVentaCreada = async (venta, usuario, req) => {
  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.VENTA_CREADA,
      modulo: MODULOS.VENTAS,
      accion: ACCIONES.CREATE,
      descripcion: `Venta #${venta.id} creada por ${venta.totalPago} ARS`,
      tipoUsuario: usuario.role || usuario.rol,
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
      tipoUsuario: usuario.role || usuario.rol,
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

const registrarModificacionProducto = async (
  producto,
  usuario,
  datosAnteriores,
  req,
) => {
  const tipoUsuario = usuario?.role || usuario?.rol || "admin";
  const idUsuario = usuario?.id || null;
  const nombreUsuario = usuario?.nombre || null;
  const emailUsuario = usuario?.email || null;

  return registrarAuditoria(
    {
      evento: EVENTOS_AUDITORIA.PRODUCTO_MODIFICADO,
      modulo: MODULOS.PRODUCTOS,
      accion: ACCIONES.UPDATE,
      descripcion: `Producto "${producto.nombreProducto}" modificado`,
      tipoUsuario,
      idUsuario,
      nombreUsuario,
      emailUsuario,
      entidadAfectada: "Productos",
      idEntidad: producto.idProducto,
      datosAnteriores,
      datosNuevos: producto,
    },
    req,
  );
};

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
  EVENTOS_AUDITORIA,
  MODULOS,
  ACCIONES,
  registrarAuditoria,
  registrarLoginExitoso,
  registrarLoginFallido,
  registrarVentaCreada,
  registrarCambioPermiso,
  registrarModificacionProducto,
  registrarPagoRecibido,
};
