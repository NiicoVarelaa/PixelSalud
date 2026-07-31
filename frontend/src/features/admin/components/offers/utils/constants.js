export const DESCUENTOS_DISPONIBLES = [10, 15, 20];

export const DESCUENTOS_DETALLE = [
  {
    valor: 10,
    label: "Bajo",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    buttonClass: "hover:border-emerald-300 hover:bg-emerald-50",
  },
  {
    valor: 15,
    label: "Medio",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    buttonClass: "hover:border-amber-300 hover:bg-amber-50",
  },
  {
    valor: 20,
    label: "Alto",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    buttonClass: "hover:border-red-300 hover:bg-red-50",
  },
];

export const OPCIONES_DESCUENTO_FILTRO = [
  { value: "todos", label: "Todos los descuentos" },
  { value: "10", label: "10% OFF" },
  { value: "15", label: "15% OFF" },
  { value: "20", label: "20% OFF" },
];

export const ATAJOS_DESCUENTO = [
  { key: "todos", label: "Todos" },
  { key: "10", label: "10% OFF" },
  { key: "15", label: "15% OFF" },
  { key: "20", label: "20% OFF" },
];
