const permisosService = require("../services/PermisosService");

const getPermisos = async (req, res, next) => {
  try {
    const result = await permisosService.obtenerPermisos();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

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
