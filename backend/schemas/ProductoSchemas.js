const { z } = require("zod");

// ==========================================
// SCHEMAS PARA PARÁMETROS
// ==========================================

/**
 * Schema para validar ID de producto en params
 */
const idProductoParamSchema = z.object({
  idProducto: z
    .string()
    .regex(/^\d+$/, "ID debe ser numérico")
    .transform(Number)
    .refine((val) => val > 0, "ID debe ser mayor a 0"),
});

/**
 * Schema para validar ID genérico en params
 */
const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID debe ser numérico")
    .transform(Number)
    .refine((val) => val > 0, "ID debe ser mayor a 0"),
});

// ==========================================
// SCHEMAS PARA QUERY PARAMS
// ==========================================

/**
 * Schema para búsqueda de productos
 */
const buscarProductosQuerySchema = z.object({
  term: z
    .string()
    .min(3, "El término de búsqueda debe tener al menos 3 caracteres")
    .max(100, "El término de búsqueda es demasiado largo"),
});

// ==========================================
// SCHEMAS PARA PRODUCTOS
// ==========================================

/**
 * Schema para crear un nuevo producto
 */
const createProductoSchema = z.object({
  nombreProducto: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),

  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional()
    .nullable(),

  precio: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, "El precio debe ser mayor a 0")
    .refine((val) => val <= 999999.99, "El precio es demasiado alto"),

  img: z
    .string()
    .url("La imagen debe ser una URL válida")
    .optional()
    .nullable(),

  categoria: z
    .string()
    .min(3, "La categoría debe tener al menos 3 caracteres")
    .max(30, "La categoría no puede exceder 30 caracteres"),

  stock: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .refine(
      (val) => !isNaN(val) && Number.isInteger(val),
      "El stock debe ser un número entero",
    )
    .refine((val) => val >= 0, "El stock no puede ser negativo"),

  requiereReceta: z
    .union([z.boolean(), z.number(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "number") return val === 1;
      if (typeof val === "string")
        return val === "1" || val.toLowerCase() === "true";
      return false;
    })
    .default(false),
});

/**
 * Schema para actualizar un producto (todos los campos opcionales)
 */
const updateProductoSchema = z
  .object({
    nombreProducto: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(200, "El nombre no puede exceder 200 caracteres")
      .optional(),

    descripcion: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .optional()
      .nullable(),

    precio: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
      .refine((val) => !isNaN(val) && val > 0, "El precio debe ser mayor a 0")
      .refine((val) => val <= 999999.99, "El precio es demasiado alto")
      .optional(),

    img: z
      .string()
      .url("La imagen debe ser una URL válida")
      .optional()
      .nullable(),

    categoria: z
      .string()
      .min(3, "La categoría debe tener al menos 3 caracteres")
      .max(30, "La categoría no puede exceder 30 caracteres")
      .optional(),

    stock: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
      .refine(
        (val) => !isNaN(val) && Number.isInteger(val),
        "El stock debe ser un número entero",
      )
      .refine((val) => val >= 0, "El stock no puede ser negativo")
      .optional(),

    requiereReceta: z
      .union([z.boolean(), z.number(), z.string()])
      .transform((val) => {
        if (typeof val === "boolean") return val;
        if (typeof val === "number") return val === 1;
        if (typeof val === "string")
          return val === "1" || val.toLowerCase() === "true";
        return false;
      })
      .optional(),

    activo: z
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

/**
 * Schema para actualizar solo el estado activo
 */
const updateActivoSchema = z.object({
  activo: z.union([z.boolean(), z.number(), z.string()]).transform((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val === 1;
    if (typeof val === "string")
      return val === "1" || val.toLowerCase() === "true";
    return false;
  }),
});

module.exports = {
  // Params
  idProductoParamSchema,
  idParamSchema,

  // Query
  buscarProductosQuerySchema,

  // Productos
  createProductoSchema,
  updateProductoSchema,
  updateActivoSchema,
};
