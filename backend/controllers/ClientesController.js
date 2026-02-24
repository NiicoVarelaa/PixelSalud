const clientesService = require("../services/ClientesService");
const { Auditoria } = require("../helps");

const getClientes = async (req, res, next) => {
  try {
    const clientes = await clientesService.obtenerClientes();
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

const getClienteBajados = async (req, res, next) => {
  try {
    const clientes = await clientesService.obtenerClientesInactivos();
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

const getCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await clientesService.obtenerClientePorId(id);
    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

const buscarClientePorDNI = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const cliente = await clientesService.buscarClientePorDNI(dni);
    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

const crearCliente = async (req, res, next) => {
  try {
    const clienteData = {
      ...req.body,
      dni: req.body.dniCliente || req.body.dni,
    };
    delete clienteData.dniCliente;

    const resultado = await clientesService.crearCliente(clienteData);

    // Registrar auditoría de creación de cliente
    await Auditoria.registrarAuditoria(
      {
        evento: "CLIENTE_CREADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Cliente "${clienteData.nombreCliente} ${clienteData.apellidoCliente}" creado`,
        tipoUsuario: req.user?.role || "sistema",
        idUsuario: req.user?.id || null,
        entidadAfectada: "Clientes",
        idEntidad: resultado.insertId,
        datosAnteriores: null,
        datosNuevos: { ...clienteData, contraCliente: "[OCULTA]" },
      },
      req,
    );

    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const { idCliente } = req.params;

    const updateData = {
      ...req.body,
      dni: req.body.dniCliente || req.body.dni,
    };
    delete updateData.dniCliente;

    // Obtener cliente antes de actualizar para auditoría
    const clienteAnterior =
      await clientesService.obtenerClientePorId(idCliente);

    const resultado = await clientesService.actualizarCliente(
      idCliente,
      updateData,
    );

    // Registrar auditoría de actualización de cliente
    await Auditoria.registrarAuditoria(
      {
        evento: "CLIENTE_MODIFICADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Cliente ID ${idCliente} actualizado`,
        tipoUsuario: req.user?.role || "cliente",
        idUsuario: req.user?.id || idCliente,
        entidadAfectada: "Clientes",
        idEntidad: idCliente,
        datosAnteriores: clienteAnterior,
        datosNuevos: {
          ...updateData,
          contraCliente: updateData.contraCliente ? "[OCULTA]" : undefined,
        },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const darBajaCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener cliente antes de dar de baja para auditoría
    const clienteAnterior = await clientesService.obtenerClientePorId(id);

    const resultado = await clientesService.darBajaCliente(id);

    // Registrar auditoría de baja de cliente
    await Auditoria.registrarAuditoria(
      {
        evento: "CLIENTE_DESACTIVADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Cliente "${clienteAnterior.nombreCliente} ${clienteAnterior.apellidoCliente}" dado de baja`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Clientes",
        idEntidad: id,
        datosAnteriores: clienteAnterior,
        datosNuevos: { baja: true },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const activarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener cliente antes de activar para auditoría
    const clienteAnterior = await clientesService.obtenerClientePorId(id);

    const resultado = await clientesService.activarCliente(id);

    // Registrar auditoría de activación de cliente
    await Auditoria.registrarAuditoria(
      {
        evento: "CLIENTE_REACTIVADO",
        modulo: Auditoria.MODULOS.USUARIOS,
        accion: Auditoria.ACCIONES.AUTORIZAR,
        descripcion: `Cliente "${clienteAnterior.nombreCliente} ${clienteAnterior.apellidoCliente}" reactivado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Clientes",
        idEntidad: id,
        datosAnteriores: clienteAnterior,
        datosNuevos: { baja: false },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const registrarPacienteExpress = async (req, res, next) => {
  try {
    const resultado = await clientesService.registrarPacienteExpress(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

const olvideContrasena = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resultado = await clientesService.solicitarRecuperacion(email);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const nuevoPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { nuevaPassword } = req.body;
    const resultado = await clientesService.restablecerPassword(
      token,
      nuevaPassword,
    );

    // Registrar auditoría de cambio de contraseña
    await Auditoria.registrarAuditoria(
      {
        evento: "PASSWORD_CAMBIADO",
        modulo: Auditoria.MODULOS.AUTENTICACION,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Contraseña restablecida mediante token`,
        tipoUsuario: "cliente",
        idUsuario: resultado.clienteId || null,
        entidadAfectada: "Clientes",
        idEntidad: resultado.clienteId || null,
        datosAnteriores: null,
        datosNuevos: { passwordChanged: true },
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClientes,
  getClienteBajados,
  getCliente,
  crearCliente,
  updateCliente,
  darBajaCliente,
  activarCliente,
  buscarClientePorDNI,
  registrarPacienteExpress,
  olvideContrasena,
  nuevoPassword,
};
