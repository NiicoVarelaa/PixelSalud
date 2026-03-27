const { z } = require("zod");

const createNewsletterSubscriptionSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "El email es requerido",
        invalid_type_error: "El email debe ser texto",
      })
      .email("El email debe ser válido")
      .max(150, "El email no debe exceder 150 caracteres")
      .trim()
      .toLowerCase(),

    nombre: z
      .string({
        invalid_type_error: "El nombre debe ser texto",
      })
      .max(100, "El nombre no debe exceder 100 caracteres")
      .trim()
      .optional(),

    idCliente: z
      .number({
        invalid_type_error: "El ID del cliente debe ser numérico",
      })
      .int("El ID del cliente debe ser entero")
      .positive("El ID del cliente debe ser positivo")
      .optional(),

    aceptaMarketing: z
      .boolean({
        required_error: "Debes aceptar comunicaciones comerciales",
        invalid_type_error: "El consentimiento debe ser booleano",
      })
      .refine((value) => value === true, {
        message: "Debes aceptar comunicaciones comerciales",
      }),

    fuente: z
      .enum(["footer", "popup", "checkout", "perfil", "otro"], {
        invalid_type_error: "La fuente indicada no es válida",
      })
      .optional()
      .default("footer"),
  }),
});

const newsletterUnsubscribeQuerySchema = z.object({
  query: z.object({
    token: z
      .string({
        required_error: "El token es requerido",
        invalid_type_error: "El token debe ser texto",
      })
      .min(10, "El token es inválido")
      .trim(),
  }),
});

module.exports = {
  createNewsletterSubscriptionSchema,
  newsletterUnsubscribeQuerySchema,
};
