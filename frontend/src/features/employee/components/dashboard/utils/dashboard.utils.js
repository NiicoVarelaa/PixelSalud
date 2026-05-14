export { formatMoneda } from "@utils/formatMoneda";

export const formatFecha = (fechaStr) => {
  if (!fechaStr) return "-";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return "-";
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
};

export const COLORS = {
  blue:   { bg: "bg-blue-50", icon: "text-green-600", border: "border-green-500" },
  green:  { bg: "bg-green-50", icon: "text-green-600", border: "border-green-500" },
  amber:  { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-500" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-500" },
  rose:   { bg: "bg-rose-50", icon: "text-rose-600", border: "border-rose-500" },
};
