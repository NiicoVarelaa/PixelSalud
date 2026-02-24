const ofertasService = require("../services/OfertasService");
const { Auditoria } = require("../helps");

const getOfertas = async (req, res, next) => {
  try {
    const ofertas = await ofertasService.obtenerOfertas();
    res.json(ofertas);
  } catch (error) {
    next(error);
  }
};

const getOferta = async (req, res, next) => {
  try {
    const { idOferta } = req.params;
    const oferta = await ofertasService.obtenerOfertaPorId(idOferta);
    res.json(oferta);
  } catch (error) {
    next(error);
  }
};

const createOferta = async (req, res, next) => {
  try {
    const oferta = await ofertasService.crearOferta(req.body);

    // Registrar auditoría de creación de oferta
    await Auditoria.registrarAuditoria(
      {
        evento: "OFERTA_CREADA",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Oferta creada para producto ID ${req.body.idProducto} - Descuento: ${req.body.porcentajeDescuento}%`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Ofertas",
        idEntidad: oferta.idOferta,
        datosAnteriores: null,
        datosNuevos: req.body,
      },
      req,
    );

    res.status(201).json({
      message: "Oferta creada correctamente y activa",
      oferta,
    });
  } catch (error) {
    next(error);
  }
};

const updateOferta = async (req, res, next) => {
  try {
    const { idOferta } = req.params;

    // Obtener oferta antes de actualizar para auditoría
    const ofertaAnterior = await ofertasService.obtenerOfertaPorId(idOferta);

    const oferta = await ofertasService.actualizarOferta(idOferta, req.body);

    // Registrar auditoría de actualización de oferta
    await Auditoria.registrarAuditoria(
      {
        evento: "OFERTA_MODIFICADA",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Oferta ID ${idOferta} actualizada`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Ofertas",
        idEntidad: idOferta,
        datosAnteriores: ofertaAnterior,
        datosNuevos: req.body,
      },
      req,
    );

    res.status(200).json({
      message: "Oferta actualizada correctamente",
      oferta,
    });
  } catch (error) {
    next(error);
  }
};

const updateOfertaEsActiva = async (req, res, next) => {
  try {
    const { idOferta } = req.params;
    const { esActiva } = req.body;

    // Obtener oferta antes de cambiar estado para auditoría
    const ofertaAnterior = await ofertasService.obtenerOfertaPorId(idOferta);

    await ofertasService.actualizarEstadoOferta(idOferta, esActiva);

    // Registrar auditoría de cambio de estado de oferta
    await Auditoria.registrarAuditoria(
      {
        evento: esActiva ? "OFERTA_ACTIVADA" : "OFERTA_DESACTIVADA",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Oferta ID ${idOferta} ${esActiva ? "activada" : "desactivada"}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Ofertas",
        idEntidad: idOferta,
        datosAnteriores: { esActiva: ofertaAnterior?.esActiva },
        datosNuevos: { esActiva },
      },
      req,
    );

    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

const deleteOferta = async (req, res, next) => {
  try {
    const { idOferta } = req.params;

    // Obtener oferta antes de eliminar para auditoría
    const ofertaAnterior = await ofertasService.obtenerOfertaPorId(idOferta);

    await ofertasService.eliminarOferta(idOferta);

    // Registrar auditoría de eliminación de oferta
    await Auditoria.registrarAuditoria(
      {
        evento: "OFERTA_ELIMINADA",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Oferta ID ${idOferta} eliminada`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Ofertas",
        idEntidad: idOferta,
        datosAnteriores: ofertaAnterior,
        datosNuevos: null,
      },
      req,
    );

    res.status(200).json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

const createOfertasMasivas = async (req, res, next) => {
  try {
    const CYBER_MONDAY_IDS = [
      1, 2, 3, 4, 12, 14, 15, 22, 25, 26, 28, 34, 42, 43, 44, 45, 46, 47, 48,
      49, 50, 51, 52,
    ];

    const { productIds = CYBER_MONDAY_IDS, porcentajeDescuento = 25.0 } =
      req.body;

    const resultado = await ofertasService.crearOfertasMasivas(
      productIds,
      porcentajeDescuento,
    );

    // Registrar auditoría de creación masiva de ofertas
    await Auditoria.registrarAuditoria(
      {
        evento: "OFERTAS_MASIVAS_CREADAS",
        modulo: Auditoria.MODULOS.OFERTAS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `${productIds.length} ofertas creadas masivamente - Descuento: ${porcentajeDescuento}%`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Ofertas",
        idEntidad: null,
        datosAnteriores: null,
        datosNuevos: {
          productIds,
          porcentajeDescuento,
          cantidad: productIds.length,
        },
      },
      req,
    );

    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

const getCyberMondayOffers = async (req, res, next) => {
  try {
    const ofertas = await ofertasService.obtenerOfertasCyberMonday();
    res.json(ofertas);
  } catch (error) {
    next(error);
  }
};

const getOfertasDestacadas = async (req, res, next) => {
  try {
    const ofertas = await ofertasService.obtenerOfertasDestacadas();
    res.json(ofertas);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOfertas,
  getOferta,
  createOferta,
  updateOferta,
  updateOfertaEsActiva,
  deleteOferta,
  createOfertasMasivas,
  getCyberMondayOffers,
  getOfertasDestacadas,
};
