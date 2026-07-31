export const formatFecha = (fechaStr) => {
  if (!fechaStr) return "-";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return "-";
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
};

export const estadoLabels = {
  nuevo: "Nuevo",
  en_proceso: "En proceso",
  respondido: "Respondido",
  cerrado: "Cerrado",
};

export const getEstadoColor = (estado) => {
  const colors = {
    nuevo: "bg-green-100 text-green-800",
    en_proceso: "bg-yellow-100 text-yellow-800",
    respondido: "bg-blue-100 text-blue-800",
    cerrado: "bg-gray-100 text-gray-700",
  };
  return colors[estado] || "bg-gray-100 text-gray-700";
};
