const { z } = require("zod");

const idClienteParamSchema = z.object({
  idCliente: z
    .string()
    .regex(/^\d+$/, "idCliente debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idCliente debe ser mayor a 0"),
});

const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "id debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "id debe ser mayor a 0"),
});

const dniParamSchema = z.object({
  dni: z.string().regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos"),
});

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
  fechaNacimiento: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "fechaNacimiento debe tener formato YYYY-MM-DD",
    )
    .optional(),
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
  dni: z
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
  fechaNacimiento: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "fechaNacimiento debe tener formato YYYY-MM-DD",
    )
    .nullable()
    .optional(),
  telefonoCliente: z
    .string()
    .max(20, "telefonoCliente no puede exceder 20 caracteres")
    .trim()
    .nullable()
    .optional(),
  telefono: z
    .string()
    .max(20, "telefono no puede exceder 20 caracteres")
    .trim()
    .nullable()
    .optional(),
  direccionCliente: z
    .string()
    .max(255, "direccionCliente no puede exceder 255 caracteres")
    .trim()
    .nullable()
    .optional(),
  direccion: z
    .string()
    .max(255, "direccion no puede exceder 255 caracteres")
    .trim()
    .nullable()
    .optional(),
});

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

const olvidePasswordSchema = z.object({
  email: z
    .string({ required_error: "email es requerido" })
    .email("email debe ser un email válido")
    .toLowerCase()
    .trim(),
});

const restablecerPasswordSchema = z.object({
  nuevaPassword: z
    .string({ required_error: "nuevaPassword es requerido" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

const tokenParamSchema = z.object({
  token: z.string().min(32, "Token inválido").max(128, "Token inválido"),
});

const idDireccionParamSchema = z.object({
  idDireccion: z
    .string()
    .regex(/^\d+$/, "idDireccion debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idDireccion debe ser mayor a 0"),
});

const createDireccionClienteSchema = z.object({
  alias: z
    .string({ required_error: "alias es requerido" })
    .min(2, "alias debe tener al menos 2 caracteres")
    .max(60, "alias no puede exceder 60 caracteres")
    .trim(),
  pais: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.toLowerCase() === "argentina", {
      message: "Solo se permiten direcciones de Argentina",
    }),
  calle: z
    .string({ required_error: "calle es requerida" })
    .min(2, "calle debe tener al menos 2 caracteres")
    .max(120, "calle no puede exceder 120 caracteres")
    .trim(),
  numero: z
    .string({ required_error: "numero es requerido" })
    .min(1, "numero es requerido")
    .max(20, "numero no puede exceder 20 caracteres")
    .trim(),
  piso: z
    .string()
    .max(20, "piso no puede exceder 20 caracteres")
    .trim()
    .optional(),
  departamento: z
    .string()
    .max(20, "departamento no puede exceder 20 caracteres")
    .trim()
    .optional(),
  localidad: z
    .string({ required_error: "localidad es requerida" })
    .min(2, "localidad debe tener al menos 2 caracteres")
    .max(80, "localidad no puede exceder 80 caracteres")
    .trim(),
  provincia: z
    .string({ required_error: "provincia es requerida" })
    .min(2, "provincia debe tener al menos 2 caracteres")
    .max(80, "provincia no puede exceder 80 caracteres")
    .trim(),
  codigoPostal: z
    .string({ required_error: "codigoPostal es requerido" })
    .regex(/^\d{4}$/, "codigoPostal debe tener 4 dígitos")
    .trim(),
  referencias: z
    .string()
    .max(255, "referencias no puede exceder 255 caracteres")
    .trim()
    .optional(),
  esPredeterminada: z.boolean().optional(),
});

const updateDireccionClienteSchema = z
  .object({
    alias: z
      .string()
      .min(2, "alias debe tener al menos 2 caracteres")
      .max(60, "alias no puede exceder 60 caracteres")
      .trim()
      .optional(),
    pais: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || val.toLowerCase() === "argentina", {
        message: "Solo se permiten direcciones de Argentina",
      }),
    calle: z
      .string()
      .min(2, "calle debe tener al menos 2 caracteres")
      .max(120, "calle no puede exceder 120 caracteres")
      .trim()
      .optional(),
    numero: z
      .string()
      .min(1, "numero es requerido")
      .max(20, "numero no puede exceder 20 caracteres")
      .trim()
      .optional(),
    piso: z
      .string()
      .max(20, "piso no puede exceder 20 caracteres")
      .trim()
      .optional(),
    departamento: z
      .string()
      .max(20, "departamento no puede exceder 20 caracteres")
      .trim()
      .optional(),
    localidad: z
      .string()
      .min(2, "localidad debe tener al menos 2 caracteres")
      .max(80, "localidad no puede exceder 80 caracteres")
      .trim()
      .optional(),
    provincia: z
      .string()
      .min(2, "provincia debe tener al menos 2 caracteres")
      .max(80, "provincia no puede exceder 80 caracteres")
      .trim()
      .optional(),
    codigoPostal: z
      .string()
      .regex(/^\d{4}$/, "codigoPostal debe tener 4 dígitos")
      .trim()
      .optional(),
    referencias: z
      .string()
      .max(255, "referencias no puede exceder 255 caracteres")
      .trim()
      .optional(),
    esPredeterminada: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
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
  idDireccionParamSchema,
  createDireccionClienteSchema,
  updateDireccionClienteSchema,
};
