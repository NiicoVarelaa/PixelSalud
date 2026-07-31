const { z } = require("zod");

const idMedicoParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "id debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "id debe ser mayor a 0"),
});

const createMedicoSchema = z.object({
  nombreMedico: z
    .string({ required_error: "nombreMedico es requerido" })
    .min(2, "nombreMedico debe tener al menos 2 caracteres")
    .max(100, "nombreMedico no puede exceder 100 caracteres")
    .trim(),
  apellidoMedico: z
    .string({ required_error: "apellidoMedico es requerido" })
    .min(2, "apellidoMedico debe tener al menos 2 caracteres")
    .max(100, "apellidoMedico no puede exceder 100 caracteres")
    .trim(),
  matricula: z
    .string({ required_error: "matricula es requerida" })
    .min(3, "matricula debe tener al menos 3 caracteres")
    .max(50, "matricula no puede exceder 50 caracteres")
    .trim(),
  emailMedico: z
    .string({ required_error: "emailMedico es requerido" })
    .email("emailMedico debe ser un email válido")
    .max(150, "emailMedico no puede exceder 150 caracteres")
    .toLowerCase()
    .trim(),
  contraMedico: z
    .string({ required_error: "contraMedico es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

const updateMedicoSchema = z.object({
  nombreMedico: z
    .string()
    .min(2, "nombreMedico debe tener al menos 2 caracteres")
    .max(100, "nombreMedico no puede exceder 100 caracteres")
    .trim()
    .optional(),
  apellidoMedico: z
    .string()
    .min(2, "apellidoMedico debe tener al menos 2 caracteres")
    .max(100, "apellidoMedico no puede exceder 100 caracteres")
    .trim()
    .optional(),
  matricula: z
    .string()
    .min(3, "matricula debe tener al menos 3 caracteres")
    .max(50, "matricula no puede exceder 50 caracteres")
    .trim()
    .optional(),
  emailMedico: z
    .string()
    .email("emailMedico debe ser un email válido")
    .max(150, "emailMedico no puede exceder 150 caracteres")
    .toLowerCase()
    .trim()
    .optional(),
  contraMedico: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .optional(),
});

module.exports = {
  idMedicoParamSchema,
  createMedicoSchema,
  updateMedicoSchema,
};
