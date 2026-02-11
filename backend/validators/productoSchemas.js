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
 * Schema para validar ID de oferta en params
 */
const idOfertaParamSchema = z.object({
  idOferta: z
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
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(999999.99, "El precio es demasiado alto"),

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
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  requiereReceta: z.boolean().default(false),
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
      .number()
      .positive("El precio debe ser mayor a 0")
      .max(999999.99, "El precio es demasiado alto")
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
      .number()
      .int("El stock debe ser un número entero")
      .min(0, "El stock no puede ser negativo")
      .optional(),

    requiereReceta: z.boolean().optional(),

    activo: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe proporcionar al menos un campo para actualizar",
  });

/**
 * Schema para actualizar solo el estado activo
 */
const updateActivoSchema = z.object({
  activo: z.boolean({
    required_error: "El campo activo es requerido",
    invalid_type_error: "El campo activo debe ser booleano",
  }),
});

// ==========================================
// SCHEMAS PARA OFERTAS
// ==========================================

/**
 * Schema para crear una nueva oferta
 */
const createOfertaSchema = z
  .object({
    idProducto: z
      .number()
      .int("El ID del producto debe ser un número entero")
      .positive("El ID del producto debe ser mayor a 0"),

    porcentajeDescuento: z
      .number()
      .min(0.01, "El descuento debe ser mayor a 0")
      .max(100, "El descuento no puede exceder 100%"),

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

/**
 * Schema para actualizar una oferta (todos los campos opcionales)
 */
const updateOfertaSchema = z
  .object({
    idProducto: z
      .number()
      .int("El ID del producto debe ser un número entero")
      .positive("El ID del producto debe ser mayor a 0")
      .optional(),

    porcentajeDescuento: z
      .number()
      .min(0.01, "El descuento debe ser mayor a 0")
      .max(100, "El descuento no puede exceder 100%")
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

    esActiva: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe proporcionar al menos un campo para actualizar",
  });

/**
 * Schema para actualizar solo el estado activo de una oferta
 */
const updateEsActivaSchema = z.object({
  esActiva: z.boolean({
    required_error: "El campo esActiva es requerido",
    invalid_type_error: "El campo esActiva debe ser booleano",
  }),
});

/**
 * Schema para crear ofertas masivas (Cyber Monday)
 */
const createOfertaMasivaSchema = z.object({
  productIds: z
    .array(z.number().int().positive())
    .min(1, "Debe proporcionar al menos un ID de producto")
    .optional(),

  porcentajeDescuento: z
    .number()
    .min(0.01, "El descuento debe ser mayor a 0")
    .max(100, "El descuento no puede exceder 100%")
    .optional()
    .default(25.0),
});

// ==========================================
// EXPORTACIONES
// ==========================================

module.exports = {
  // Params
  idProductoParamSchema,
  idOfertaParamSchema,
  idParamSchema,

  // Query
  buscarProductosQuerySchema,

  // Productos
  createProductoSchema,
  updateProductoSchema,
  updateActivoSchema,

  // Ofertas
  createOfertaSchema,
  updateOfertaSchema,
  updateEsActivaSchema,
  createOfertaMasivaSchema,
};
