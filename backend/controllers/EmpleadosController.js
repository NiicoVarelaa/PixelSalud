const empleadosService = require("../services/EmpleadosService");

/**
 * Controladores para el módulo de Empleados
 * Maneja las peticiones HTTP y delega la lógica al servicio
 */

/**
 * Obtiene todos los empleados activos con permisos
 * GET /Empleados
 */
const getEmpleados = async (req, res, next) => {
  try {
    const empleados = await empleadosService.obtenerEmpleados();
    res.status(200).json({ msg: "Exito", results: empleados });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene empleados inactivos
 * GET /Empleados/Bajados
 */
const getEmpleadosBajados = async (req, res, next) => {
  try {
    const empleados = await empleadosService.obtenerEmpleadosInactivos();
    res.status(200).json(empleados);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un empleado por ID con sus permisos
 * GET /Empleados/:id
 */
const getEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await empleadosService.obtenerEmpleadoPorId(id);
    res.status(200).json(empleado);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo empleado con permisos
 * POST /Empleados/crear
 */
const createEmpleado = async (req, res, next) => {
  try {
    const { permisos, ...empleadoData } = req.body;
    const nuevoEmpleado = await empleadosService.crearEmpleado(
      empleadoData,
      permisos,
    );
    res.status(201).json({
      message: permisos
        ? "Empleado y permisos creados correctamente"
        : "Empleado creado correctamente (sin permisos definidos)",
      empleado: nuevoEmpleado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un empleado y sus permisos
 * PUT /empleados/actualizar/:id
 */
const updateEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permisos, ...empleadoData } = req.body;
    await empleadosService.actualizarEmpleado(id, empleadoData, permisos);
    res.status(200).json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * Da de baja un empleado (soft delete)
 * PUT /empleados/baja/:id
 */
const darBajaEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    await empleadosService.darBajaEmpleado(id);
    res.status(200).json({ message: "Empleado dado de baja con éxito" });
  } catch (error) {
    next(error);
  }
};

/**
 * Reactiva un empleado dado de baja
 * PUT /empleados/reactivar/:id
 */
const reactivarEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    await empleadosService.reactivarEmpleado(id);
    res.status(200).json({ message: "Empleado reactivado con éxito" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmpleados,
  getEmpleadosBajados,
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  darBajaEmpleado,
  reactivarEmpleado,
};
