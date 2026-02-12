const clientesService = require("../services/ClientesService");

/**
 * Controlador de registro
 */

/**
 * Registra un nuevo cliente
 * POST /registro
 */
const registrarCliente = async (req, res, next) => {
  try {
    const {
      nombreCliente,
      apellidoCliente,
      contraCliente,
      emailCliente,
      dniCliente,
    } = req.body;

    const resultado = await clientesService.crearCliente({
      nombreCliente,
      apellidoCliente,
      contraCliente,
      emailCliente,
      dni: dniCliente,
    });

    res.status(201).json({
      mensaje: "Cliente registrado exitosamente",
      idCliente: resultado.insertId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrarCliente,
};
