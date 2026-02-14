const medicosService = require("../services/MedicosService");

/**
 * Controladores para el módulo de Médicos
 * Maneja las peticiones HTTP y delega la lógica al servicio
 */

/**
 * Obtiene todos los médicos activos
 * GET /medicos
 */
const getMedicos = async (req, res, next) => {
  try {
    const medicos = await medicosService.obtenerMedicos();
    res.status(200).json(medicos);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene médicos inactivos
 * GET /medicos/bajados
 */
const getMedicoBajados = async (req, res, next) => {
  try {
    const medicos = await medicosService.obtenerMedicosInactivos();
    res.status(200).json(medicos);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un médico por ID
 * GET /medicos/:id
 */
const getMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medico = await medicosService.obtenerMedicoPorId(id);
    res.status(200).json(medico);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo médico
 * POST /medicos/crear
 */
const createMedico = async (req, res, next) => {
  try {
    const resultado = await medicosService.crearMedico(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un médico
 * PUT /medicos/actualizar/:id
 */
const updateMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await medicosService.actualizarMedico(id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Da de baja un médico (soft delete)
 * PUT /medicos/baja/:id
 */
const darBajaMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await medicosService.darBajaMedico(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Reactiva un médico
 * PUT /medicos/reactivar/:id
 */
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
