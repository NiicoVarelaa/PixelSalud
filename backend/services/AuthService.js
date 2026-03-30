const authRepository = require("../repositories/AuthRepository");
const clientesRepository = require("../repositories/ClientesRepository");
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

  const token = jwt.sign(payload, process.env.SECRET_KEY);

  const response = {
    msg,
    tipo,
    token,
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

module.exports = {
  login,
  loginWithGoogle,
};
