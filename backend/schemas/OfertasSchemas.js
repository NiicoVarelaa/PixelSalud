const { z } = require("zod");

const idOfertaParamSchema = z.object({
  idOferta: z
    .string()
    .regex(/^\d+$/, "El ID de oferta debe ser numérico")
    .transform((val) => parseInt(val, 10)),
});

const createOfertaSchema = z
  .object({
    idProducto: z
      .number()
      .int("El ID del producto debe ser un número entero")
      .positive("El ID del producto debe ser mayor a 0"),

    porcentajeDescuento: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
      .refine(
        (val) => !isNaN(val) && val >= 0.01,
        "El descuento debe ser mayor a 0",
      )
      .refine((val) => val <= 100, "El descuento no puede exceder 100%"),

    fechaInicio: z
      .string()
      .datetime(
        "Formato de fecha inválido. Use formato ISO: YYYY-MM-DDTHH:mm:ss",
      )
      .or(
        z
          .string()
          .regex(
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
            "Formato de fecha inválido",
          ),
      ),

    fechaFin: z
      .string()
      .datetime(
        "Formato de fecha inválido. Use formato ISO: YYYY-MM-DDTHH:mm:ss",
      )
      .or(
        z
          .string()
          .regex(
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
            "Formato de fecha inválido",
          ),
      ),
  })
  .refine((data) => new Date(data.fechaFin) > new Date(data.fechaInicio), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  });

const updateOfertaSchema = z
  .object({
    idProducto: z
      .number()
      .int("El ID del producto debe ser un número entero")
      .positive("El ID del producto debe ser mayor a 0")
      .optional(),

    porcentajeDescuento: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
      .refine(
        (val) => !isNaN(val) && val >= 0.01,
        "El descuento debe ser mayor a 0",
      )
      .refine((val) => val <= 100, "El descuento no puede exceder 100%")
      .optional(),

    fechaInicio: z
      .string()
      .datetime("Formato de fecha inválido")
      .or(
        z
          .string()
          .regex(
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
            "Formato de fecha inválido",
          ),
      )
      .optional(),

    fechaFin: z
      .string()
      .datetime("Formato de fecha inválido")
      .or(
        z
          .string()
          .regex(
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
            "Formato de fecha inválido",
          ),
      )
      .optional(),

    esActiva: z
      .union([z.boolean(), z.number(), z.string()])
      .transform((val) => {
        if (typeof val === "boolean") return val;
        if (typeof val === "number") return val === 1;
        if (typeof val === "string")
          return val === "1" || val.toLowerCase() === "true";
        return false;
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe proporcionar al menos un campo para actualizar",
  });

const updateEsActivaSchema = z.object({
  esActiva: z.union([z.boolean(), z.number(), z.string()]).transform((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val === 1;
    if (typeof val === "string")
      return val === "1" || val.toLowerCase() === "true";
    return false;
  }),
});

const createOfertaMasivaSchema = z.object({
  productIds: z
    .array(z.number().int().positive())
    .min(1, "Debe proporcionar al menos un ID de producto")
    .optional(),

  porcentajeDescuento: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine(
      (val) => !isNaN(val) && val >= 0.01,
      "El descuento debe ser mayor a 0",
    )
    .refine((val) => val <= 100, "El descuento no puede exceder 100%")
    .default(25.0),
});

module.exports = {
  idOfertaParamSchema,
  createOfertaSchema,
  updateOfertaSchema,
  updateEsActivaSchema,
  createOfertaMasivaSchema,
};
