import { DATE_RANGES } from "./reportData";

export const DEFAULT_VALUES = {
  categoria: "Todas",
  estado: "Todos",
  metodoPago: "Todos",
};

export const OPCIONES_ESTADO = [
  { value: "Todos", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "retirado", label: "Retirado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "completada", label: "Completada" },
  { value: "anulada", label: "Anulada" },
];

export const OPCIONES_METODO_PAGO = [
  { value: "Todos", label: "Todos los métodos" },
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta", label: "Tarjeta" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "Mercado Pago", label: "Mercado Pago" },
];

export const OPCIONES_CATEGORIA = [
  { value: "Todas", label: "Todas las categorías" },
  { value: "Fragancias", label: "Fragancias" },
  { value: "Belleza", label: "Belleza" },
  { value: "Dermocosmética", label: "Dermocosmética" },
  { value: "Medicamentos con Receta", label: "Medicamentos con Receta" },
  {
    value: "Medicamentos Venta Libre",
    label: "Medicamentos Venta Libre",
  },
  { value: "Cuidado Personal", label: "Cuidado Personal" },
  { value: "Bebés y Niños", label: "Bebés y Niños" },
  { value: "Nutrición y Deportes", label: "Nutrición y Deportes" },
];

export const RANGE_LABEL_BY_KEY = DATE_RANGES.reduce((acc, range) => {
  acc[range.key] = range.label;
  return acc;
}, {});
