import { hasActiveOffer, normalizeDiscount } from "./ofertasFilters";

export const exportarOfertasCSV = (productos) => {
  const productosConOferta = productos.filter((p) => hasActiveOffer(p));

  const headers = [
    "Producto",
    "Categoria",
    "Precio Regular",
    "Descuento",
    "Precio Final",
    "Ahorro",
  ];

  const rows = productosConOferta.map((p) => {
    const precioRegular = Number(p.precioRegular || p.precio || 0);
    const descuento = normalizeDiscount(p.porcentajeDescuento);
    const precioFinal = precioRegular * (1 - descuento / 100);
    const ahorro = precioRegular - precioFinal;

    return [
      p.nombreProducto || "",
      p.categoria || "",
      `$${precioRegular.toLocaleString("es-AR")}`,
      `${descuento}%`,
      `$${precioFinal.toLocaleString("es-AR")}`,
      `$${ahorro.toLocaleString("es-AR")}`,
    ];
  });

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
  link.download = `ofertas_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
