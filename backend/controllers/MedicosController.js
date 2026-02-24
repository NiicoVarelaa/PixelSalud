const medicosService = require("../services/MedicosService");
const { Auditoria } = require("../helps");

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

    // Registrar auditoría de creación de médico
    await Auditoria.registrarAuditoria(
      {
        evento: "MEDICO_CREADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Médico "${req.body.nombreMedico} ${req.body.apellidoMedico}" creado - Matrícula: ${req.body.matricula}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Medicos",
        idEntidad: resultado.insertId,
        datosAnteriores: null,
        datosNuevos: { ...req.body, contraMedico: "[OCULTA]" },
      },
      req,
    );

    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

const updateMedico = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener médico antes de actualizar para auditoría
    const medicoAnterior = await medicosService.obtenerMedicoPorId(id);

    const resultado = await medicosService.actualizarMedico(id, req.body);

    // Registrar auditoría de actualización de médico
    await Auditoria.registrarAuditoria(
      {
        evento: "MEDICO_MODIFICADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Médico ID ${id} actualizado`,
        tipoUsuario: req.user?.role || "medico",
        idUsuario: req.user?.id || id,
        entidadAfectada: "Medicos",
        idEntidad: id,
        datosAnteriores: medicoAnterior,
        datosNuevos: {
          ...req.body,
          contraMedico: req.body.contraMedico ? "[OCULTA]" : undefined,
        },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const darBajaMedico = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener médico antes de dar de baja para auditoría
    const medicoAnterior = await medicosService.obtenerMedicoPorId(id);

    const resultado = await medicosService.darBajaMedico(id);

    // Registrar auditoría de baja de médico
    await Auditoria.registrarAuditoria(
      {
        evento: "MEDICO_DESACTIVADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Médico "${medicoAnterior.nombreMedico} ${medicoAnterior.apellidoMedico}" dado de baja`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Medicos",
        idEntidad: id,
        datosAnteriores: medicoAnterior,
        datosNuevos: { baja: true },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const reactivarMedico = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener médico antes de reactivar para auditoría
    const medicoAnterior = await medicosService.obtenerMedicoPorId(id);

    const resultado = await medicosService.reactivarMedico(id);

    // Registrar auditoría de reactivación de médico
    await Auditoria.registrarAuditoria(
      {
        evento: "MEDICO_REACTIVADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.AUTORIZAR,
        descripcion: `Médico "${medicoAnterior.nombreMedico} ${medicoAnterior.apellidoMedico}" reactivado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Medicos",
        idEntidad: id,
        datosAnteriores: medicoAnterior,
        datosNuevos: { baja: false },
      },
      req,
    );

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
