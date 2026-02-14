const { z } = require("zod");

/**
 * Schema para validar el idVentaE como parámetro de ruta
 */
const idVentaEParamSchema = z.object({
  idVentaE: z.coerce
    .number({
      required_error: "El ID de la venta es requerido",
      invalid_type_error: "El ID de la venta debe ser un número",
    })
    .int("El ID de la venta debe ser un número entero")
    .positive("El ID de la venta debe ser un número positivo"),
});

/**
 * Schema para validar el idEmpleado como parámetro de ruta
 */
const idEmpleadoParamSchema = z.object({
  idEmpleado: z.coerce
    .number({
      required_error: "El ID del empleado es requerido",
      invalid_type_error: "El ID del empleado debe ser un número",
    })
    .int("El ID del empleado debe ser un número entero")
    .positive("El ID del empleado debe ser un número positivo"),
});

/**
 * Schema para validar un producto dentro de una venta de empleado
 */
const productoVentaEmpleadoSchema = z.object({
  idProducto: z
    .number({
      required_error: "El ID del producto es requerido",
      invalid_type_error: "El ID del producto debe ser un número",
    })
    .int("El ID del producto debe ser un número entero")
    .positive("El ID del producto debe ser un número positivo"),

  cantidad: z
    .number({
      required_error: "La cantidad es requerida",
      invalid_type_error: "La cantidad debe ser un número",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser un número positivo")
    .min(1, "La cantidad mínima es 1")
    .max(1000, "La cantidad máxima es 1000"),

  precioUnitario: z
    .number({
      required_error: "El precio unitario es requerido",
      invalid_type_error: "El precio unitario debe ser un número",
    })
    .positive("El precio unitario debe ser un número positivo")
    .min(0.01, "El precio unitario mínimo es 0.01")
    .max(999999.99, "El precio unitario máximo es 999999.99"),

  recetaFisica: z
    .string()
    .max(255, "La receta física no debe exceder 255 caracteres")
    .optional()
    .nullable(),
});

/**
 * Schema para validar la creación de una venta de empleado
 */
const createVentaEmpleadoSchema = z.object({
  body: z.object({
    idEmpleado: z
      .number({
        required_error: "El ID del empleado es requerido",
        invalid_type_error: "El ID del empleado debe ser un número",
      })
      .int("El ID del empleado debe ser un número entero")
      .positive("El ID del empleado debe ser un número positivo"),

    totalPago: z
      .number({
        required_error: "El total es requerido",
        invalid_type_error: "El total debe ser un número",
      })
      .positive("El total debe ser un número positivo")
      .min(0.01, "El total mínimo es 0.01")
      .max(9999999.99, "El total máximo es 9999999.99"),

    metodoPago: z
      .string({
        required_error: "El método de pago es requerido",
        invalid_type_error: "El método de pago debe ser texto",
      })
      .min(2, "El método de pago debe tener al menos 2 caracteres")
      .max(50, "El método de pago no debe exceder 50 caracteres")
      .trim(),

    productos: z
      .array(productoVentaEmpleadoSchema, {
        required_error: "Los productos son requeridos",
        invalid_type_error: "Los productos deben ser un array",
      })
      .min(1, "Debe incluir al menos un producto")
      .max(100, "No se pueden incluir más de 100 productos"),
  }),
});

/**
 * Schema para validar la actualización de una venta de empleado
 */
const updateVentaEmpleadoSchema = z.object({
  params: idVentaEParamSchema.shape,
  body: z.object({
    idEmpleado: z
      .number({
        required_error: "El ID del empleado es requerido",
        invalid_type_error: "El ID del empleado debe ser un número",
      })
      .int("El ID del empleado debe ser un número entero")
      .positive("El ID del empleado debe ser un número positivo"),

    totalPago: z
      .number({
        required_error: "El total es requerido",
        invalid_type_error: "El total debe ser un número",
      })
      .positive("El total debe ser un número positivo")
      .min(0.01, "El total mínimo es 0.01")
      .max(9999999.99, "El total máximo es 9999999.99"),

    metodoPago: z
      .string({
        required_error: "El método de pago es requerido",
        invalid_type_error: "El método de pago debe ser texto",
      })
      .min(2, "El método de pago debe tener al menos 2 caracteres")
      .max(50, "El método de pago no debe exceder 50 caracteres")
      .trim(),

    productos: z
      .array(productoVentaEmpleadoSchema, {
        required_error: "Los productos son requeridos",
        invalid_type_error: "Los productos deben ser un array",
      })
      .min(1, "Debe incluir al menos un producto")
      .max(100, "No se pueden incluir más de 100 productos"),
  }),
});

module.exports = {
  idVentaEParamSchema,
  idEmpleadoParamSchema,
  productoVentaEmpleadoSchema,
  createVentaEmpleadoSchema,
  updateVentaEmpleadoSchema,
};
