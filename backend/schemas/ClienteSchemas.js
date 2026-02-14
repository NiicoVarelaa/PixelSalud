const { z } = require("zod");

/**
 * Schemas de validación Zod para el módulo de Clientes
 */

// Schema para validar idCliente en params
const idClienteParamSchema = z.object({
  idCliente: z
    .string()
    .regex(/^\d+$/, "idCliente debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idCliente debe ser mayor a 0"),
});

// Schema genérico para ID en params
const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "id debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "id debe ser mayor a 0"),
});

// Schema para DNI en params
const dniParamSchema = z.object({
  dni: z.string().regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos"),
});

// Schema para crear cliente
const createClienteSchema = z.object({
  nombreCliente: z
    .string({ required_error: "nombreCliente es requerido" })
    .min(2, "nombreCliente debe tener al menos 2 caracteres")
    .max(100, "nombreCliente no puede exceder 100 caracteres")
    .trim(),
  apellidoCliente: z
    .string({ required_error: "apellidoCliente es requerido" })
    .min(2, "apellidoCliente debe tener al menos 2 caracteres")
    .max(100, "apellidoCliente no puede exceder 100 caracteres")
    .trim(),
  contraCliente: z
    .string({ required_error: "contraCliente es requerido" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  emailCliente: z
    .string({ required_error: "emailCliente es requerido" })
    .email("emailCliente debe ser un email válido")
    .max(150, "emailCliente no puede exceder 150 caracteres")
    .toLowerCase()
    .trim(),
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
    .refine((val) => typeof val === "string", {
      message: "dniCliente es requerido",
    }),
  telefonoCliente: z
    .string()
    .max(20, "telefonoCliente no puede exceder 20 caracteres")
    .trim()
    .optional(),
  direccionCliente: z
    .string()
    .max(255, "direccionCliente no puede exceder 255 caracteres")
    .trim()
    .optional(),
});

// Schema para actualizar cliente (todos los campos opcionales)
const updateClienteSchema = z.object({
  nombreCliente: z
    .string()
    .min(2, "nombreCliente debe tener al menos 2 caracteres")
    .max(100, "nombreCliente no puede exceder 100 caracteres")
    .trim()
    .optional(),
  apellidoCliente: z
    .string()
    .min(2, "apellidoCliente debe tener al menos 2 caracteres")
    .max(100, "apellidoCliente no puede exceder 100 caracteres")
    .trim()
    .optional(),
  contraCliente: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .optional(),
  emailCliente: z
    .string()
    .email("emailCliente debe ser un email válido")
    .max(150, "emailCliente no puede exceder 150 caracteres")
    .toLowerCase()
    .trim()
    .optional(),
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
    .optional()
    .or(
      z
        .string()
        .regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos")
        .optional(),
    ),
  telefonoCliente: z
    .string()
    .max(20, "telefonoCliente no puede exceder 20 caracteres")
    .trim()
    .nullable()
    .optional(),
  direccionCliente: z
    .string()
    .max(255, "direccionCliente no puede exceder 255 caracteres")
    .trim()
    .nullable()
    .optional(),
});

// Schema para registro express (médicos registran pacientes)
const registroExpressSchema = z.object({
  nombre: z
    .string({ required_error: "nombre es requerido" })
    .min(2, "nombre debe tener al menos 2 caracteres")
    .max(100, "nombre no puede exceder 100 caracteres")
    .trim(),
  apellido: z
    .string({ required_error: "apellido es requerido" })
    .min(2, "apellido debe tener al menos 2 caracteres")
    .max(100, "apellido no puede exceder 100 caracteres")
    .trim(),
  dni: z
    .string({ required_error: "dni es requerido" })
    .regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos")
    .or(
      z
        .number()
        .int()
        .min(1000000, "DNI inválido")
        .max(99999999, "DNI inválido")
        .transform(String),
    ),
  email: z
    .string({ required_error: "email es requerido" })
    .email("email debe ser un email válido")
    .max(150, "email no puede exceder 150 caracteres")
    .toLowerCase()
    .trim(),
});

// Schema para solicitar recuperación de contraseña
const olvidePasswordSchema = z.object({
  email: z
    .string({ required_error: "email es requerido" })
    .email("email debe ser un email válido")
    .toLowerCase()
    .trim(),
});

// Schema para restablecer contraseña
const restablecerPasswordSchema = z.object({
  nuevaPassword: z
    .string({ required_error: "nuevaPassword es requerido" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

// Schema para token en params
const tokenParamSchema = z.object({
  token: z.string().min(32, "Token inválido").max(128, "Token inválido"),
});

module.exports = {
  idClienteParamSchema,
  idParamSchema,
  dniParamSchema,
  createClienteSchema,
  updateClienteSchema,
  registroExpressSchema,
  olvidePasswordSchema,
  restablecerPasswordSchema,
  tokenParamSchema,
};
