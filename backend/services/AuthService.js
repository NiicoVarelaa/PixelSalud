const authRepository = require("../repositories/AuthRepository");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUnauthorizedError, createValidationError } = require("../errors");

/**
 * Servicio de autenticación
 * Maneja lógica de login, generación de tokens y permisos
 */

/**
 * Autentica un usuario y genera un token JWT
 * @param {string} email - Email del usuario
 * @param {string} contrasenia - Contraseña del usuario
 * @returns {Promise<Object>} Objeto con token y datos del usuario
 */
const login = async (email, contrasenia) => {
  // Validaciones
  if (!email || !contrasenia) {
    throw createValidationError("El campo email o contraseña está vacío");
  }

  // Buscar usuario en todas las tablas
  const { user, tipo } = await authRepository.findUserByEmail(email);

  if (!user) {
    throw createUnauthorizedError("Email y/o contraseña incorrectos");
  }

  // Verificar contraseña
  const passCheck = await bcryptjs.compare(contrasenia, user.contra);
  if (!passCheck) {
    throw createUnauthorizedError("Email y/o contraseña incorrectos");
  }

  // Obtener permisos según el tipo de usuario
  let permisos = null;
  if (tipo === "admin") {
    const permisosData = await authRepository.findPermisosByAdmin(user.id);
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
    const permisosData = await authRepository.findPermisosByEmpleado(user.id);
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

  // Determinar rol
  const role = user.rol || tipo;

  // Crear payload del token
  const payload = {
    id: user.id,
    role: role,
    permisos: permisos,
  };

  // Generar token JWT
  const token = jwt.sign(payload, process.env.SECRET_KEY);

  // Preparar respuesta
  const response = {
    msg: "Inicio de sesión exitoso",
    tipo,
    token,
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido || "",
    permisos: permisos,
    rol: role,
  };

  // Incluir DNI si es cliente
  if (tipo === "cliente" && user.dni) {
    response.dni = user.dni;
  }

  return response;
};

module.exports = {
  login,
};
