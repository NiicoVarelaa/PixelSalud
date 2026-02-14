const clientesRepository = require("../repositories/ClientesRepository");
const { NotFoundError, ValidationError, ConflictError } = require("../errors");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { enviarCorreoRecuperacion } = require("../helps/EnvioMail");

/**
 * Servicio para la lógica de negocio de Clientes
 * Maneja validaciones, hash de contraseñas, tokens de recuperación
 */

/**
 * Obtiene todos los clientes activos
 * @returns {Promise<Array>}
 */
const obtenerClientes = async () => {
  return await clientesRepository.findAll();
};

/**
 * Obtiene clientes inactivos
 * @returns {Promise<Array>}
 */
const obtenerClientesInactivos = async () => {
  const clientes = await clientesRepository.findInactivos();

  if (clientes.length === 0) {
    throw new NotFoundError("No hay clientes dados de baja");
  }

  return clientes;
};

/**
 * Obtiene un cliente por ID
 * @param {number} idCliente
 * @returns {Promise<Object>}
 */
const obtenerClientePorId = async (idCliente) => {
  const cliente = await clientesRepository.findById(idCliente);

  if (!cliente) {
    throw new NotFoundError("Cliente no encontrado");
  }

  return cliente;
};

/**
 * Busca un cliente por DNI
 * @param {string} dni
 * @returns {Promise<Object>}
 */
const buscarClientePorDNI = async (dni) => {
  const cliente = await clientesRepository.findByDNI(dni);

  if (!cliente) {
    throw new NotFoundError("Paciente no encontrado");
  }

  return cliente;
};

/**
 * Crea un nuevo cliente
 * @param {Object} clienteData
 * @returns {Promise<Object>}
 */
const crearCliente = async (clienteData) => {
  const { nombreCliente, apellidoCliente, contraCliente, emailCliente, dni } =
    clienteData;

  // Validar que el email sea único
  const emailExiste = await clientesRepository.existsByEmail(emailCliente);
  if (emailExiste) {
    throw new ConflictError(
      "El usuario que intentas crear, ya se encuentra creado",
    );
  }

  // Hash de la contraseña
  const salt = await bcryptjs.genSalt(10);
  const contraEncrip = await bcryptjs.hash(contraCliente, salt);

  // Crear cliente
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

/**
 * Actualiza un cliente existente
 * @param {number} idCliente
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
const actualizarCliente = async (idCliente, updates) => {
  // Verificar que el cliente existe
  const clienteExiste = await clientesRepository.findById(idCliente);
  if (!clienteExiste) {
    throw new NotFoundError("Cliente no encontrado");
  }

  // Validar email único si se está actualizando
  if (updates.emailCliente) {
    const emailEnUso = await clientesRepository.existsEmailExcept(
      updates.emailCliente,
      idCliente,
    );
    if (emailEnUso) {
      throw new ConflictError("El email ya está en uso por otro cliente");
    }
  }

  // Hash de contraseña si se está actualizando
  if (updates.contraCliente) {
    const salt = await bcryptjs.genSalt(10);
    updates.contraCliente = await bcryptjs.hash(updates.contraCliente, salt);
  }

  // Validar que haya campos para actualizar
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
    throw new ValidationError("No se enviaron datos para actualizar");
  }

  // Actualizar
  await clientesRepository.update(idCliente, updates);

  return {
    message: "Cliente actualizado con éxito",
  };
};

/**
 * Da de baja un cliente (activo = false)
 * @param {number} idCliente
 * @returns {Promise<Object>}
 */
const darBajaCliente = async (idCliente) => {
  const result = await clientesRepository.updateEstado(idCliente, false);

  if (result.affectedRows === 0) {
    throw new NotFoundError("Cliente no encontrado");
  }

  return {
    message: "Cliente dado de baja/eliminado con éxito",
  };
};

/**
 * Activa un cliente (activo = true)
 * @param {number} idCliente
 * @returns {Promise<Object>}
 */
const activarCliente = async (idCliente) => {
  const result = await clientesRepository.updateEstado(idCliente, true);

  if (result.affectedRows === 0) {
    throw new NotFoundError("Cliente no encontrado");
  }

  return {
    message: "Cliente reactivado con éxito",
  };
};

/**
 * Registra un paciente de forma express (para médicos)
 * Usa el DNI como contraseña inicial
 * @param {Object} pacienteData
 * @returns {Promise<Object>}
 */
const registrarPacienteExpress = async (pacienteData) => {
  const { nombre, apellido, dni, email } = pacienteData;

  // Validar campos obligatorios
  if (!nombre || !apellido || !dni || !email) {
    throw new ValidationError("Todos los campos son obligatorios");
  }

  // Verificar duplicados
  const emailExiste = await clientesRepository.existsByEmail(email);
  const dniExiste = await clientesRepository.existsByDNI(dni);

  if (emailExiste || dniExiste) {
    throw new ConflictError(
      "El DNI o Email ya están registrados en el sistema",
    );
  }

  // Hash del DNI como contraseña
  const salt = await bcryptjs.genSalt(10);
  const contraHasheada = await bcryptjs.hash(dni.toString(), salt);

  // Crear cliente
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

/**
 * Solicita recuperación de contraseña
 * Genera token y envía email
 * @param {string} email
 * @returns {Promise<Object>}
 */
const solicitarRecuperacion = async (email) => {
  if (!email) {
    throw new ValidationError("El email es obligatorio");
  }

  // Buscar cliente por email
  const cliente = await clientesRepository.findByEmail(email);

  if (!cliente) {
    throw new NotFoundError("No existe un usuario con este email");
  }

  // Generar token y fecha de expiración (1 hora)
  const token = crypto.randomBytes(32).toString("hex");
  const expiracion = new Date(Date.now() + 3600000); // 1 hora

  // Guardar token en BD
  await clientesRepository.saveRecoveryToken(
    cliente.idCliente,
    token,
    expiracion,
  );

  // Enviar email
  await enviarCorreoRecuperacion(email, cliente.nombreCliente, token);

  return {
    message: "Se ha enviado un correo con las instrucciones",
  };
};

/**
 * Restablece la contraseña usando el token
 * @param {string} token
 * @param {string} nuevaPassword
 * @returns {Promise<Object>}
 */
const restablecerPassword = async (token, nuevaPassword) => {
  if (!token || !nuevaPassword) {
    throw new ValidationError("Datos incompletos");
  }

  // Buscar cliente con token válido
  const cliente = await clientesRepository.findByValidToken(token);

  if (!cliente) {
    throw new ValidationError("Token inválido o expirado");
  }

  // Hash de la nueva contraseña
  const salt = await bcryptjs.genSalt(10);
  const contraEncrip = await bcryptjs.hash(nuevaPassword, salt);

  // Actualizar contraseña y limpiar token
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
