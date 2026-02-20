const { z } = require("zod");

const toggleFavoritoSchema = z.object({
  idProducto: z
    .number({
      required_error: "idProducto es requerido",
      invalid_type_error: "idProducto debe ser un número",
    })
    .int("idProducto debe ser un número entero")
    .positive("idProducto debe ser mayor a 0"),
});

const idProductoParamSchema = z.object({
  idProducto: z
    .string()
    .regex(/^\d+$/, "idProducto debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idProducto debe ser mayor a 0"),
});

module.exports = {
  toggleFavoritoSchema,
  idProductoParamSchema,
};
