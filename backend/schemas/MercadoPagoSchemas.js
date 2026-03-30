const { z } = require("zod");

const dniSchema = z.union([
  z.string().regex(/^\d{7,8}$/, { message: "El DNI debe tener 7 u 8 dígitos" }),
  z
    .number()
    .int({ message: "El DNI debe ser un número entero" })
    .min(1000000, { message: "El DNI debe tener al menos 7 dígitos" })
    .max(99999999, { message: "El DNI debe tener máximo 8 dígitos" }),
]);

const fechaNacimientoSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "La fecha de nacimiento debe tener formato YYYY-MM-DD",
});

const celularArSchema = z
  .string()
  .regex(/^(\+54\s?)?(9\s?)?\d{2,4}[\s-]?\d{6,8}$/, {
    message: "El celular debe tener formato argentino válido",
  });

const createOrderSchema = z.object({
  products: z
    .array(
      z.object({
        id: z
          .number({ required_error: "ID del producto es requerido" })
          .int({ message: "ID del producto debe ser un entero" })
          .positive({ message: "ID del producto debe ser positivo" }),
        quantity: z
          .number({ required_error: "Cantidad es requerida" })
          .int({ message: "Cantidad debe ser un entero" })
          .positive({ message: "Cantidad debe ser positiva" })
          .min(1, { message: "La cantidad mínima es 1" })
          .max(1000, { message: "La cantidad máxima es 1000" }),
      }),
    )
    .min(1, { message: "Debe incluir al menos un producto" })
    .max(100, { message: "Máximo 100 productos por orden" }),

  customer_info: z.object({
    name: z
      .string({ required_error: "Nombre es requerido" })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(100, { message: "El nombre no puede exceder 100 caracteres" })
      .optional(),

    surname: z
      .string()
      .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
      .max(100, { message: "El apellido no puede exceder 100 caracteres" })
      .optional(),

    email: z
      .string({ required_error: "Email es requerido" })
      .email({ message: "Formato de email inválido" }),

    phone: z
      .string()
      .regex(/^\+?[\d\s()-]+$/, {
        message: "Formato de teléfono inválido",
      })
      .optional(),

    address: z
      .object({
        street_name: z.string().optional(),
        street_number: z.union([z.string(), z.number()]).optional(),
        zip_code: z.string().optional(),
      })
      .optional(),
  }),

  discount: z
    .number()
    .min(0, { message: "El descuento no puede ser negativo" })
    .optional(),

  checkout_data: z.object({
    dni: dniSchema,
    fechaNacimiento: fechaNacimientoSchema,
    celular: celularArSchema,
    aceptaTyC: z
      .boolean({ required_error: "Debes aceptar los términos legales" })
      .refine(
        (value) => value === true,
        "Debes aceptar Términos y condiciones, Política de privacidad y Bases y condiciones",
      ),
    sucursalCodigo: z
      .string({ required_error: "La sucursal es requerida" })
      .min(1, { message: "La sucursal es requerida" }),
    sucursalNombre: z
      .string({ required_error: "El nombre de la sucursal es requerido" })
      .min(1, { message: "El nombre de la sucursal es requerido" }),
    sucursalDireccion: z
      .string({ required_error: "La dirección de la sucursal es requerida" })
      .min(1, { message: "La dirección de la sucursal es requerida" }),
    legalVersion: z
      .string()
      .min(1, { message: "La versión legal es requerida" })
      .optional(),
  }),
});

const webhookSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),

  type: z.string().optional(),

  topic: z.string().optional(),

  action: z.string().optional(),

  data: z
    .object({
      id: z.union([z.number(), z.string()]),
    })
    .optional(),

  resource: z.string().optional(),

  date_created: z.string().optional(),

  user_id: z.union([z.number(), z.string()]).optional(),
});

module.exports = {
  createOrderSchema,
  webhookSchema,
};
