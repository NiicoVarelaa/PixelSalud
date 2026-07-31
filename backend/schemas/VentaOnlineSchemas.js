const { z } = require("zod");

const idVentaOParamSchema = z.object({
  idVentaO: z.coerce
    .number({
      required_error: "El ID de la venta online es requerido",
      invalid_type_error: "El ID de la venta online debe ser un número",
    })
    .int("El ID de la venta online debe ser un número entero")
    .positive("El ID de la venta online debe ser mayor a 0"),
});

const productoVentaSchema = z.object({
  idProducto: z
    .number({
      required_error: "El ID del producto es requerido",
      invalid_type_error: "El ID del producto debe ser un número",
    })
    .int("El ID del producto debe ser un número entero")
    .positive("El ID del producto debe ser mayor a 0"),

  cantidad: z
    .number({
      required_error: "La cantidad es requerida",
      invalid_type_error: "La cantidad debe ser un número",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),

  precioUnitario: z
    .number({
      required_error: "El precio unitario es requerido",
      invalid_type_error: "El precio unitario debe ser un número",
    })
    .positive("El precio unitario debe ser mayor a 0"),
});

const direccionEnvioSchema = z.object({
  nombreDestinatario: z
    .string({
      required_error: "El nombre del destinatario es requerido",
    })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),

  telefono: z
    .string({
      required_error: "El teléfono es requerido",
    })
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .trim(),

  direccion: z
    .string({
      required_error: "La dirección es requerida",
    })
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres")
    .trim(),

  ciudad: z
    .string({
      required_error: "La ciudad es requerida",
    })
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad no puede exceder 100 caracteres")
    .trim(),

  provincia: z
    .string({
      required_error: "La provincia es requerida",
    })
    .min(2, "La provincia debe tener al menos 2 caracteres")
    .max(100, "La provincia no puede exceder 100 caracteres")
    .trim(),

  codigoPostal: z
    .string({
      required_error: "El código postal es requerido",
    })
    .min(4, "El código postal debe tener al menos 4 caracteres")
    .max(10, "El código postal no puede exceder 10 caracteres")
    .trim(),

  referencias: z
    .string()
    .max(500, "Las referencias no pueden exceder 500 caracteres")
    .trim()
    .optional(),
});

const createVentaOnlineSchema = z.object({
  metodoPago: z
    .string({
      required_error: "El método de pago es requerido",
    })
    .min(2, "El método de pago es inválido")
    .max(50, "El método de pago no puede exceder 50 caracteres")
    .trim(),

  idCliente: z
    .number({
      required_error: "El ID del cliente es requerido",
      invalid_type_error: "El ID del cliente debe ser un número",
    })
    .int("El ID del cliente debe ser un número entero")
    .positive("El ID del cliente debe ser mayor a 0"),

  productos: z
    .array(productoVentaSchema, {
      required_error: "Los productos son requeridos",
      invalid_type_error: "Los productos deben ser un array",
    })
    .min(1, "Debe incluir al menos un producto en la venta")
    .max(100, "No se pueden incluir más de 100 productos en una venta"),

  tipoEntrega: z.enum(["Envio", "Retiro"], {
    required_error: "El tipo de entrega es requerido",
    invalid_type_error: "El tipo de entrega debe ser 'Envio' o 'Retiro'",
  }),

  direccionEnvio: direccionEnvioSchema.optional(),
});

const updateEstadoVentaSchema = z.object({
  idVentaO: z
    .number({
      required_error: "El ID de la venta online es requerido",
      invalid_type_error: "El ID de la venta online debe ser un número",
    })
    .int("El ID de la venta online debe ser un número entero")
    .positive("El ID de la venta online debe ser mayor a 0"),

  nuevoEstado: z
    .string({
      required_error: "El nuevo estado es requerido",
    })
    .min(2, "El estado es inválido")
    .max(50, "El estado no puede exceder 50 caracteres")
    .trim(),
});

const productoActualizarVentaSchema = z.object({
  idProducto: z
    .number({
      required_error: "El ID del producto es requerido",
      invalid_type_error: "El ID del producto debe ser un número",
    })
    .int("El ID del producto debe ser un número entero")
    .positive("El ID del producto debe ser mayor a 0"),

  cantidad: z
    .number({
      required_error: "La cantidad es requerida",
      invalid_type_error: "La cantidad debe ser un número",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
});

const updateVentaOnlineSchema = z.object({
  metodoPago: z
    .string({
      required_error: "El método de pago es requerido",
    })
    .min(2, "El método de pago es inválido")
    .max(50, "El método de pago no puede exceder 50 caracteres")
    .trim(),

  productos: z
    .array(productoActualizarVentaSchema, {
      required_error: "Los productos son requeridos",
      invalid_type_error: "Los productos deben ser un array",
    })
    .min(1, "Debe incluir al menos un producto en la venta")
    .max(100, "No se pueden incluir más de 100 productos en una venta"),
});

module.exports = {
  idVentaOParamSchema,
  createVentaOnlineSchema,
  updateEstadoVentaSchema,
  updateVentaOnlineSchema,
};
