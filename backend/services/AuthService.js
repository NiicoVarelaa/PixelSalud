const authRepository = require("../repositories/AuthRepository");
const clientesRepository = require("../repositories/ClientesRepository");
const refreshTokensRepository = require("../repositories/RefreshTokensRepository");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { createUnauthorizedError, createValidationError } = require("../errors");

const buildPermisosByTipo = async (tipo, userId) => {
  let permisos = null;

  if (tipo === "admin") {
    const permisosData = await authRepository.findPermisosByAdmin(userId);
    if (permisosData) {
      permisos = {
        crear_productos: permisosData.crear_productos,
        modificar_productos: permisosData.modificar_productos,
        modificar_ventasE: permisosData.modificar_ventasE,
        modificar_ventasO: permisosData.modificar_ventasO,
        ver_ventasTotalesE: permisosData.ver_ventasTotalesE,
        ver_ventasTotalesO: permisosData.ver_ventasTotalesO,
      };
    }
  } else if (tipo === "empleado") {
    const permisosData = await authRepository.findPermisosByEmpleado(userId);
    if (permisosData) {
      permisos = {
        crear_productos: permisosData.crear_productos,
        modificar_productos: permisosData.modificar_productos,
        modificar_ventasE: permisosData.modificar_ventasE,
        modificar_ventasO: permisosData.modificar_ventasO,
        ver_ventasTotalesE: permisosData.ver_ventasTotalesE,
        ver_ventasTotalesO: permisosData.ver_ventasTotalesO,
      };
    }
  }

  return permisos;
};

const buildAuthResponse = async ({
  user,
  tipo,
  msg = "Inicio de sesión exitoso",
}) => {
  const permisos = await buildPermisosByTipo(tipo, user.id);
  const role = user.rol || tipo;

  const payload = {
    id: user.id,
    role,
    nombre: user.nombre,
    email: user.email,
    permisos,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await refreshTokensRepository.createRefreshToken(user.id, tokenHash, expiresAt);

  const response = {
    msg,
    tipo,
    token,
    refreshToken,
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido || "",
    permisos,
    rol: role,
  };

  if (tipo === "cliente" && user.dni) {
    response.dni = user.dni;
  }

  return response;
};

const login = async (email, contrasenia) => {
  if (!email || !contrasenia) {
    throw createValidationError("El campo email o contraseña está vacío");
  }

  const { user, tipo } = await authRepository.findUserByEmail(email);

  if (!user) {
    throw createUnauthorizedError("Email y/o contraseña incorrectos");
  }

  const passCheck = await bcryptjs.compare(contrasenia, user.contra);
  if (!passCheck) {
    throw createUnauthorizedError("Email y/o contraseña incorrectos");
  }

  return buildAuthResponse({ user, tipo });
};

const loginWithGoogle = async ({ email, nombre, apellido }) => {
  if (!email) {
    throw createValidationError("No se recibió email de Google");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const firstName = (nombre || "Cliente").toString().trim().slice(0, 100);
  const lastName = (apellido || "Google").toString().trim().slice(0, 100);

  const existing = await authRepository.findUserByEmail(normalizedEmail);

  if (!existing.user) {
    const randomPassword = crypto.randomBytes(24).toString("hex");
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(randomPassword, salt);

    const createResult = await clientesRepository.create({
      nombreCliente: firstName,
      apellidoCliente: lastName,
      contraCliente: hashedPassword,
      emailCliente: normalizedEmail,
      dni: null,
      fechaNacimiento: null,
      telefono: null,
      direccion: null,
      rol: "cliente",
      activo: true,
    });

    const nuevoCliente = await clientesRepository.findById(
      createResult.insertId,
    );

    return buildAuthResponse({
      user: {
        id: nuevoCliente.idCliente,
        nombre: nuevoCliente.nombreCliente,
        apellido: nuevoCliente.apellidoCliente,
        email: nuevoCliente.emailCliente,
        rol: nuevoCliente.rol,
        dni: nuevoCliente.dni,
      },
      tipo: "cliente",
      msg: "Registro con Google exitoso",
    });
  }

  if (existing.tipo !== "cliente") {
    throw createUnauthorizedError(
      "Este correo pertenece a una cuenta interna. Inicia sesión con email y contraseña.",
    );
  }

  return buildAuthResponse({
    user: existing.user,
    tipo: existing.tipo,
    msg: "Inicio de sesión con Google exitoso",
  });
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createValidationError("Refresh token es requerido");
  }

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const storedToken = await refreshTokensRepository.findRefreshToken(tokenHash);

  if (!storedToken) {
    throw createUnauthorizedError("Refresh token inválido o expirado");
  }

  const user = await authRepository.findUserById(storedToken.idUsuario);
  if (!user) {
    throw createUnauthorizedError("Usuario no encontrado");
  }

  await refreshTokensRepository.revokeRefreshToken(tokenHash);

  const tipo = user.rol;
  const permisos = await buildPermisosByTipo(tipo, user.id);
  const role = user.rol || tipo;

  const payload = {
    id: user.id,
    role,
    nombre: user.nombre,
    email: user.email,
    permisos,
  };

  const newAccessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });

  const newRefreshToken = crypto.randomBytes(40).toString("hex");
  const newTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await refreshTokensRepository.createRefreshToken(user.id, newTokenHash, expiresAt);

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await refreshTokensRepository.revokeRefreshToken(tokenHash);
  }
  return { message: "Sesión cerrada correctamente" };
};

const logoutAllSessions = async (userId) => {
  await refreshTokensRepository.revokeAllUserTokens(userId);
  return { message: "Todas las sesiones cerradas correctamente" };
};

module.exports = {
  login,
  loginWithGoogle,
  refreshAccessToken,
  logoutUser,
  logoutAllSessions,
};
