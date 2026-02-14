const permisosService = require("../services/PermisosService");

/**
 * Obtiene todos los permisos
 * @route GET /permisos
 * @access Admin
 */
const getPermisos = async (req, res, next) => {
  try {
    const result = await permisosService.obtenerPermisos();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los permisos de un empleado específico
 * @route GET /permisos/:id
 * @access Admin
 */
const getPermisosByEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await permisosService.obtenerPermisosPorEmpleado(
      parseInt(id, 10),
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea permisos para un empleado
 * @route POST /permisos/crear/:id
 * @access Admin
 */
const createPermisos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await permisosService.crearPermisos(
      parseInt(id, 10),
      req.body,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza los permisos de un empleado
 * @route PUT /permisos/update/:id
 * @access Admin
 */
const updatePermisos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await permisosService.actualizarPermisos(
      parseInt(id, 10),
      req.body,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina los permisos de un empleado
 * @route DELETE /permisos/:id
 * @access Admin
 */
const deletePermisos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await permisosService.eliminarPermisos(parseInt(id, 10));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPermisos,
  getPermisosByEmpleado,
  createPermisos,
  updatePermisos,
  deletePermisos,
};
