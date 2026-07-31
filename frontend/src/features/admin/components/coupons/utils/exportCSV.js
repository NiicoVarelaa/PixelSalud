import { formatearFecha } from "./formatters";

const TIPO_USUARIO_LABEL = { todos: "Todos", nuevo: "Nuevos", vip: "VIP" };

export const exportarCuponesCSV = (cupones) => {
  const headers = [
    "Codigo",
    "Descripcion",
    "Tipo",
    "Valor",
    "Audiencia",
    "Fecha Inicio",
    "Fecha Vencimiento",
    "Usos Maximos",
    "Veces Usado",
    "Monto Minimo",
    "Estado",
  ];

  const rows = cupones.map((cupon) => [
    cupon.codigo || "",
    cupon.descripcion || "",
    cupon.tipoCupon === "porcentaje" ? "Porcentaje" : "Monto fijo",
    cupon.tipoCupon === "porcentaje"
      ? `${cupon.valorDescuento}%`
      : `$${cupon.valorDescuento}`,
    TIPO_USUARIO_LABEL[cupon.tipoUsuario] ?? cupon.tipoUsuario,
    formatearFecha(cupon.fechaInicio),
    formatearFecha(cupon.fechaVencimiento),
    cupon.usoMaximo || "Ilimitado",
    cupon.vecesUsado || 0,
    cupon.montoMinimo ? `$${cupon.montoMinimo}` : "Sin minimo",
    cupon.estado,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cupones_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
