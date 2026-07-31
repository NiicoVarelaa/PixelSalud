const newsletterRepository = require("../repositories/NewsletterRepository");
const clientesRepository = require("../repositories/ClientesRepository");
const { createConflictError, createValidationError } = require("../errors");
const jwt = require("jsonwebtoken");

const getUnsubscribeSecret = () =>
  process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ||
  process.env.SECRET_KEY ||
  process.env.JWT_SECRET;

const createUnsubscribeToken = (email) => {
  const secret = getUnsubscribeSecret();

  if (!secret) {
    throw createValidationError(
      "Falta configurar NEWSLETTER_UNSUBSCRIBE_SECRET o SECRET_KEY",
    );
  }

  return jwt.sign({ email }, secret, { expiresIn: "30d" });
};

const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

const buildUnsubscribeUrl = (email) => {
  const token = createUnsubscribeToken(email);
  return `${getFrontendUrl()}/newsletter/baja?token=${encodeURIComponent(token)}`;
};

const suscribir = async ({
  email,
  nombre,
  idCliente,
  aceptaMarketing,
  fuente,
}) => {
  const emailNormalizado = String(email || "")
    .trim()
    .toLowerCase();

  if (!emailNormalizado) {
    throw createValidationError("El email es requerido");
  }

  if (aceptaMarketing !== true) {
    throw createValidationError("Debes aceptar comunicaciones comerciales");
  }

  if (idCliente) {
    const cliente = await clientesRepository.findById(idCliente);
    if (!cliente) {
      throw createValidationError("El cliente indicado no existe");
    }
  }

  const actual = await newsletterRepository.findByEmail(emailNormalizado);

  if (actual && actual.estado === "activa") {
    throw createConflictError("Este email ya está suscrito a novedades");
  }

  if (actual && actual.estado === "baja") {
    await newsletterRepository.reactivate({
      email: emailNormalizado,
      nombre,
      idCliente,
      aceptaMarketing,
      fuente,
    });

    return {
      message: "Suscripción reactivada correctamente",
      email: emailNormalizado,
      reactivated: true,
      unsubscribeUrl: buildUnsubscribeUrl(emailNormalizado),
    };
  }

  const idSuscripcion = await newsletterRepository.create({
    email: emailNormalizado,
    nombre,
    idCliente,
    aceptaMarketing,
    fuente,
  });

  return {
    message: "Suscripción creada correctamente",
    email: emailNormalizado,
    idSuscripcion,
    reactivated: false,
    unsubscribeUrl: buildUnsubscribeUrl(emailNormalizado),
  };
};

const desuscribirPorToken = async (token) => {
  if (!token) {
    throw createValidationError("Token de desuscripción requerido");
  }

  const secret = getUnsubscribeSecret();

  if (!secret) {
    throw createValidationError(
      "Falta configurar NEWSLETTER_UNSUBSCRIBE_SECRET o SECRET_KEY",
    );
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    throw createValidationError(
      "El link de desuscripción es inválido o expiró",
    );
  }

  const emailNormalizado = String(payload?.email || "")
    .trim()
    .toLowerCase();

  if (!emailNormalizado) {
    throw createValidationError("Token de desuscripción inválido");
  }

  const registro = await newsletterRepository.findByEmail(emailNormalizado);

  if (!registro || registro.estado !== "activa") {
    return {
      message: "Este email ya no recibe newsletter",
      email: emailNormalizado,
      unsubscribed: false,
    };
  }

  await newsletterRepository.deactivateByEmail(emailNormalizado);

  return {
    message: "Te desuscribiste correctamente",
    email: emailNormalizado,
    unsubscribed: true,
  };
};

module.exports = {
  suscribir,
  desuscribirPorToken,
};
