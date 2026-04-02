import {
  User,
  Mail,
  IdCard,
  Phone,
  CalendarDays,
  KeyRound,
} from "lucide-react";

export const FIELD_CONFIG = [
  {
    key: "nombreCliente",
    label: "Nombre",
    type: "text",
    icon: User,
    required: true,
    autoComplete: "given-name",
  },
  {
    key: "apellidoCliente",
    label: "Apellido",
    type: "text",
    icon: User,
    required: true,
    autoComplete: "family-name",
  },
  {
    key: "emailCliente",
    label: "Correo electrónico",
    type: "email",
    icon: Mail,
    required: true,
    readOnly: true,
    helpText: "El email no se puede modificar.",
    autoComplete: "email",
  },
  {
    key: "dni",
    label: "DNI",
    type: "text",
    inputMode: "numeric",
    icon: IdCard,
    required: true,
    autoComplete: "off",
  },
  {
    key: "telefono",
    label: "Teléfono",
    type: "tel",
    icon: Phone,
    required: true,
    autoComplete: "tel",
  },
  {
    key: "fechaNacimiento",
    label: "Fecha de nacimiento",
    type: "date",
    icon: CalendarDays,
    max: "today",
    autoComplete: "bday",
  },
];

export const PASSWORD_FIELDS = [
  {
    key: "contraCliente",
    label: "Nueva contraseña",
    type: "password",
    icon: KeyRound,
    autoComplete: "new-password",
    placeholder: "Dejar vacío para no cambiar",
    helpText: "Mínimo 6 caracteres.",
    optional: true,
  },
  {
    key: "confirmarContraCliente",
    label: "Confirmar nueva contraseña",
    type: "password",
    icon: KeyRound,
    autoComplete: "new-password",
    placeholder: "Repetí la nueva contraseña",
    optional: true,
  },
];

export const EDITABLE_KEYS = [
  "nombreCliente",
  "apellidoCliente",
  "telefono",
  "dni",
  "fechaNacimiento",
];

export const normalizarFechaInput = (fecha) => {
  if (!fecha) return "";
  if (typeof fecha === "string") return fecha.slice(0, 10);
  return "";
};
