const { z } = require("zod");

// ==================== VALIDACIONES COMUNES ====================

const idCampanaParam = z.object({
  idCampana: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número")
    .transform((val) => parseInt(val, 10)),
});

const idProductoParam = z.object({
  idProducto: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número")
    .transform((val) => parseInt(val, 10)),
});

const idRelacionParam = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número")
    .transform((val) => parseInt(val, 10)),
});

// ==================== SCHEMAS PARA CAMPAÑAS ====================

const createCampanaSchema = z
  .object({
    nombreCampana: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres")
      .trim(),

    descripcion: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .trim()
      .optional(),

    porcentajeDescuento: z
      .number()
      .min(0.01, "El descuento debe ser mayor a 0")
      .max(100, "El descuento no puede ser mayor a 100"),

    fechaInicio: z
      .string()
      .datetime({ message: "Formato de fecha inválido (usar ISO 8601)" })
      .or(z.date())
      .transform((val) => {
        if (typeof val === "string") {
          return new Date(val).toISOString().slice(0, 19).replace("T", " ");
        }
        return val.toISOString().slice(0, 19).replace("T", " ");
      }),

    fechaFin: z
      .string()
      .datetime({ message: "Formato de fecha inválido (usar ISO 8601)" })
      .or(z.date())
      .transform((val) => {
        if (typeof val === "string") {
          return new Date(val).toISOString().slice(0, 19).replace("T", " ");
        }
        return val.toISOString().slice(0, 19).replace("T", " ");
      }),

    esActiva: z
      .boolean()
      .or(z.number().int().min(0).max(1))
      .transform((val) => (typeof val === "boolean" ? (val ? 1 : 0) : val))
      .optional(),

    tipo: z
      .enum(["EVENTO", "DESCUENTO", "LIQUIDACION", "TEMPORADA"])
      .optional(),

    prioridad: z
      .number()
      .int()
      .min(0, "La prioridad debe ser mayor o igual a 0")
      .max(100, "La prioridad no puede ser mayor a 100")
      .optional(),
  })
  .refine(
    (data) => {
      const inicio = new Date(data.fechaInicio);
      const fin = new Date(data.fechaFin);
      return fin > inicio;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["fechaFin"],
    },
  );

const updateCampanaSchema = z
  .object({
    nombreCampana: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres")
      .trim()
      .optional(),

    descripcion: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .trim()
      .optional(),

    porcentajeDescuento: z
      .number()
      .min(0.01, "El descuento debe ser mayor a 0")
      .max(100, "El descuento no puede ser mayor a 100")
      .optional(),

    fechaInicio: z
      .string()
      .datetime({ message: "Formato de fecha inválido (usar ISO 8601)" })
      .or(z.date())
      .transform((val) => {
        if (typeof val === "string") {
          return new Date(val).toISOString().slice(0, 19).replace("T", " ");
        }
        return val.toISOString().slice(0, 19).replace("T", " ");
      })
      .optional(),

    fechaFin: z
      .string()
      .datetime({ message: "Formato de fecha inválido (usar ISO 8601)" })
      .or(z.date())
      .transform((val) => {
        if (typeof val === "string") {
          return new Date(val).toISOString().slice(0, 19).replace("T", " ");
        }
        return val.toISOString().slice(0, 19).replace("T", " ");
      })
      .optional(),

    esActiva: z
      .boolean()
      .or(z.number().int().min(0).max(1))
      .transform((val) => (typeof val === "boolean" ? (val ? 1 : 0) : val))
      .optional(),

    tipo: z
      .enum(["EVENTO", "DESCUENTO", "LIQUIDACION", "TEMPORADA"])
      .optional(),

    prioridad: z
      .number()
      .int()
      .min(0, "La prioridad debe ser mayor o igual a 0")
      .max(100, "La prioridad no puede ser mayor a 100")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.fechaInicio && data.fechaFin) {
        const inicio = new Date(data.fechaInicio);
        const fin = new Date(data.fechaFin);
        return fin > inicio;
      }
      return true;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["fechaFin"],
    },
  );

// ==================== SCHEMAS PARA PRODUCTOS EN CAMPAÑAS ====================

const addProductosSchema = z
  .object({
    productosIds: z
      .array(z.number().int().positive())
      .min(1, "Debe proporcionar al menos un producto")
      .optional(),

    idProducto: z
      .number()
      .int()
      .positive("El ID del producto debe ser un número positivo")
      .optional(),

    porcentajeDescuentoOverride: z
      .number()
      .min(0.01, "El descuento debe ser mayor a 0")
      .max(100, "El descuento no puede ser mayor a 100")
      .nullable()
      .optional(),
  })
  .refine((data) => data.productosIds || data.idProducto, {
    message: "Debe proporcionar productosIds (array) o idProducto (número)",
    path: ["productosIds"],
  });

const removeProductosSchema = z
  .object({
    productosIds: z
      .array(z.number().int().positive())
      .min(1, "Debe proporcionar al menos un producto")
      .optional(),

    idProducto: z
      .number()
      .int()
      .positive("El ID del producto debe ser un número positivo")
      .optional(),
  })
  .refine((data) => data.productosIds || data.idProducto, {
    message: "Debe proporcionar productosIds (array) o idProducto (número)",
    path: ["productosIds"],
  });

const updateOverrideSchema = z.object({
  porcentajeDescuentoOverride: z
    .number()
    .min(0.01, "El descuento debe ser mayor a 0")
    .max(100, "El descuento no puede ser mayor a 100")
    .nullable(),
});

// ==================== EXPORTAR ====================

module.exports = {
  idCampanaParam,
  idProductoParam,
  idRelacionParam,
  createCampanaSchema,
  updateCampanaSchema,
  addProductosSchema,
  removeProductosSchema,
  updateOverrideSchema,
};
