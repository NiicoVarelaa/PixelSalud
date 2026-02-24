const authService = require("../services/AuthService");
const clientesService = require("../services/ClientesService");
const cuponesService = require("../services/CuponesService");
const { enviarCuponBienvenida } = require("../helps/EnvioMail");
const { Auditoria } = require("../helps");

const login = async (req, res, next) => {
  try {
    const { email, contrasenia } = req.body;
    const resultado = await authService.login(email, contrasenia);

    // Registrar login exitoso en auditoría
    await Auditoria.registrarLoginExitoso(
      {
        id: resultado.id,
        email: resultado.email,
        nombre: resultado.nombre,
        apellido: resultado.apellido || "",
        rol: resultado.rol,
      },
      req,
    );

    res.status(200).json(resultado);
  } catch (error) {
    // Registrar login fallido
    await Auditoria.registrarLoginFallido(
      req.body.email || "email_no_proporcionado",
      error.message,
      req,
    );

    next(error);
  }
};

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

    const idCliente = resultado.insertId;

    try {
      const cupon = await cuponesService.crearCuponBienvenida(idCliente);

      await enviarCuponBienvenida(
        emailCliente,
        nombreCliente,
        cupon.codigo,
        cupon.valorDescuento,
        cupon.fechaVencimiento,
      );
    } catch (cuponError) {
      console.error("Error creando cupón de bienvenida:", cuponError.message);
    }

    res.status(201).json({
      mensaje: "Cliente registrado exitosamente",
      idCliente,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  registrarCliente,
};
