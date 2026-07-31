const TIPO_LABEL = {
  DESCUENTO: "Descuento",
  "2X1": "2x1",
  EVENTO: "Evento",
  LIQUIDACION: "Liquidación",
  TEMPORADA: "Temporada",
};

const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const exportarCampanasCSV = (campanas) => {
  const headers = [
    "Nombre",
    "Tipo",
    "Descuento",
    "Fecha Inicio",
    "Fecha Fin",
    "Estado",
    "Productos",
    "Descripcion",
  ];

  const rows = campanas.map((campana) => [
    campana.nombreCampana || "",
    TIPO_LABEL[campana.tipo] ?? campana.tipo,
    campana.tipo === "2X1" ? "2x1" : `${campana.porcentajeDescuento}%`,
    formatearFecha(campana.fechaInicio),
    formatearFecha(campana.fechaFin),
    campana.esActiva ? "Activa" : "Inactiva",
    campana.totalProductos || 0,
    campana.descripcion || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `campanas_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
