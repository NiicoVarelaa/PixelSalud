const { z } = require("zod");

/**
 * Schema para validar el ID del empleado en los parámetros de ruta
 */
const idEmpleadoParamSchema = z.object({
  id: z.coerce
    .number({
      required_error: "El ID del empleado es requerido",
      invalid_type_error: "El ID del empleado debe ser un número",
    })
    .int("El ID del empleado debe ser un número entero")
    .positive("El ID del empleado debe ser mayor a 0"),
});

/**
 * Schema para validar los datos de permisos al crear o actualizar
 */
const permisoSchema = z.object({
  crear_productos: z
    .boolean({
      required_error: "El permiso crear_productos es requerido",
      invalid_type_error: "El permiso crear_productos debe ser un booleano",
    })
    .default(false),

  modificar_productos: z
    .boolean({
      required_error: "El permiso modificar_productos es requerido",
      invalid_type_error: "El permiso modificar_productos debe ser un booleano",
    })
    .default(false),

  modificar_ventasE: z
    .boolean({
      required_error: "El permiso modificar_ventasE es requerido",
      invalid_type_error: "El permiso modificar_ventasE debe ser un booleano",
    })
    .default(false),

  modificar_ventasO: z
    .boolean({
      required_error: "El permiso modificar_ventasO es requerido",
      invalid_type_error: "El permiso modificar_ventasO debe ser un booleano",
    })
    .default(false),

  ver_ventasTotalesE: z
    .boolean({
      required_error: "El permiso ver_ventasTotalesE es requerido",
      invalid_type_error: "El permiso ver_ventasTotalesE debe ser un booleano",
    })
    .default(false),

  ver_ventasTotalesO: z
    .boolean({
      required_error: "El permiso ver_ventasTotalesO es requerido",
      invalid_type_error: "El permiso ver_ventasTotalesO debe ser un booleano",
    })
    .default(false),
});

/**
 * Schema para actualizar permisos (todos los campos opcionales)
 */
const updatePermisoSchema = z.object({
  crear_productos: z
    .boolean({
      invalid_type_error: "El permiso crear_productos debe ser un booleano",
    })
    .optional(),

  modificar_productos: z
    .boolean({
      invalid_type_error: "El permiso modificar_productos debe ser un booleano",
    })
    .optional(),

  modificar_ventasE: z
    .boolean({
      invalid_type_error: "El permiso modificar_ventasE debe ser un booleano",
    })
    .optional(),

  modificar_ventasO: z
    .boolean({
      invalid_type_error: "El permiso modificar_ventasO debe ser un booleano",
    })
    .optional(),

  ver_ventasTotalesE: z
    .boolean({
      invalid_type_error: "El permiso ver_ventasTotalesE debe ser un booleano",
    })
    .optional(),

  ver_ventasTotalesO: z
    .boolean({
      invalid_type_error: "El permiso ver_ventasTotalesO debe ser un booleano",
    })
    .optional(),
});

module.exports = {
  idEmpleadoParamSchema,
  permisoSchema,
  updatePermisoSchema,
};
