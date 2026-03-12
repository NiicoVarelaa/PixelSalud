export const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatearFechaInput = (fechaISO) => {
  if (!fechaISO) return "";
  return fechaISO.split("T")[0];
};

export const getBadgeColor = (estado) => {
  const colors = {
    activo: "bg-green-100 text-green-800",
    inactivo: "bg-gray-100 text-gray-800",
    expirado: "bg-red-100 text-red-800",
  };
  return colors[estado] || "bg-gray-100 text-gray-800";
};

export const getTipoUsuarioBadge = (tipo) => {
  const badges = {
    todos: "bg-blue-100 text-blue-800",
    nuevo: "bg-purple-100 text-purple-800",
    vip: "bg-yellow-100 text-yellow-800",
  };
  return badges[tipo] || "bg-gray-100 text-gray-800";
};
