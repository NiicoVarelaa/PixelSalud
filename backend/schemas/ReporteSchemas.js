const { z } = require("zod");

/**
 * Schema para validar filtros de reporte de ventas online
 */
const reporteVentasOnlineSchema = z.object({
  query: z.object({
    fechaDesde: z
      .string({
        invalid_type_error:
          "La fecha desde debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha desde debe estar en formato YYYY-MM-DD",
      )
      .optional(),

    fechaHasta: z
      .string({
        invalid_type_error:
          "La fecha hasta debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha hasta debe estar en formato YYYY-MM-DD",
      )
      .optional(),

    estado: z
      .string({
        invalid_type_error: "El estado debe ser texto",
      })
      .optional(),

    metodoPago: z
      .string({
        invalid_type_error: "El método de pago debe ser texto",
      })
      .optional(),
  }),
});

/**
 * Schema para validar filtros de reporte de ventas empleados
 */
const reporteVentasEmpleadosSchema = z.object({
  query: z.object({
    fechaDesde: z
      .string({
        invalid_type_error:
          "La fecha desde debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha desde debe estar en formato YYYY-MM-DD",
      )
      .optional(),

    fechaHasta: z
      .string({
        invalid_type_error:
          "La fecha hasta debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha hasta debe estar en formato YYYY-MM-DD",
      )
      .optional(),

    estado: z
      .string({
        invalid_type_error: "El estado debe ser texto",
      })
      .optional(),

    metodoPago: z
      .string({
        invalid_type_error: "El método de pago debe ser texto",
      })
      .optional(),

    idEmpleado: z.coerce
      .number({
        invalid_type_error: "El ID del empleado debe ser un número",
      })
      .int("El ID del empleado debe ser un número entero")
      .positive("El ID del empleado debe ser un número positivo")
      .optional(),
  }),
});

/**
 * Schema para validar filtros de reporte consolidado
 */
const reporteConsolidadoSchema = z.object({
  query: z.object({
    fechaDesde: z
      .string({
        invalid_type_error:
          "La fecha desde debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha desde debe estar en formato YYYY-MM-DD",
      )
      .optional(),

    fechaHasta: z
      .string({
        invalid_type_error:
          "La fecha hasta debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha hasta debe estar en formato YYYY-MM-DD",
      )
      .optional(),
  }),
});

/**
 * Schema para validar filtros de reporte de productos vendidos
 */
const reporteProductosVendidosSchema = z.object({
  query: z.object({
    fechaDesde: z
      .string({
        invalid_type_error:
          "La fecha desde debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha desde debe estar en formato YYYY-MM-DD",
      )
      .optional(),

    fechaHasta: z
      .string({
        invalid_type_error:
          "La fecha hasta debe ser texto en formato YYYY-MM-DD",
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "La fecha hasta debe estar en formato YYYY-MM-DD",
      )
      .optional(),

    categoria: z
      .string({
        invalid_type_error: "La categoría debe ser texto",
      })
      .optional(),
  }),
});

module.exports = {
  reporteVentasOnlineSchema,
  reporteVentasEmpleadosSchema,
  reporteConsolidadoSchema,
  reporteProductosVendidosSchema,
};
