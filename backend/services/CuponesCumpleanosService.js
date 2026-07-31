const crypto = require("crypto");
const cuponesRepository = require("../repositories/CuponesRepository");
const cumpleanosRepository = require("../repositories/CuponesCumpleanosRepository");
const { enviarCuponCumpleanos } = require("../helps/EnvioMail");

const formatDateTimeMySQL = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const generarCodigoCumpleanos = (idCliente) => {
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  const year = new Date().getFullYear();
  return `CUMPLE${year}-${idCliente}-${random}`;
};

const procesarCuponesCumpleanos = async (fechaReferencia = new Date()) => {
  const descuento = Number(process.env.BIRTHDAY_COUPON_PERCENT || 20);
  const montoMinimo = Number(process.env.BIRTHDAY_COUPON_MIN_AMOUNT || 0);
  const fechaProceso = new Date(fechaReferencia);
  const anioCumple = fechaProceso.getFullYear();

  const clientes =
    await cumpleanosRepository.obtenerClientesCumpleanerosElegibles(
      fechaProceso,
    );

  const resumen = {
    fechaProceso: formatDateTimeMySQL(fechaProceso),
    totalElegibles: clientes.length,
    enviados: 0,
    fallidos: 0,
    detalles: [],
  };

  for (const cliente of clientes) {
    try {
      const inicio = new Date(fechaProceso);
      const vencimiento = new Date(inicio.getTime() + 48 * 60 * 60 * 1000);

      const codigo = generarCodigoCumpleanos(cliente.idCliente);

      const idCupon = await cuponesRepository.create({
        codigo,
        tipoCupon: "porcentaje",
        valorDescuento: descuento,
        descripcion: "Cupón de cumpleaños PixelSalud (48 horas)",
        fechaInicio: formatDateTimeMySQL(inicio),
        fechaVencimiento: formatDateTimeMySQL(vencimiento),
        usoMaximo: 1,
        tipoUsuario: "todos",
        montoMinimo,
        creadoPor: null,
      });

      await enviarCuponCumpleanos(
        cliente.emailCliente,
        `${cliente.nombreCliente} ${cliente.apellidoCliente}`.trim(),
        {
          codigo,
          valorDescuento: descuento,
          fechaVencimiento: vencimiento,
        },
      );

      await cumpleanosRepository.registrarEnvio({
        idCliente: cliente.idCliente,
        idCupon,
        anioCumple,
        estado: "enviado",
      });

      resumen.enviados += 1;
      resumen.detalles.push({
        idCliente: cliente.idCliente,
        email: cliente.emailCliente,
        codigo,
        estado: "enviado",
      });
    } catch (error) {
      await cumpleanosRepository.registrarEnvio({
        idCliente: cliente.idCliente,
        idCupon: null,
        anioCumple,
        estado: "fallido",
        detalleError: String(error.message || "Error desconocido").slice(
          0,
          255,
        ),
      });

      resumen.fallidos += 1;
      resumen.detalles.push({
        idCliente: cliente.idCliente,
        email: cliente.emailCliente,
        estado: "fallido",
        error: error.message,
      });
    }
  }

  return resumen;
};

module.exports = {
  procesarCuponesCumpleanos,
};
