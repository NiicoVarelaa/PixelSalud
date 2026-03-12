// Formateador de fechas tipo dd/MM/yyyy HH:mm
export const formatFecha = (fechaStr) => {
  if (!fechaStr) return "-";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return "-";
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
};

// Labels de estado
export const estadoLabels = {
  nuevo: "Nuevo",
  en_proceso: "En proceso",
  respondido: "Respondido",
  cerrado: "Cerrado",
};

// Colores de badge por estado
export const getEstadoColor = (estado) => {
  const colors = {
    nuevo: "bg-primary-100 text-primary-700",
    en_proceso: "bg-yellow-100 text-yellow-700",
    respondido: "bg-blue-100 text-blue-700",
    cerrado: "bg-gray-200 text-gray-600",
  };
  return colors[estado] || "bg-gray-100 text-gray-700";
};
