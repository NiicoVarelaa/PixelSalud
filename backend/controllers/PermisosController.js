const permisosService = require("../services/PermisosService");
const { Auditoria } = require("../helps");

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

    // Registrar auditoría de creación de permisos
    await Auditoria.registrarCambioPermiso(
      {
        idEmpleado: parseInt(id, 10),
        ...req.body,
      },
      req.user,
      null, // No hay datos anteriores
      req,
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updatePermisos = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener permisos anteriores para auditoría
    const permisosAnteriores = await permisosService.obtenerPermisosPorEmpleado(
      parseInt(id, 10),
    );

    const result = await permisosService.actualizarPermisos(
      parseInt(id, 10),
      req.body,
    );

    // Registrar auditoría de actualización de permisos
    await Auditoria.registrarCambioPermiso(
      {
        idEmpleado: parseInt(id, 10),
        ...req.body,
      },
      req.user,
      permisosAnteriores.data,
      req,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deletePermisos = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener permisos antes de eliminar para auditoría
    const permisosAnteriores = await permisosService.obtenerPermisosPorEmpleado(
      parseInt(id, 10),
    );

    const result = await permisosService.eliminarPermisos(parseInt(id, 10));

    // Registrar auditoría de eliminación de permisos
    await Auditoria.registrarAuditoria(
      {
        evento: Auditoria.EVENTOS_AUDITORIA.PERMISO_REVOCADO,
        modulo: Auditoria.MODULOS.PERMISOS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Permisos revocados del empleado ID ${id}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Permisos",
        idEntidad: id,
        datosAnteriores: permisosAnteriores.data,
        datosNuevos: null,
      },
      req,
    );

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
