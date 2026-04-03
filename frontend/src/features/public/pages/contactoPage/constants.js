export const CONTACTO_CARD_ENTER = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const CONTACTO_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.751939871542!2d-65.20793688495086!3d-26.81603598316744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad7f30f61%3A0x880ef21f4358844!2sPlaza%20Independencia!5e0!3m2!1ses-419!2sar!4v1615832094258!5m2!1ses-419!2sar";

export const TIPOS_REQUIEREN_LOGIN = new Set(["pedido", "receta"]);

export const LABELS_TIPO_CONSULTA = {
  general: "Consulta general",
  pedido: "Pedido",
  receta: "Receta",
  facturacion: "Facturacion",
  otro: "Otro",
};

export const TIPOS_CONSULTA_OPTIONS = [
  { value: "general", label: "Consulta general" },
  { value: "pedido", label: "Pedido (requiere cuenta)" },
  { value: "receta", label: "Receta (requiere cuenta)" },
  { value: "facturacion", label: "Facturación" },
  { value: "otro", label: "Otro" },
];

export const getInitialContactoForm = (user) => ({
  nombre: user?.nombre || "",
  email: user?.email || "",
  tipoConsulta: "general",
  asunto: "",
  mensaje: "",
});
