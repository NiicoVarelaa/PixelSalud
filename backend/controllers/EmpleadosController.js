const empleadosService = require("../services/EmpleadosService");
const { Auditoria } = require("../helps");

const getEmpleados = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const empleados = await empleadosService.obtenerEmpleadosPaginados(page, limit);
    res.status(200).json(empleados);
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

    await Auditoria.registrarAuditoria(
      {
        evento: "EMPLEADO_CREADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Empleado "${empleadoData.nombreEmpleado} ${empleadoData.apellidoEmpleado}" creado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Empleados",
        idEntidad: nuevoEmpleado.id,
        datosAnteriores: null,
        datosNuevos: { ...empleadoData, permisos },
      },
      req,
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

    const empleadoAnterior = await empleadosService.obtenerEmpleadoPorId(id);

    await empleadosService.actualizarEmpleado(id, empleadoData, permisos);

    await Auditoria.registrarAuditoria(
      {
        evento: "EMPLEADO_MODIFICADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Empleado ID ${id} actualizado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Empleados",
        idEntidad: id,
        datosAnteriores: empleadoAnterior,
        datosNuevos: { ...empleadoData, permisos },
      },
      req,
    );

    res.status(200).json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

const darBajaEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const empleadoAnterior = await empleadosService.obtenerEmpleadoPorId(id);

    await empleadosService.darBajaEmpleado(id);

    await Auditoria.registrarAuditoria(
      {
        evento: "EMPLEADO_DESACTIVADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Empleado "${empleadoAnterior.nombreEmpleado} ${empleadoAnterior.apellidoEmpleado}" dado de baja`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Empleados",
        idEntidad: id,
        datosAnteriores: empleadoAnterior,
        datosNuevos: { baja: true },
      },
      req,
    );

    res.status(200).json({ message: "Empleado dado de baja con éxito" });
  } catch (error) {
    next(error);
  }
};

const reactivarEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;

    const empleadoAnterior = await empleadosService.obtenerEmpleadoPorId(id);

    await empleadosService.reactivarEmpleado(id);

    await Auditoria.registrarAuditoria(
      {
        evento: "EMPLEADO_REACTIVADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.AUTORIZAR,
        descripcion: `Empleado "${empleadoAnterior.nombreEmpleado} ${empleadoAnterior.apellidoEmpleado}" reactivado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Empleados",
        idEntidad: id,
        datosAnteriores: empleadoAnterior,
        datosNuevos: { baja: false },
      },
      req,
    );

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
