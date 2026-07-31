const cuponesRepository = require("../repositories/CuponesRepository");
const clientesRepository = require("../repositories/ClientesRepository");
const { createValidationError, createNotFoundError } = require("../errors");
const { enviarCuponPromocional } = require("../helps/EnvioMail");
const crypto = require("crypto");

const generarCodigoUnico = (prefijo = "CUPON") => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefijo}-${random}`;
};

const crearCuponBienvenida = async (idCliente) => {
  const codigo = generarCodigoUnico("BIENVENIDA10");

  const fechaInicio = new Date();
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 60);

  const cuponData = {
    codigo,
    tipoCupon: "porcentaje",
    valorDescuento: 10.0,
    descripcion: "¡Bienvenido! 10% de descuento en tu primera compra",
    fechaInicio: fechaInicio.toISOString().split("T")[0],
    fechaVencimiento: fechaVencimiento.toISOString().split("T")[0],
    usoMaximo: 1,
    tipoUsuario: "nuevo",
    montoMinimo: 0,
    creadoPor: null,
  };

  const idCupon = await cuponesRepository.create(cuponData);

  return {
    idCupon,
    codigo,
    valorDescuento: 10,
    fechaVencimiento: cuponData.fechaVencimiento,
  };
};

const crearCupon = async (cuponData, adminId = null) => {
  if (!cuponData.codigo) {
    cuponData.codigo = generarCodigoUnico("CUPON");
  }

  const existe = await cuponesRepository.findByCodigo(cuponData.codigo);
  if (existe) {
    throw createValidationError("El código de cupón ya existe");
  }

  const fechaInicio = new Date(cuponData.fechaInicio);
  const fechaVencimiento = new Date(cuponData.fechaVencimiento);

  if (fechaVencimiento <= fechaInicio) {
    throw createValidationError(
      "La fecha de vencimiento debe ser posterior a la fecha de inicio",
    );
  }

  if (cuponData.tipoCupon === "porcentaje" && cuponData.valorDescuento > 100) {
    throw createValidationError(
      "El porcentaje de descuento no puede ser mayor a 100",
    );
  }

  if (cuponData.valorDescuento <= 0) {
    throw createValidationError("El valor de descuento debe ser mayor a 0");
  }

  cuponData.creadoPor = adminId;
  cuponData.valorDescuento = Number(cuponData.valorDescuento);
  cuponData.usoMaximo = Number(cuponData.usoMaximo) || 1;
  cuponData.montoMinimo = Number(cuponData.montoMinimo) || 0;

  const idCupon = await cuponesRepository.create(cuponData);

  let envioMail = null;
  if (cuponData.enviarPorMail) {
    const destinatarios =
      cuponData.destinatarios === "todos"
        ? await clientesRepository.findActivosConEmail()
        : await clientesRepository.findActivosByIdsConEmail(
            Array.isArray(cuponData.destinatarios)
              ? cuponData.destinatarios
                  .map((id) => Number(id))
                  .filter((id) => Number.isInteger(id) && id > 0)
              : [],
          );

    if (destinatarios.length > 0) {
      const resultados = await Promise.allSettled(
        destinatarios.map((cliente) =>
          enviarCuponPromocional(
            cliente.emailCliente,
            `${cliente.nombreCliente} ${cliente.apellidoCliente}`.trim(),
            {
              codigo: cuponData.codigo,
              tipoCupon: cuponData.tipoCupon,
              valorDescuento: cuponData.valorDescuento,
              descripcion: cuponData.descripcion,
              fechaVencimiento: cuponData.fechaVencimiento,
              montoMinimo: cuponData.montoMinimo,
            },
          ),
        ),
      );

      const enviados = resultados.filter(
        (r) => r.status === "fulfilled",
      ).length;
      envioMail = {
        totalDestinatarios: destinatarios.length,
        enviados,
        fallidos: destinatarios.length - enviados,
      };
    } else {
      envioMail = {
        totalDestinatarios: 0,
        enviados: 0,
        fallidos: 0,
      };
    }
  }

  return {
    idCupon,
    ...cuponData,
    envioMail,
  };
};

const validarYCalcularDescuento = async (codigo, idCliente, montoCompra) => {
  const validacion = await cuponesRepository.validarCupon(
    codigo,
    idCliente,
    montoCompra,
  );

  if (!validacion.valido) {
    return {
      valido: false,
      mensaje: validacion.mensaje,
      descuento: 0,
      cupon: null,
    };
  }

  const { cupon } = validacion;
  let montoDescuento = 0;

  if (cupon.tipoCupon === "porcentaje") {
    montoDescuento = (montoCompra * cupon.valorDescuento) / 100;
  } else if (cupon.tipoCupon === "monto_fijo") {
    montoDescuento = cupon.valorDescuento;
  }

  if (montoDescuento > montoCompra) {
    montoDescuento = montoCompra;
  }

  const montoFinal = montoCompra - montoDescuento;

  return {
    valido: true,
    mensaje: `Cupón aplicado: ${cupon.descripcion}`,
    descuento: parseFloat(montoDescuento.toFixed(2)),
    montoFinal: parseFloat(montoFinal.toFixed(2)),
    cupon: {
      idCupon: cupon.idCupon,
      codigo: cupon.codigo,
      tipoCupon: cupon.tipoCupon,
      valorDescuento: cupon.valorDescuento,
      descripcion: cupon.descripcion,
    },
  };
};

const obtenerTodosCupones = async () => {
  return await cuponesRepository.findAll();
};

const obtenerTodosCuponesPaginados = async (page = 1, limit = 20) => {
  return await cuponesRepository.findAllPaginated(page, limit);
};

const obtenerCuponesActivos = async () => {
  return await cuponesRepository.findAllActivos();
};

const obtenerCuponPorCodigo = async (codigo) => {
  const cupon = await cuponesRepository.findByCodigo(codigo);

  if (!cupon) {
    throw createNotFoundError("Cupón no encontrado");
  }

  return cupon;
};

const obtenerCuponPorId = async (idCupon) => {
  const cupon = await cuponesRepository.findById(idCupon);

  if (!cupon) {
    throw createNotFoundError("Cupón no encontrado");
  }

  return cupon;
};

const obtenerHistorialCliente = async (idCliente) => {
  return await cuponesRepository.obtenerHistorialCliente(idCliente);
};

const actualizarEstado = async (idCupon, estado) => {
  const cupon = await cuponesRepository.findById(idCupon);

  if (!cupon) {
    throw createNotFoundError("Cupón no encontrado");
  }

  if (!["activo", "inactivo"].includes(estado)) {
    throw createValidationError("Estado inválido");
  }

  return await cuponesRepository.updateEstado(idCupon, estado);
};

const eliminarCupon = async (idCupon) => {
  const eliminado = await cuponesRepository.deleteCupon(idCupon);

  if (!eliminado) {
    throw createValidationError(
      "No se puede eliminar un cupón que ya fue usado",
    );
  }

  return true;
};

const puedeUsarCuponBienvenida = async (idCliente) => {
  return await cuponesRepository.verificarPrimeraCompra(idCliente);
};

const obtenerTodoHistorial = async () => {
  return await cuponesRepository.obtenerTodoHistorial();
};

module.exports = {
  generarCodigoUnico,
  crearCuponBienvenida,
  crearCupon,
  validarYCalcularDescuento,
  obtenerTodosCupones,
  obtenerTodosCuponesPaginados,
  obtenerCuponesActivos,
  obtenerCuponPorCodigo,
  obtenerCuponPorId,
  obtenerHistorialCliente,
  obtenerTodoHistorial,
  actualizarEstado,
  eliminarCupon,
  puedeUsarCuponBienvenida,
};
