const authRepository = require("../repositories/AuthRepository");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUnauthorizedError, createValidationError } = require("../errors");

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

  const role = user.rol || tipo;

  const payload = {
    id: user.id,
    role: role,
    permisos: permisos,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY);

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
  
  if (tipo === "cliente" && user.dni) {
    response.dni = user.dni;
  }

  return response;
};

module.exports = {
  login,
};
