const empleadosService = require("../services/EmpleadosService");

const getEmpleados = async (req, res, next) => {
  try {
    const empleados = await empleadosService.obtenerEmpleados();
    res.status(200).json({ msg: "Exito", results: empleados });
  } catch (error) {
    next(error);
  }
};

const getEmpleadosBajados = async (req, res, next) => {
  try {
    const empleados = await empleadosService.obtenerEmpleadosInactivos();
    res.status(200).json(empleados);
  } catch (error) {
    next(error);
  }
};

const getEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await empleadosService.obtenerEmpleadoPorId(id);
    res.status(200).json(empleado);
  } catch (error) {
    next(error);
  }
};

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

const darBajaEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    await empleadosService.darBajaEmpleado(id);
    res.status(200).json({ message: "Empleado dado de baja con éxito" });
  } catch (error) {
    next(error);
  }
};

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
