export const esEmailValido = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const esDniValido = (dni) => {
  return /^\d{7,8}$/.test(dni);
};

export const formatearNombre = (nombre) => {
  if (!nombre) return "";
  return nombre
    .trim()
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(),
    )
    .join(" ");
};

export const obtenerIniciales = (nombre, apellido) => {
  const inicialesNombre = nombre ? nombre.charAt(0).toUpperCase() : "";
  const inicialesApellido = apellido ? apellido.charAt(0).toUpperCase() : "";
  return `${inicialesNombre}${inicialesApellido}`;
};
