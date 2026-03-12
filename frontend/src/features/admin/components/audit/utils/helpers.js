export const formatearFecha = (fecha) => {
  if (!fecha) return "N/A";
  return new Date(fecha).toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const getEventoBadgeColor = (evento) => {
  if (evento.includes("EXITOSO") || evento.includes("CREADA"))
    return "bg-green-100 text-green-800";
  if (evento.includes("FALLIDO") || evento.includes("ERROR"))
    return "bg-red-100 text-red-800";
  if (evento.includes("MODIFICADO") || evento.includes("ACTUALIZADO"))
    return "bg-blue-100 text-blue-800";
  if (evento.includes("ELIMINADO") || evento.includes("CANCELADA"))
    return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-800";
};

export const getRolBadgeColor = (rol) => {
  const colores = {
    admin: "bg-purple-100 text-purple-800",
    empleado: "bg-blue-100 text-blue-800",
    medico: "bg-green-100 text-green-800",
    cliente: "bg-gray-100 text-gray-800",
    sistema: "bg-orange-100 text-orange-800",
  };
  return colores[rol] || "bg-gray-100 text-gray-800";
};

export const formatearEvento = (evento) => {
  return evento.replace(/_/g, " ");
};
