const ExcelJS = require("exceljs");

const FORMATO_MONEDA = '"$"#,##0.00';

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

const estilosExcel = {
  headerStyle: {
    font: { bold: true, color: { argb: "FFFFFFFF" }, size: 12 },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } },
    alignment: { vertical: "middle", horizontal: "center" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  },
  subHeaderStyle: {
    font: { bold: true, size: 11 },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } },
    alignment: { vertical: "middle", horizontal: "center" },
  },
  titleStyle: {
    font: { bold: true, size: 16, color: { argb: "FF2E75B5" } },
    alignment: { horizontal: "center" },
  },
};

const configurarEncabezado = (worksheet, { titulo, filtros, rango }) => {
  worksheet.mergeCells(`A1:${rango}1`);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = titulo;
  titleCell.style = estilosExcel.titleStyle;
  worksheet.getRow(1).height = 25;

  worksheet.mergeCells(`A2:${rango}2`);
  const infoCell = worksheet.getCell("A2");
  infoCell.value = `Generado: ${new Date().toLocaleString("es-AR")}`;
  infoCell.alignment = { horizontal: "center" };
  infoCell.font = { italic: true, size: 10 };

  let filtrosTexto = "Filtros: ";
  if (filtros.fechaDesde)
    filtrosTexto += `Desde ${formatearFecha(filtros.fechaDesde)} `;
  if (filtros.fechaHasta)
    filtrosTexto += `Hasta ${formatearFecha(filtros.fechaHasta)} `;
  if (filtros.estado && !["Todos", "todas"].includes(filtros.estado)) {
    filtrosTexto += `Estado: ${filtros.estado} `;
  }
  if (filtros.metodoPago && filtros.metodoPago !== "Todos") {
    filtrosTexto += `Pago: ${filtros.metodoPago}`;
  }

  worksheet.mergeCells(`A3:${rango}3`);
  const filtroCell = worksheet.getCell("A3");
  filtroCell.value = filtrosTexto;
  filtroCell.alignment = { horizontal: "center" };
  filtroCell.font = { size: 9, color: { argb: "FF666666" } };
};

const configurarResumenEjecutivo = (
  worksheet,
  estadisticas,
  filaInicio = 5,
) => {
  worksheet.getRow(filaInicio).values = ["RESUMEN EJECUTIVO"];
  worksheet.mergeCells(`A${filaInicio}:C${filaInicio}`);
  worksheet.getCell(`A${filaInicio}`).style = estilosExcel.subHeaderStyle;

  worksheet.getRow(filaInicio + 1).values = [
    "Total Ventas:",
    estadisticas.cantidadVentas,
    "",
    "Total Ingresos:",
    `$${estadisticas.totalIngresos.toFixed(2)}`,
    "",
    "Ticket Promedio:",
    `$${estadisticas.ticketPromedio.toFixed(2)}`,
  ];
  worksheet.getCell(`A${filaInicio + 1}`).font = { bold: true };
  worksheet.getCell(`D${filaInicio + 1}`).font = { bold: true };
  worksheet.getCell(`G${filaInicio + 1}`).font = { bold: true };
};

const aplicarHeaderFila = (row) => {
  row.eachCell((cell) => {
    cell.style = estilosExcel.headerStyle;
  });
};

const generarWorkbookVentasOnline = ({ ventas, estadisticas, filters }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Ventas Online");

  configurarEncabezado(worksheet, {
    titulo: "📦 REPORTE DE VENTAS ONLINE - PIXEL SALUD",
    filtros: filters,
    rango: "K",
  });

  configurarResumenEjecutivo(worksheet, estadisticas);

  worksheet.getRow(8).values = [
    "ID Venta",
    "Fecha",
    "Hora",
    "Cliente",
    "DNI",
    "Email",
    "Teléfono",
    "Método Pago",
    "Estado",
    "Total",
    "Productos",
  ];
  aplicarHeaderFila(worksheet.getRow(8));

  ventas.forEach((venta, index) => {
    const row = worksheet.getRow(9 + index);
    row.values = [
      venta.idVentaO,
      formatearFecha(venta.fechaPago),
      venta.horaPago || "",
      venta.cliente,
      venta.dni,
      venta.emailCliente || "",
      venta.telefono || "",
      venta.metodoPago,
      venta.estado,
      parseFloat(venta.totalPago),
      venta.productos,
    ];

    const estadoCell = row.getCell(9);
    if (venta.estado === "pendiente" || venta.estado === "Pendiente") {
      estadoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFF3CD" },
      };
    } else if (venta.estado === "retirado" || venta.estado === "Retirado") {
      estadoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD4EDDA" },
      };
    } else if (venta.estado === "cancelado" || venta.estado === "Cancelado") {
      estadoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF8D7DA" },
      };
    }

    row.getCell(10).numFmt = FORMATO_MONEDA;
  });

  worksheet.columns = [
    { key: "idVentaO", width: 10 },
    { key: "fecha", width: 12 },
    { key: "hora", width: 10 },
    { key: "cliente", width: 25 },
    { key: "dni", width: 12 },
    { key: "email", width: 25 },
    { key: "telefono", width: 15 },
    { key: "metodoPago", width: 15 },
    { key: "estado", width: 12 },
    { key: "total", width: 12 },
    { key: "productos", width: 50 },
  ];

  return workbook;
};

const generarWorkbookVentasEmpleados = ({
  ventas,
  ranking,
  estadisticas,
  filters,
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Ventas Empleados");

  configurarEncabezado(worksheet, {
    titulo: "🏪 REPORTE DE VENTAS EMPLEADOS - PIXEL SALUD",
    filtros: filters,
    rango: "I",
  });

  worksheet.getRow(5).values = ["RESUMEN EJECUTIVO"];
  worksheet.mergeCells("A5:C5");
  worksheet.getCell("A5").style = estilosExcel.subHeaderStyle;

  worksheet.getRow(6).values = [
    "Total Ventas:",
    estadisticas.cantidadVentas,
    "",
    "Total Ingresos:",
    `$${estadisticas.totalIngresos.toFixed(2)}`,
    "",
    "Ticket Promedio:",
    `$${estadisticas.ticketPromedio.toFixed(2)}`,
  ];
  worksheet.getCell("A6").font = { bold: true };
  worksheet.getCell("D6").font = { bold: true };
  worksheet.getCell("G6").font = { bold: true };

  worksheet.getRow(8).values = ["🏆 TOP 10 EMPLEADOS"];
  worksheet.mergeCells("A8:D8");
  worksheet.getCell("A8").style = estilosExcel.subHeaderStyle;

  worksheet.getRow(9).values = ["Empleado", "Cantidad Ventas", "Total Vendido"];
  worksheet.getRow(9).eachCell((cell, colNumber) => {
    if (colNumber <= 3) {
      cell.style = estilosExcel.headerStyle;
    }
  });

  ranking.forEach((emp, index) => {
    const row = worksheet.getRow(10 + index);
    row.values = [
      emp.empleado,
      emp.cantidadVentas,
      parseFloat(emp.totalVendido),
    ];
    row.getCell(3).numFmt = FORMATO_MONEDA;
  });

  const filaInicio = 10 + ranking.length + 2;
  worksheet.getRow(filaInicio).values = ["DETALLE DE VENTAS"];
  worksheet.mergeCells(`A${filaInicio}:I${filaInicio}`);
  worksheet.getCell(`A${filaInicio}`).style = estilosExcel.subHeaderStyle;

  worksheet.getRow(filaInicio + 1).values = [
    "ID Venta",
    "Fecha",
    "Hora",
    "Empleado",
    "DNI Empleado",
    "Método Pago",
    "Estado",
    "Total",
    "Productos",
  ];
  aplicarHeaderFila(worksheet.getRow(filaInicio + 1));

  ventas.forEach((venta, index) => {
    const row = worksheet.getRow(filaInicio + 2 + index);
    row.values = [
      venta.idVentaE,
      formatearFecha(venta.fechaPago),
      venta.horaPago || "",
      venta.empleado,
      venta.dniEmpleado,
      venta.metodoPago,
      venta.estado,
      parseFloat(venta.totalPago),
      venta.productos,
    ];

    const estadoCell = row.getCell(7);
    if (venta.estado === "completada") {
      estadoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD4EDDA" },
      };
    } else if (venta.estado === "anulada") {
      estadoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF8D7DA" },
      };
    }

    row.getCell(8).numFmt = FORMATO_MONEDA;
  });

  worksheet.columns = [
    { key: "idVentaE", width: 10 },
    { key: "fecha", width: 12 },
    { key: "hora", width: 10 },
    { key: "empleado", width: 25 },
    { key: "dniEmpleado", width: 15 },
    { key: "metodoPago", width: 15 },
    { key: "estado", width: 12 },
    { key: "total", width: 12 },
    { key: "productos", width: 50 },
  ];

  return workbook;
};

const generarWorkbookConsolidado = ({
  productosTop,
  estadisticasOnline,
  estadisticasEmpleados,
  totalGeneral,
  ventasGenerales,
  porcentajeOnline,
  porcentajeLocal,
  filters,
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Consolidado");

  configurarEncabezado(worksheet, {
    titulo: "📊 REPORTE CONSOLIDADO - PIXEL SALUD",
    filtros: filters,
    rango: "H",
  });

  worksheet.getRow(5).values = ["RESUMEN GENERAL"];
  worksheet.mergeCells("A5:D5");
  worksheet.getCell("A5").style = estilosExcel.subHeaderStyle;

  worksheet.getRow(6).values = [
    "Total Ventas:",
    ventasGenerales,
    "",
    "Total Ingresos:",
    `$${totalGeneral.toFixed(2)}`,
  ];
  worksheet.getCell("A6").font = { bold: true };
  worksheet.getCell("D6").font = { bold: true };

  worksheet.getRow(8).values = ["COMPARATIVA POR CANAL"];
  worksheet.mergeCells("A8:E8");
  worksheet.getCell("A8").style = estilosExcel.subHeaderStyle;

  worksheet.getRow(9).values = [
    "Canal",
    "Cantidad Ventas",
    "Total Ingresos",
    "% Participación",
    "Ticket Promedio",
  ];
  aplicarHeaderFila(worksheet.getRow(9));

  worksheet.getRow(10).values = [
    "Online",
    estadisticasOnline.cantidadVentas,
    parseFloat(estadisticasOnline.totalIngresos),
    `${porcentajeOnline}%`,
    parseFloat(estadisticasOnline.ticketPromedio),
  ];
  worksheet.getRow(10).getCell(3).numFmt = FORMATO_MONEDA;
  worksheet.getRow(10).getCell(5).numFmt = FORMATO_MONEDA;

  worksheet.getRow(11).values = [
    "Local",
    estadisticasEmpleados.cantidadVentas,
    parseFloat(estadisticasEmpleados.totalIngresos),
    `${porcentajeLocal}%`,
    parseFloat(estadisticasEmpleados.ticketPromedio),
  ];
  worksheet.getRow(11).getCell(3).numFmt = FORMATO_MONEDA;
  worksheet.getRow(11).getCell(5).numFmt = FORMATO_MONEDA;

  worksheet.getRow(13).values = ["TOP 20 PRODUCTOS MÁS VENDIDOS"];
  worksheet.mergeCells("A13:D13");
  worksheet.getCell("A13").style = estilosExcel.subHeaderStyle;

  worksheet.getRow(14).values = [
    "Producto",
    "Categoría",
    "Cantidad",
    "Ingresos",
  ];
  aplicarHeaderFila(worksheet.getRow(14));

  productosTop.forEach((prod, index) => {
    const row = worksheet.getRow(15 + index);
    row.values = [
      prod.nombreProducto,
      prod.categoria,
      parseInt(prod.cantidadVendida),
      parseFloat(prod.ingresoTotal),
    ];
    row.getCell(4).numFmt = FORMATO_MONEDA;
  });

  worksheet.columns = [
    { key: "col1", width: 35 },
    { key: "col2", width: 20 },
    { key: "col3", width: 15 },
    { key: "col4", width: 15 },
    { key: "col5", width: 15 },
  ];

  return workbook;
};

const generarWorkbookProductosVendidos = ({
  productosTop,
  categorias,
  totalUnidadesVendidas,
  ingresoTotalProductos,
  filters,
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Productos Vendidos");

  configurarEncabezado(worksheet, {
    titulo: "📦 REPORTE DE PRODUCTOS VENDIDOS - PIXEL SALUD",
    filtros: filters,
    rango: "G",
  });

  worksheet.getRow(5).values = ["RESUMEN"];
  worksheet.mergeCells("A5:C5");
  worksheet.getCell("A5").style = estilosExcel.subHeaderStyle;

  worksheet.getRow(6).values = [
    "Total Unidades:",
    totalUnidadesVendidas,
    "",
    "Ingresos Totales:",
    `$${ingresoTotalProductos.toFixed(2)}`,
  ];
  worksheet.getCell("A6").font = { bold: true };
  worksheet.getCell("D6").font = { bold: true };

  worksheet.getRow(8).values = ["VENTAS POR CATEGORÍA"];
  worksheet.mergeCells("A8:C8");
  worksheet.getCell("A8").style = estilosExcel.subHeaderStyle;

  worksheet.getRow(9).values = ["Categoría", "Cantidad", "Ingresos"];
  aplicarHeaderFila(worksheet.getRow(9));

  categorias.forEach((cat, index) => {
    const row = worksheet.getRow(10 + index);
    row.values = [
      cat.categoria,
      parseInt(cat.cantidadVendida),
      parseFloat(cat.ingresoTotal),
    ];
    row.getCell(3).numFmt = FORMATO_MONEDA;
  });

  const filaInicio = 10 + categorias.length + 2;
  worksheet.getRow(filaInicio).values = ["TOP PRODUCTOS"];
  worksheet.mergeCells(`A${filaInicio}:D${filaInicio}`);
  worksheet.getCell(`A${filaInicio}`).style = estilosExcel.subHeaderStyle;

  worksheet.getRow(filaInicio + 1).values = [
    "Producto",
    "Categoría",
    "Cantidad",
    "Ingresos",
  ];
  aplicarHeaderFila(worksheet.getRow(filaInicio + 1));

  productosTop.forEach((prod, index) => {
    const row = worksheet.getRow(filaInicio + 2 + index);
    row.values = [
      prod.nombreProducto,
      prod.categoria,
      parseInt(prod.cantidadVendida),
      parseFloat(prod.ingresoTotal),
    ];
    row.getCell(4).numFmt = FORMATO_MONEDA;
  });

  worksheet.columns = [
    { key: "col1", width: 35 },
    { key: "col2", width: 20 },
    { key: "col3", width: 15 },
    { key: "col4", width: 15 },
  ];

  return workbook;
};

const responderArchivoExcel = async (res, workbook, nombreArchivoBase) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${nombreArchivoBase}_${Date.now()}.xlsx`,
  );

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = {
  generarWorkbookVentasOnline,
  generarWorkbookVentasEmpleados,
  generarWorkbookConsolidado,
  generarWorkbookProductosVendidos,
  responderArchivoExcel,
};
