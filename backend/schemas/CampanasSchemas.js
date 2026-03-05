const { z } = require("zod");

// Helper para normalizar fechas de diferentes formatos
const normalizarFecha = (fecha) => {
  if (!fecha) return fecha;
  // Si es solo fecha (YYYY-MM-DD), agregar hora 00:00:00
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return `${fecha} 00:00:00`;
  }
  // Si es ISO datetime (YYYY-MM-DDTHH:mm:ss), convertir a formato MySQL
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(fecha)) {
    return fecha.replace("T", " ").substring(0, 19);
  }
  return fecha;
};

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
      .min(1, "La fecha de inicio es requerida")
      .transform(normalizarFecha),

    fechaFin: z
      .string()
      .min(1, "La fecha de fin es requerida")
      .transform(normalizarFecha),

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
      .min(1, "La fecha de inicio es requerida")
      .transform(normalizarFecha)
      .optional(),

    fechaFin: z
      .string()
      .min(1, "La fecha de fin es requerida")
      .transform(normalizarFecha)
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
