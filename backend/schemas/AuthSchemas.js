const { z } = require("zod");

/**
 * Schemas de validación para autenticación
 * Usando Zod para validar requests de login y registro
 */

// Schema para login
const loginBodySchema = z.object({
  email: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser una cadena de texto",
    })
    .email("El email debe tener un formato válido")
    .min(1, "El email no puede estar vacío"),
  contrasenia: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser una cadena de texto",
    })
    .min(1, "La contraseña no puede estar vacía")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Schema para registro de cliente
const registroClienteBodySchema = z.object({
  nombreCliente: z
    .string({
      required_error: "El nombre del cliente es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  apellidoCliente: z
    .string({
      required_error: "El apellido del cliente es requerido",
      invalid_type_error: "El apellido debe ser una cadena de texto",
    })
    .min(1, "El apellido no puede estar vacío")
    .max(100, "El apellido no puede superar los 100 caracteres"),
  contraCliente: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser una cadena de texto",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(255, "La contraseña no puede superar los 255 caracteres"),
  emailCliente: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser una cadena de texto",
    })
    .email("El email debe tener un formato válido")
    .max(255, "El email no puede superar los 255 caracteres"),
  dniCliente: z
    .union([
      z.string().regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos"),
      z
        .number()
        .int()
        .min(1000000, "DNI inválido")
        .max(99999999, "DNI inválido")
        .transform(String),
    ])
    .optional(),
});

module.exports = {
  loginBodySchema,
  registroClienteBodySchema,
};
