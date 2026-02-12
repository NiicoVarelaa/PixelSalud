const { z } = require("zod");

/**
 * Schema para validar el ID de receta en los parámetros de ruta
 */
const idRecetaParamSchema = z.object({
  id: z.coerce
    .number({
      required_error: "El ID de la receta es requerido",
      invalid_type_error: "El ID de la receta debe ser un número",
    })
    .int("El ID de la receta debe ser un número entero")
    .positive("El ID de la receta debe ser mayor a 0"),
});

/**
 * Schema para validar el ID de receta en parámetro idReceta
 */
const idRecetaUsadaParamSchema = z.object({
  idReceta: z.coerce
    .number({
      required_error: "El ID de la receta es requerido",
      invalid_type_error: "El ID de la receta debe ser un número",
    })
    .int("El ID de la receta debe ser un número entero")
    .positive("El ID de la receta debe ser mayor a 0"),
});

/**
 * Schema para validar el ID de médico en los parámetros de ruta
 */
const idMedicoParamSchema = z.object({
  idMedico: z.coerce
    .number({
      required_error: "El ID del médico es requerido",
      invalid_type_error: "El ID del médico debe ser un número",
    })
    .int("El ID del médico debe ser un número entero")
    .positive("El ID del médico debe ser mayor a 0"),
});

/**
 * Schema para validar el DNI del cliente en los parámetros de ruta
 */
const dniClienteParamSchema = z.object({
  dniCliente: z.union([
    z.string().regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
    z
      .number()
      .int("El DNI debe ser un número entero")
      .min(1000000, "El DNI debe tener al menos 7 dígitos")
      .max(99999999, "El DNI debe tener máximo 8 dígitos")
      .transform((val) => String(val)),
  ]),
});

/**
 * Schema para validar un producto en la receta
 */
const productoRecetaSchema = z.object({
  idProducto: z
    .number({
      required_error: "El ID del producto es requerido",
      invalid_type_error: "El ID del producto debe ser un número",
    })
    .int("El ID del producto debe ser un número entero")
    .positive("El ID del producto debe ser mayor a 0"),

  cantidad: z
    .number({
      required_error: "La cantidad es requerida",
      invalid_type_error: "La cantidad debe ser un número",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
});

/**
 * Schema para crear recetas
 */
const createRecetaSchema = z.object({
  dniCliente: z.union([
    z
      .string()
      .regex(/^\d{7,8}$/, "El DNI del cliente debe tener 7 u 8 dígitos")
      .trim(),
    z
      .number()
      .int("El DNI del cliente debe ser un número entero")
      .min(1000000, "El DNI debe tener al menos 7 dígitos")
      .max(99999999, "El DNI debe tener máximo 8 dígitos")
      .transform((val) => String(val)),
  ]),

  idMedico: z
    .number({
      required_error: "El ID del médico es requerido",
      invalid_type_error: "El ID del médico debe ser un número",
    })
    .int("El ID del médico debe ser un número entero")
    .positive("El ID del médico debe ser mayor a 0"),

  productos: z
    .array(productoRecetaSchema, {
      required_error: "Los productos son requeridos",
      invalid_type_error: "Los productos deben ser un array",
    })
    .min(1, "Debe incluir al menos un producto en la receta")
    .max(50, "No se pueden incluir más de 50 productos en una receta"),
});

module.exports = {
  idRecetaParamSchema,
  idRecetaUsadaParamSchema,
  idMedicoParamSchema,
  dniClienteParamSchema,
  createRecetaSchema,
};
