const recetasService = require("../services/RecetasService");

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

const getRecetaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await recetasService.obtenerRecetaPorId(parseInt(id, 10));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createRecetas = async (req, res, next) => {
  try {
    const result = await recetasService.crearRecetas(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

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

const darBajaReceta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await recetasService.darBajaReceta(parseInt(id, 10));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

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
