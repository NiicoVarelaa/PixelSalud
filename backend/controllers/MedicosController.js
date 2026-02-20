const medicosService = require("../services/MedicosService");

const getMedicos = async (req, res, next) => {
  try {
    const medicos = await medicosService.obtenerMedicos();
    res.status(200).json(medicos);
  } catch (error) {
    next(error);
  }
};

const getMedicoBajados = async (req, res, next) => {
  try {
    const medicos = await medicosService.obtenerMedicosInactivos();
    res.status(200).json(medicos);
  } catch (error) {
    next(error);
  }
};

const getMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medico = await medicosService.obtenerMedicoPorId(id);
    res.status(200).json(medico);
  } catch (error) {
    next(error);
  }
};

const createMedico = async (req, res, next) => {
  try {
    const resultado = await medicosService.crearMedico(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

const updateMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await medicosService.actualizarMedico(id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const darBajaMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await medicosService.darBajaMedico(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const reactivarMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await medicosService.reactivarMedico(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicos,
  getMedicoBajados,
  getMedico,
  createMedico,
  updateMedico,
  darBajaMedico,
  reactivarMedico,
};
