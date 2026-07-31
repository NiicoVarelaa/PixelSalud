const { z } = require("zod");

const productosMasVendidosSchema = {
  query: z.object({
    limite: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(
        z
          .number()
          .int({ message: "El límite debe ser un número entero" })
          .min(1, { message: "El límite debe ser al menos 1" })
          .max(50, { message: "El límite no puede ser mayor a 50" }),
      ),
  }),
};

const graficoVentasSchema = {
  query: z.object({
    dias: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 7))
      .pipe(
        z
          .number()
          .int({ message: "Los días deben ser un número entero" })
          .min(1, { message: "Los días deben ser al menos 1" })
          .max(90, { message: "Los días no pueden ser más de 90" }),
      ),
  }),
};

module.exports = {
  productosMasVendidosSchema,
  graficoVentasSchema,
};
