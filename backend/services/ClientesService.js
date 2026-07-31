const clientesRepository = require("../repositories/ClientesRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
  createForbiddenError,
} = require("../errors");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { enviarCorreoRecuperacion } = require("../helps/EnvioMail");

const obtenerClientes = async () => {
  return await clientesRepository.findAll();
};

const obtenerClientesPaginados = async (page = 1, limit = 20) => {
  return await clientesRepository.findAllPaginated(page, limit);
};

const obtenerClientesInactivos = async () => {
  const clientes = await clientesRepository.findInactivos();

  if (clientes.length === 0) {
    throw createNotFoundError("No hay clientes dados de baja");
  }

  return clientes;
};

const obtenerClientePorId = async (idCliente) => {
  const cliente = await clientesRepository.findById(idCliente);

  if (!cliente) {
    throw createNotFoundError("Cliente no encontrado");
  }

  return cliente;
};

const buscarClientePorDNI = async (dni) => {
  const cliente = await clientesRepository.findByDNI(dni);

  if (!cliente) {
    throw createNotFoundError("Paciente no encontrado");
  }

  return cliente;
};

const crearCliente = async (clienteData) => {
  const {
    nombreCliente,
    apellidoCliente,
    contraCliente,
    emailCliente,
    dni,
    fechaNacimiento,
  } = clienteData;

  const emailExiste = await clientesRepository.existsByEmail(emailCliente);
  if (emailExiste) {
    throw createConflictError(
      "El usuario que intentas crear, ya se encuentra creado",
    );
  }

  const salt = await bcryptjs.genSalt(10);
  const contraEncrip = await bcryptjs.hash(contraCliente, salt);

  const result = await clientesRepository.create({
    nombreCliente,
    apellidoCliente,
    contraCliente: contraEncrip,
    emailCliente,
    dni,
    fechaNacimiento,
  });

  return {
    message: "Usuario creado correctamente",
    idCliente: result.insertId,
  };
};

const actualizarCliente = async (idCliente, updates) => {
  const clienteExiste = await clientesRepository.findById(idCliente);
  if (!clienteExiste) {
    throw createNotFoundError("Cliente no encontrado");
  }

  const camposActualizables = [
    "nombreCliente",
    "apellidoCliente",
    "emailCliente",
    "dni",
    "fechaNacimiento",
    "telefono",
    "direccion",
    "contraCliente",
  ];

  const updatesFiltrados = Object.fromEntries(
    Object.entries(updates).filter(
      ([key, value]) =>
        camposActualizables.includes(key) && value !== undefined,
    ),
  );

  if (Object.keys(updatesFiltrados).length === 0) {
    throw createValidationError("No se enviaron datos para actualizar");
  }

  if (updatesFiltrados.emailCliente) {
    const emailEnUso = await clientesRepository.existsEmailExcept(
      updatesFiltrados.emailCliente,
      idCliente,
    );
    if (emailEnUso) {
      throw createConflictError("El email ya está en uso por otro cliente");
    }
  }

  if (updatesFiltrados.contraCliente) {
    const salt = await bcryptjs.genSalt(10);
    updatesFiltrados.contraCliente = await bcryptjs.hash(
      updatesFiltrados.contraCliente,
      salt,
    );
  }

  await clientesRepository.update(idCliente, updatesFiltrados);

  return {
    message: "Cliente actualizado con éxito",
  };
};

const darBajaCliente = async (idCliente) => {
  const result = await clientesRepository.updateEstado(idCliente, false);

  if (result.affectedRows === 0) {
    throw createNotFoundError("Cliente no encontrado");
  }

  return {
    message: "Cliente dado de baja/eliminado con éxito",
  };
};

const activarCliente = async (idCliente) => {
  const result = await clientesRepository.updateEstado(idCliente, true);

  if (result.affectedRows === 0) {
    throw createNotFoundError("Cliente no encontrado");
  }

  return {
    message: "Cliente reactivado con éxito",
  };
};

const registrarPacienteExpress = async (pacienteData) => {
  const { nombre, apellido, dni, email } = pacienteData;

  if (!nombre || !apellido || !dni || !email) {
    throw createValidationError("Todos los campos son obligatorios");
  }

  const emailExiste = await clientesRepository.existsByEmail(email);
  const dniExiste = await clientesRepository.existsByDNI(dni);

  if (emailExiste || dniExiste) {
    throw createConflictError(
      "El DNI o Email ya están registrados en el sistema",
    );
  }

  const salt = await bcryptjs.genSalt(10);
  const contraHasheada = await bcryptjs.hash(dni.toString(), salt);

  const result = await clientesRepository.create({
    nombreCliente: nombre,
    apellidoCliente: apellido,
    dni,
    emailCliente: email,
    contraCliente: contraHasheada,
    rol: "cliente",
    activo: true,
  });

  return {
    message: "Paciente registrado con éxito",
    idCliente: result.insertId,
  };
};

const solicitarRecuperacion = async (email) => {
  if (!email) {
    throw createValidationError("El email es obligatorio");
  }

  const cliente = await clientesRepository.findByEmail(email);

  if (!cliente) {
    throw createNotFoundError("No existe un usuario con este email");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiracion = new Date(Date.now() + 3600000);

  await clientesRepository.saveRecoveryToken(
    cliente.idCliente,
    token,
    expiracion,
  );

  await enviarCorreoRecuperacion(email, cliente.nombreCliente, token);

  return {
    message: "Se ha enviado un correo con las instrucciones",
  };
};

const restablecerPassword = async (token, nuevaPassword) => {
  if (!token || !nuevaPassword) {
    throw createValidationError("Datos incompletos");
  }

  const cliente = await clientesRepository.findByValidToken(token);

  if (!cliente) {
    throw createValidationError("Token inválido o expirado");
  }

  const salt = await bcryptjs.genSalt(10);
  const contraEncrip = await bcryptjs.hash(nuevaPassword, salt);

  await clientesRepository.updatePassword(cliente.idCliente, contraEncrip);

  return {
    message: "Contraseña actualizada correctamente",
  };
};

const validarAccesoCliente = (authUser, idClienteObjetivo) => {
  const esAdmin = authUser?.role === "admin";
  const esMismoCliente =
    authUser?.role === "cliente" && authUser?.id === idClienteObjetivo;

  if (!esAdmin && !esMismoCliente) {
    throw createForbiddenError(
      "No tienes permisos para gestionar estas direcciones",
    );
  }
};

const obtenerDireccionesCliente = async (idCliente, authUser) => {
  await obtenerClientePorId(idCliente);
  validarAccesoCliente(authUser, idCliente);

  return await clientesRepository.findDireccionesByClienteId(idCliente);
};

const obtenerDireccionPredeterminadaCliente = async (idCliente, authUser) => {
  await obtenerClientePorId(idCliente);
  validarAccesoCliente(authUser, idCliente);

  const direccionPredeterminada =
    await clientesRepository.findDireccionPredeterminadaByClienteId(idCliente);

  if (!direccionPredeterminada) {
    throw createNotFoundError("No tienes una dirección predeterminada");
  }

  return direccionPredeterminada;
};

const crearDireccionCliente = async (idCliente, authUser, direccionData) => {
  await obtenerClientePorId(idCliente);
  validarAccesoCliente(authUser, idCliente);

  const cantidad =
    await clientesRepository.countDireccionesByClienteId(idCliente);
  if (cantidad >= 2) {
    throw createValidationError(
      "Solo se permiten hasta 2 direcciones por cliente",
    );
  }

  const pais = (direccionData.pais || "Argentina").trim();
  if (pais.toLowerCase() !== "argentina") {
    throw createValidationError("Solo se permiten direcciones de Argentina");
  }

  const debeSerPredeterminada =
    cantidad === 0 || direccionData.esPredeterminada === true;

  if (debeSerPredeterminada) {
    await clientesRepository.clearDireccionPredeterminadaByClienteId(idCliente);
  }

  const result = await clientesRepository.createDireccionCliente({
    idCliente,
    ...direccionData,
    pais: "Argentina",
    esPredeterminada: debeSerPredeterminada,
  });

  return {
    message: "Dirección guardada correctamente",
    idDireccion: result.insertId,
  };
};

const actualizarDireccionCliente = async (
  idCliente,
  idDireccion,
  authUser,
  direccionData,
) => {
  await obtenerClientePorId(idCliente);
  validarAccesoCliente(authUser, idCliente);

  const direccionActual = await clientesRepository.findDireccionByIdAndCliente(
    idCliente,
    idDireccion,
  );

  if (!direccionActual) {
    throw createNotFoundError("Dirección no encontrada");
  }

  if (direccionData.pais !== undefined) {
    const pais = direccionData.pais.trim();
    if (pais.toLowerCase() !== "argentina") {
      throw createValidationError("Solo se permiten direcciones de Argentina");
    }
  }

  if (direccionData.esPredeterminada === false) {
    throw createValidationError(
      "Para quitar la predeterminada, primero selecciona otra dirección",
    );
  }

  if (direccionData.esPredeterminada === true) {
    await clientesRepository.clearDireccionPredeterminadaByClienteId(idCliente);
  }

  const updates = {
    ...direccionData,
    pais:
      direccionData.pais !== undefined
        ? "Argentina"
        : direccionActual.pais || "Argentina",
  };

  const result = await clientesRepository.updateDireccionCliente(
    idCliente,
    idDireccion,
    updates,
  );

  if (result.affectedRows === 0) {
    throw createNotFoundError("Dirección no encontrada");
  }

  return {
    message: "Dirección actualizada correctamente",
  };
};

const marcarDireccionPredeterminadaCliente = async (
  idCliente,
  idDireccion,
  authUser,
) => {
  await obtenerClientePorId(idCliente);
  validarAccesoCliente(authUser, idCliente);

  const direccion = await clientesRepository.findDireccionByIdAndCliente(
    idCliente,
    idDireccion,
  );

  if (!direccion) {
    throw createNotFoundError("Dirección no encontrada");
  }

  await clientesRepository.clearDireccionPredeterminadaByClienteId(idCliente);
  await clientesRepository.setDireccionPredeterminada(idCliente, idDireccion);

  return {
    message: "Dirección marcada como predeterminada",
  };
};

const eliminarDireccionCliente = async (idCliente, idDireccion, authUser) => {
  await obtenerClientePorId(idCliente);
  validarAccesoCliente(authUser, idCliente);

  const direccion = await clientesRepository.findDireccionByIdAndCliente(
    idCliente,
    idDireccion,
  );

  if (!direccion) {
    throw createNotFoundError("Dirección no encontrada");
  }

  const result = await clientesRepository.deleteDireccionCliente(
    idCliente,
    idDireccion,
  );

  const eraPredeterminada = Boolean(direccion.esPredeterminada);
  if (eraPredeterminada) {
    const direccionesRestantes =
      await clientesRepository.findDireccionesByClienteId(idCliente);
    if (direccionesRestantes.length > 0) {
      await clientesRepository.setDireccionPredeterminada(
        idCliente,
        direccionesRestantes[0].idDireccion,
      );
    }
  }

  return {
    message: "Dirección eliminada correctamente",
  };
};

module.exports = {
  obtenerClientes,
  obtenerClientesPaginados,
  obtenerClientesInactivos,
  obtenerClientePorId,
  buscarClientePorDNI,
  crearCliente,
  actualizarCliente,
  darBajaCliente,
  activarCliente,
  registrarPacienteExpress,
  solicitarRecuperacion,
  restablecerPassword,
  obtenerDireccionesCliente,
  obtenerDireccionPredeterminadaCliente,
  crearDireccionCliente,
  actualizarDireccionCliente,
  marcarDireccionPredeterminadaCliente,
  eliminarDireccionCliente,
};
