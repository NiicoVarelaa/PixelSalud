const campanasService = require("../services/CampanasService");

const getCampanas = async (req, res, next) => {
  try {
    const campanas = await campanasService.obtenerCampanas();
    res.json(campanas);
  } catch (error) {
    next(error);
  }
};

const getCampanasActivas = async (req, res, next) => {
  try {
    const campanas = await campanasService.obtenerCampanasActivas();
    res.json(campanas);
  } catch (error) {
    next(error);
  }
};

const getCampana = async (req, res, next) => {
  try {
    const { idCampana } = req.params;
    const campana = await campanasService.obtenerCampanaPorId(idCampana);
    res.json(campana);
  } catch (error) {
    next(error);
  }
};

const getCampanaConProductos = async (req, res, next) => {
  try {
    const { idCampana } = req.params;
    const campana = await campanasService.obtenerCampanaConProductos(idCampana);
    res.json(campana);
  } catch (error) {
    next(error);
  }
};

const createCampana = async (req, res, next) => {
  try {
    const campana = await campanasService.crearCampana(req.body);
    res.status(201).json(campana);
  } catch (error) {
    next(error);
  }
};

const updateCampana = async (req, res, next) => {
  try {
    const { idCampana } = req.params;
    const campana = await campanasService.actualizarCampana(
      idCampana,
      req.body,
    );
    res.json(campana);
  } catch (error) {
    next(error);
  }
};

const deleteCampana = async (req, res, next) => {
  try {
    const { idCampana } = req.params;
    const resultado = await campanasService.eliminarCampana(idCampana);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

const getProductosCampana = async (req, res, next) => {
  try {
    const { idCampana } = req.params;
    const soloActivos = req.query.activos === "true";
    const productos = await campanasService.obtenerProductosDeCampana(
      idCampana,
      soloActivos,
    );
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const addProductosCampana = async (req, res, next) => {
  try {
    const { idCampana } = req.params;
    const { productosIds, porcentajeDescuentoOverride } = req.body;

    if (Array.isArray(productosIds)) {
      const resultado = await campanasService.agregarProductos(
        idCampana,
        productosIds,
        porcentajeDescuentoOverride,
      );
      res.status(201).json(resultado);
    } else {
      const resultado = await campanasService.agregarProducto(
        idCampana,
        req.body.idProducto,
        porcentajeDescuentoOverride,
      );
      res.status(201).json(resultado);
    }
  } catch (error) {
    next(error);
  }
};

const removeProductosCampana = async (req, res, next) => {
  try {
    const { idCampana } = req.params;
    const { productosIds, idProducto } = req.body;

    if (Array.isArray(productosIds)) {
      const resultado = await campanasService.quitarProductos(
        idCampana,
        productosIds,
      );
      res.json(resultado);
    } else if (idProducto) {
      const resultado = await campanasService.quitarProducto(
        idCampana,
        idProducto,
      );
      res.json(resultado);
    } else {
      throw new Error("Debe proporcionar idProducto o productosIds");
    }
  } catch (error) {
    next(error);
  }
};

const updateOverride = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { porcentajeDescuentoOverride } = req.body;
    const resultado = await campanasService.actualizarDescuentoOverride(
      id,
      porcentajeDescuentoOverride,
    );
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

const getCampanasDeProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const campanas =
      await campanasService.obtenerCampanasDeProducto(idProducto);
    res.json(campanas);
  } catch (error) {
    next(error);
  }
};

const getMejorDescuento = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const descuento = await campanasService.obtenerMejorDescuento(idProducto);
    res.json(
      descuento || {
        mensaje: "No hay descuentos activos para este producto",
      },
    );
  } catch (error) {
    next(error);
  }
};

const getCampanasProximasAVencer = async (req, res, next) => {
  try {
    const dias = parseInt(req.query.dias) || 7;
    const campanas = await campanasService.obtenerCampanasProximasAVencer(dias);
    res.json(campanas);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCampanas,
  getCampanasActivas,
  getCampana,
  getCampanaConProductos,
  createCampana,
  updateCampana,
  deleteCampana,
  getProductosCampana,
  addProductosCampana,
  removeProductosCampana,
  updateOverride,
  getCampanasDeProducto,
  getMejorDescuento,
  getCampanasProximasAVencer,
};
