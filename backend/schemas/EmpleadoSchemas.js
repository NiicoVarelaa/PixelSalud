const { z } = require("zod");

const idEmpleadoParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "id debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "id debe ser mayor a 0"),
});

const permisosSchema = z
  .object({
    crear_productos: z.boolean().optional().default(false),
    modificar_productos: z.boolean().optional().default(false),
    modificar_ventasE: z.boolean().optional().default(false),
    ver_ventasTotalesE: z.boolean().optional().default(false),
  })
  .optional();

const createEmpleadoSchema = z.object({
  nombreEmpleado: z
    .string({ required_error: "nombreEmpleado es requerido" })
    .min(2, "nombreEmpleado debe tener al menos 2 caracteres")
    .max(100, "nombreEmpleado no puede exceder 100 caracteres")
    .trim(),
  apellidoEmpleado: z
    .string({ required_error: "apellidoEmpleado es requerido" })
    .min(2, "apellidoEmpleado debe tener al menos 2 caracteres")
    .max(100, "apellidoEmpleado no puede exceder 100 caracteres")
    .trim(),
  contraEmpleado: z
    .string({ required_error: "contraEmpleado es requerido" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  emailEmpleado: z
    .string({ required_error: "emailEmpleado es requerido" })
    .email("emailEmpleado debe ser un email válido")
    .max(150, "emailEmpleado no puede exceder 150 caracteres")
    .toLowerCase()
    .trim(),
  dniEmpleado: z
    .string({ required_error: "dniEmpleado es requerido" })
    .regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos")
    .or(
      z
        .number()
        .int()
        .min(1000000, "DNI inválido")
        .max(99999999, "DNI inválido")
        .transform(String),
    ),
  permisos: permisosSchema,
});

const updateEmpleadoSchema = z.object({
  nombreEmpleado: z
    .string()
    .min(2, "nombreEmpleado debe tener al menos 2 caracteres")
    .max(100, "nombreEmpleado no puede exceder 100 caracteres")
    .trim()
    .optional(),
  apellidoEmpleado: z
    .string()
    .min(2, "apellidoEmpleado debe tener al menos 2 caracteres")
    .max(100, "apellidoEmpleado no puede exceder 100 caracteres")
    .trim()
    .optional(),
  contraEmpleado: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .optional(),
  emailEmpleado: z
    .string()
    .email("emailEmpleado debe ser un email válido")
    .max(150, "emailEmpleado no puede exceder 150 caracteres")
    .toLowerCase()
    .trim()
    .optional(),
  dniEmpleado: z
    .string()
    .regex(/^\d{7,8}$/, "DNI debe tener 7 u 8 dígitos")
    .optional()
    .or(
      z
        .number()
        .int()
        .min(1000000, "DNI inválido")
        .max(99999999, "DNI inválido")
        .transform(String)
        .optional(),
    ),
  permisos: permisosSchema,
});

module.exports = {
  idEmpleadoParamSchema,
  createEmpleadoSchema,
  updateEmpleadoSchema,
  permisosSchema,
};
