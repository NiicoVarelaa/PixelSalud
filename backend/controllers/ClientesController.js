const clientesService = require("../services/ClientesService");

/**
 * Controladores para el módulo de Clientes
 * Maneja las peticiones HTTP y delega la lógica al servicio
 */

/**
 * Obtiene todos los clientes
 * GET /clientes
 */
const getClientes = async (req, res, next) => {
  try {
    const clientes = await clientesService.obtenerClientes();
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene clientes inactivos
 * GET /clientes/bajados
 */
const getClienteBajados = async (req, res, next) => {
  try {
    const clientes = await clientesService.obtenerClientesInactivos();
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un cliente por ID
 * GET /clientes/:id
 */
const getCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await clientesService.obtenerClientePorId(id);
    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

/**
 * Busca un cliente por DNI
 * GET /clientes/buscar/:dni
 */
const buscarClientePorDNI = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const cliente = await clientesService.buscarClientePorDNI(dni);
    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo cliente
 * POST /clientes/crear
 */
const crearCliente = async (req, res, next) => {
  try {
    // Normalizar dniCliente a dni si viene del schema
    const clienteData = {
      ...req.body,
      dni: req.body.dniCliente || req.body.dni,
    };
    delete clienteData.dniCliente;

    const resultado = await clientesService.crearCliente(clienteData);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un cliente existente
 * PUT /clientes/actualizar/:idCliente
 */
const updateCliente = async (req, res, next) => {
  try {
    const { idCliente } = req.params;

    // Normalizar dniCliente a dni si viene del schema
    const updateData = {
      ...req.body,
      dni: req.body.dniCliente || req.body.dni,
    };
    delete updateData.dniCliente;

    const resultado = await clientesService.actualizarCliente(
      idCliente,
      updateData,
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Da de baja un cliente
 * PUT /clientes/darBaja/:id
 */
const darBajaCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await clientesService.darBajaCliente(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Activa un cliente
 * PUT /clientes/activar/:id
 */
const activarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await clientesService.activarCliente(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Registra un paciente de forma express (para médicos)
 * POST /clientes/express
 */
const registrarPacienteExpress = async (req, res, next) => {
  try {
    const resultado = await clientesService.registrarPacienteExpress(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Solicita recuperación de contraseña
 * POST /clientes/olvide-password
 */
const olvideContrasena = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resultado = await clientesService.solicitarRecuperacion(email);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Restablece la contraseña con token
 * POST /clientes/restablecer-password/:token
 */
const nuevoPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { nuevaPassword } = req.body;
    const resultado = await clientesService.restablecerPassword(
      token,
      nuevaPassword,
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
