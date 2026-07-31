const { z } = require("zod");

const idClienteParamSchema = z.object({
  idCliente: z
    .string()
    .regex(/^\d+$/, "idCliente debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idCliente debe ser mayor a 0"),
});

const idProductoParamSchema = z.object({
  idProducto: z
    .string()
    .regex(/^\d+$/, "idProducto debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idProducto debe ser mayor a 0"),
});

const eliminarProductoParamsSchema = z.object({
  idCliente: z
    .string()
    .regex(/^\d+$/, "idCliente debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idCliente debe ser mayor a 0"),
  idProducto: z
    .string()
    .regex(/^\d+$/, "idProducto debe ser un número")
    .transform(Number)
    .refine((val) => val > 0, "idProducto debe ser mayor a 0"),
});

const agregarCarritoSchema = z.object({
  idCliente: z
    .number({ required_error: "idCliente es requerido" })
    .int("idCliente debe ser un entero")
    .positive("idCliente debe ser positivo"),
  idProducto: z
    .number({ required_error: "idProducto es requerido" })
    .int("idProducto debe ser un entero")
    .positive("idProducto debe ser positivo"),
  cantidad: z
    .number()
    .int("cantidad debe ser un entero")
    .positive("cantidad debe ser mayor a 0")
    .min(1, "cantidad mínima es 1")
    .max(999, "cantidad máxima es 999")
    .default(1)
    .optional(),
});

const modificarCantidadSchema = z.object({
  idCliente: z
    .number({ required_error: "idCliente es requerido" })
    .int("idCliente debe ser un entero")
    .positive("idCliente debe ser positivo"),
  idProducto: z
    .number({ required_error: "idProducto es requerido" })
    .int("idProducto debe ser un entero")
    .positive("idProducto debe ser positivo"),
});

module.exports = {
  idClienteParamSchema,
  idProductoParamSchema,
  eliminarProductoParamsSchema,
  agregarCarritoSchema,
  modificarCantidadSchema,
};
