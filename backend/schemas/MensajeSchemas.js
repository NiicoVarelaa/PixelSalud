const { z } = require("zod");

/**
 * Schema para validar el idMensaje como parámetro de ruta
 */
const idMensajeParamSchema = z.object({
  idMensaje: z.coerce
    .number({
      required_error: "El ID del mensaje es requerido",
      invalid_type_error: "El ID del mensaje debe ser un número",
    })
    .int("El ID del mensaje debe ser un número entero")
    .positive("El ID del mensaje debe ser un número positivo"),
});

/**
 * Schema para validar el idCliente como parámetro de ruta
 */
const idClienteParamSchema = z.object({
  idCliente: z.coerce
    .number({
      required_error: "El ID del cliente es requerido",
      invalid_type_error: "El ID del cliente debe ser un número",
    })
    .int("El ID del cliente debe ser un número entero")
    .positive("El ID del cliente debe ser un número positivo"),
});

/**
 * Schema para validar el estado como parámetro de ruta
 */
const estadoParamSchema = z.object({
  estado: z.enum(["nuevo", "leido", "respondido"], {
    required_error: "El estado es requerido",
    invalid_type_error: "El estado debe ser: nuevo, leido o respondido",
  }),
});

/**
 * Schema para validar la creación de un mensaje
 */
const createMensajeSchema = z.object({
  body: z.object({
    idCliente: z
      .number({
        required_error: "El ID del cliente es requerido",
        invalid_type_error: "El ID del cliente debe ser un número",
      })
      .int("El ID del cliente debe ser un número entero")
      .positive("El ID del cliente debe ser un número positivo"),

    nombre: z
      .string({
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser texto",
      })
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no debe exceder 100 caracteres")
      .trim(),

    email: z
      .string({
        required_error: "El email es requerido",
        invalid_type_error: "El email debe ser texto",
      })
      .email("El email debe ser válido")
      .max(100, "El email no debe exceder 100 caracteres")
      .trim()
      .toLowerCase(),

    asunto: z
      .string({
        invalid_type_error: "El asunto debe ser texto",
      })
      .max(200, "El asunto no debe exceder 200 caracteres")
      .trim()
      .optional(),

    mensaje: z
      .string({
        required_error: "El mensaje es requerido",
        invalid_type_error: "El mensaje debe ser texto",
      })
      .min(10, "El mensaje debe tener al menos 10 caracteres")
      .max(1000, "El mensaje no debe exceder 1000 caracteres")
      .trim(),

    fechaEnvio: z
      .string({
        invalid_type_error: "La fecha debe ser texto en formato ISO",
      })
      .datetime("La fecha debe estar en formato ISO 8601")
      .optional(),
  }),
});

/**
 * Schema para validar la actualización del estado de un mensaje
 */
const updateEstadoMensajeSchema = z.object({
  params: idMensajeParamSchema.shape,
  body: z.object({
    estado: z.enum(["nuevo", "leido", "respondido"], {
      required_error: "El estado es requerido",
      invalid_type_error: "El estado debe ser: nuevo, leido o respondido",
    }),
  }),
});

module.exports = {
  idMensajeParamSchema,
  idClienteParamSchema,
  estadoParamSchema,
  createMensajeSchema,
  updateEstadoMensajeSchema,
};
