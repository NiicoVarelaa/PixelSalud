import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresá un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const registroSchema = z.object({
  nombreCliente: z
    .string()
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .trim(),
  apellidoCliente: z
    .string()
    .min(2, "Apellido debe tener al menos 2 caracteres")
    .trim(),
  email: z.string().email("Ingresá un correo electrónico válido"),
  contraCliente: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
