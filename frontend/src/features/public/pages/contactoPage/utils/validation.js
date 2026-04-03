const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LETTER_REGEX = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/;

export const validarNombre = (nombre) => {
  const value = nombre.trim();
  if (!value) return "El nombre es obligatorio";
  if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (value.length > 100)
    return "El nombre no puede tener más de 100 caracteres";
  return "";
};

export const validarEmail = (email) => {
  const value = email.trim();
  if (!value) return "El correo electrónico es obligatorio";
  if (!EMAIL_REGEX.test(value)) return "El correo electrónico no es válido";
  if (value.length > 100)
    return "El correo electrónico no puede tener más de 100 caracteres";
  return "";
};

export const validarAsunto = (asunto) => {
  const value = asunto.trim();
  if (value.length > 200) return "El asunto no puede tener más de 200 caracteres";
  return "";
};

export const validarMensaje = (mensaje) => {
  const value = mensaje.trim();
  if (!value) return "El mensaje es obligatorio";
  if (value.length < 10) return "El mensaje debe tener al menos 10 caracteres";
  if (value.length > 1000)
    return "El mensaje no puede tener más de 1000 caracteres";
  if (!LETTER_REGEX.test(value))
    return "El mensaje debe contener al menos algunas letras";
  return "";
};

export const validateContactoForm = (formData) => {
  const nextErrors = {
    nombre: validarNombre(formData.nombre),
    email: validarEmail(formData.email),
    asunto: validarAsunto(formData.asunto),
    mensaje: validarMensaje(formData.mensaje),
  };

  return {
    errors: nextErrors,
    hasErrors: Object.values(nextErrors).some(Boolean),
  };
};
