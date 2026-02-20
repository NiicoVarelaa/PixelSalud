const clientesRepository = require("../repositories/ClientesRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
} = require("../errors");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { enviarCorreoRecuperacion } = require("../helps/EnvioMail");

const obtenerClientes = async () => {
  return await clientesRepository.findAll();
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
  const { nombreCliente, apellidoCliente, contraCliente, emailCliente, dni } =
    clienteData;

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

  if (updates.emailCliente) {
    const emailEnUso = await clientesRepository.existsEmailExcept(
      updates.emailCliente,
      idCliente,
    );
    if (emailEnUso) {
      throw createConflictError("El email ya está en uso por otro cliente");
    }
  }

  if (updates.contraCliente) {
    const salt = await bcryptjs.genSalt(10);
    updates.contraCliente = await bcryptjs.hash(updates.contraCliente, salt);
  }

  const camposActualizables = [
    "nombreCliente",
    "apellidoCliente",
    "emailCliente",
    "dni",
    "telefono",
    "direccion",
    "contraCliente",
  ];

  const hayActualizaciones = Object.keys(updates).some((key) =>
    camposActualizables.includes(key),
  );

  if (!hayActualizaciones) {
    throw createValidationError("No se enviaron datos para actualizar");
  }

  await clientesRepository.update(idCliente, updates);

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

module.exports = {
  obtenerClientes,
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
};
