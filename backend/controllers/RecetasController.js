const recetasService = require("../services/RecetasService");

/**
 * Obtiene todas las recetas de un médico específico
 * @route GET /recetas/medico/:idMedico
 * @access Medico, Admin
 */
const getRecetasPorMedico = async (req, res, next) => {
  try {
    const { idMedico } = req.params;
    const result = await recetasService.obtenerRecetasPorMedico(
      parseInt(idMedico, 10),
    );
    res.status(200).json(result.data);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene recetas activas (no usadas) de un cliente
 * @route GET /recetas/cliente/:dniCliente
 * @access Cliente, Admin
 */
const getRecetasActivasCliente = async (req, res, next) => {
  try {
    const { dniCliente } = req.params;
    const result =
      await recetasService.obtenerRecetasActivasCliente(dniCliente);
    res.status(200).json(result.data);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una receta por su ID
 * @route GET /recetas/:id
 * @access Admin
 */
const getRecetaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await recetasService.obtenerRecetaPorId(parseInt(id, 10));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea múltiples recetas para un cliente
 * @route POST /recetas/crear
 * @access Medico
 */
const createRecetas = async (req, res, next) => {
  try {
    const result = await recetasService.crearRecetas(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Marca una receta como usada
 * @route PUT /recetas/usada/:idReceta
 * @access Cliente, Admin
 */
const marcarRecetaUsada = async (req, res, next) => {
  try {
    const { idReceta } = req.params;
    const result = await recetasService.marcarRecetaUsada(
      parseInt(idReceta, 10),
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Da de baja una receta (soft delete)
 * @route PUT /recetas/baja/:id
 * @access Medico, Admin
 */
const darBajaReceta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await recetasService.darBajaReceta(parseInt(id, 10));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Reactiva una receta
 * @route PUT /recetas/reactivar/:id
 * @access Admin
 */
const reactivarReceta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await recetasService.reactivarReceta(parseInt(id, 10));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecetasPorMedico,
  getRecetasActivasCliente,
  getRecetaPorId,
  createRecetas,
  marcarRecetaUsada,
  darBajaReceta,
  reactivarReceta,
};
