const ofertasService = require("../services/OfertasService");

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
    const oferta = await ofertasService.actualizarOferta(idOferta, req.body);
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
    await ofertasService.actualizarEstadoOferta(idOferta, esActiva);
    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

const deleteOferta = async (req, res, next) => {
  try {
    const { idOferta } = req.params;
    await ofertasService.eliminarOferta(idOferta);
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
