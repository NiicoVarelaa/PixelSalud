const clientesService = require("../services/ClientesService");

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

    const resultado = await clientesService.actualizarCliente(
      idCliente,
      updateData,
    );
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const darBajaCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await clientesService.darBajaCliente(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const activarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await clientesService.activarCliente(id);
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
