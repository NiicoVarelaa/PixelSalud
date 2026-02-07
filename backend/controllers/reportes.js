const ExcelJS = require("exceljs");
const { conection } = require("../config/database");

// Función auxiliar para consultas async/await
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    conection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Función para formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const año = date.getFullYear();
  return `${dia}/${mes}/${año}`;
};

// Estilos comunes para Excel
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
  totalStyle: {
    font: { bold: true, size: 11 },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } },
    alignment: { horizontal: "right" },
  },
};

// ==========================================
// 1. REPORTE DE VENTAS ONLINE (Sin Cambios)
// ==========================================
const reporteVentasOnline = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, estado, metodoPago } = req.query;

    let sql = `
            SELECT 
                v.idVentaO,
                v.fechaPago,
                v.horaPago,
                CONCAT(c.nombreCliente, ' ', c.apellidoCliente) as cliente,
                c.dni,
                c.emailCliente,
                c.telefono,
                v.metodoPago,
                v.estado,
                v.totalPago,
                GROUP_CONCAT(
                    CONCAT(p.nombreProducto, ' (x', d.cantidad, ')') 
                    SEPARATOR ', '
                ) as productos
            FROM VentasOnlines v
            JOIN Clientes c ON v.idCliente = c.idCliente
            JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
            JOIN Productos p ON d.idProducto = p.idProducto
            WHERE 1=1
        `;

    const params = [];

    if (fechaDesde) {
      sql += " AND v.fechaPago >= ?";
      params.push(fechaDesde);
    }
    if (fechaHasta) {
      sql += " AND v.fechaPago <= ?";
      params.push(fechaHasta);
    }
    if (estado && estado !== "Todos") {
      sql += " AND v.estado = ?";
      params.push(estado);
    }
    if (metodoPago && metodoPago !== "Todos") {
      sql += " AND v.metodoPago = ?";
      params.push(metodoPago);
    }

    sql += " GROUP BY v.idVentaO ORDER BY v.fechaPago DESC, v.horaPago DESC";

    const ventas = await query(sql, params);

    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Ventas Online");

    // Título
    worksheet.mergeCells("A1:K1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "📦 REPORTE DE VENTAS ONLINE - PIXEL SALUD";
    titleCell.style = estilosExcel.titleStyle;
    worksheet.getRow(1).height = 25;

    // Información del reporte
    worksheet.mergeCells("A2:K2");
    const infoCell = worksheet.getCell("A2");
    infoCell.value = `Generado: ${new Date().toLocaleString("es-AR")}`;
    infoCell.alignment = { horizontal: "center" };
    infoCell.font = { italic: true, size: 10 };

    // Filtros aplicados
    let filtrosTexto = "Filtros: ";
    if (fechaDesde) filtrosTexto += `Desde ${formatearFecha(fechaDesde)} `;
    if (fechaHasta) filtrosTexto += `Hasta ${formatearFecha(fechaHasta)} `;
    if (estado && estado !== "Todos") filtrosTexto += `Estado: ${estado} `;
    if (metodoPago && metodoPago !== "Todos")
      filtrosTexto += `Pago: ${metodoPago}`;

    worksheet.mergeCells("A3:K3");
    const filtroCell = worksheet.getCell("A3");
    filtroCell.value = filtrosTexto;
    filtroCell.alignment = { horizontal: "center" };
    filtroCell.font = { size: 9, color: { argb: "FF666666" } };

    // Estadísticas
    const totalIngresos = ventas.reduce(
      (sum, v) => sum + parseFloat(v.totalPago || 0),
      0,
    );
    const cantidadVentas = ventas.length;
    const ticketPromedio =
      cantidadVentas > 0 ? totalIngresos / cantidadVentas : 0;

    worksheet.getRow(5).values = ["RESUMEN EJECUTIVO"];
    worksheet.mergeCells("A5:C5");
    worksheet.getCell("A5").style = estilosExcel.subHeaderStyle;

    worksheet.getRow(6).values = [
      "Total Ventas:",
      cantidadVentas,
      "",
      "Total Ingresos:",
      `$${totalIngresos.toFixed(2)}`,
      "",
      "Ticket Promedio:",
      `$${ticketPromedio.toFixed(2)}`,
    ];
    worksheet.getCell("A6").font = { bold: true };
    worksheet.getCell("D6").font = { bold: true };
    worksheet.getCell("G6").font = { bold: true };

    // Cabecera de tabla
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

    worksheet.getRow(8).eachCell((cell) => {
      cell.style = estilosExcel.headerStyle;
    });

    // Datos
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

      // Formato condicional por estado
      const estadoCell = row.getCell(9);
      if (venta.estado === "pendiente") {
        estadoCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFF3CD" },
        };
      } else if (venta.estado === "retirado") {
        estadoCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD4EDDA" },
        };
      } else if (venta.estado === "cancelado") {
        estadoCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8D7DA" },
        };
      }

      // Formato de moneda
      row.getCell(10).numFmt = '"$"#,##0.00';
    });

    // Ajustar anchos de columna
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

    // Enviar archivo
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=VentasOnline_${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generando reporte ventas online:", error);
    res
      .status(500)
      .json({ error: "Error al generar reporte", details: error.message });
  }
};

// ==========================================
// 2. REPORTE DE VENTAS EMPLEADOS (CORREGIDO PARA ADMIN)
// ==========================================
const reporteVentasEmpleados = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, estado, metodoPago, idEmpleado } =
      req.query;

    // --- CAMBIO: Usamos LEFT JOIN y COALESCE para traer nombre de Empleado O Admin ---
    let sql = `
            SELECT 
                v.idVentaE,
                v.fechaPago,
                v.horaPago,
                COALESCE(CONCAT(e.nombreEmpleado, ' ', e.apellidoEmpleado), a.nombreAdmin) as empleado,
                COALESCE(e.dniEmpleado, a.dniAdmin) as dniEmpleado,
                v.metodoPago,
                v.estado,
                v.totalPago,
                GROUP_CONCAT(
                    CONCAT(p.nombreProducto, ' (x', d.cantidad, ')') 
                    SEPARATOR ', '
                ) as productos
            FROM VentasEmpleados v
            LEFT JOIN Empleados e ON v.idEmpleado = e.idEmpleado
            LEFT JOIN Admins a ON v.idAdmin = a.idAdmin
            JOIN DetalleVentaEmpleado d ON v.idVentaE = d.idVentaE
            JOIN Productos p ON d.idProducto = p.idProducto
            WHERE 1=1
        `;

    const params = [];

    if (fechaDesde) {
      sql += " AND v.fechaPago >= ?";
      params.push(fechaDesde);
    }
    if (fechaHasta) {
      sql += " AND v.fechaPago <= ?";
      params.push(fechaHasta);
    }
    if (estado && estado !== "todas") {
      sql += " AND v.estado = ?";
      params.push(estado);
    }
    if (metodoPago && metodoPago !== "Todos") {
      sql += " AND v.metodoPago = ?";
      params.push(metodoPago);
    }
    // Si se filtra por idEmpleado, mantenemos esa lógica
    if (idEmpleado) {
      sql += " AND v.idEmpleado = ?";
      params.push(idEmpleado);
    }

    sql += " GROUP BY v.idVentaE ORDER BY v.fechaPago DESC, v.horaPago DESC";

    const ventas = await query(sql, params);

    // Ranking de empleados (MANTENEMOS SOLO EMPLEADOS)
    // Usualmente no queremos que el Admin compita en el ranking de vendedores
    const sqlRanking = `
            SELECT 
                CONCAT(e.nombreEmpleado, ' ', e.apellidoEmpleado) as empleado,
                COUNT(v.idVentaE) as cantidadVentas,
                SUM(v.totalPago) as totalVendido
            FROM VentasEmpleados v
            JOIN Empleados e ON v.idEmpleado = e.idEmpleado
            WHERE v.estado = 'completada'
            ${fechaDesde ? "AND v.fechaPago >= ?" : ""}
            ${fechaHasta ? "AND v.fechaPago <= ?" : ""}
            GROUP BY v.idEmpleado
            ORDER BY totalVendido DESC
            LIMIT 10
        `;

    const rankingParams = [];
    if (fechaDesde) rankingParams.push(fechaDesde);
    if (fechaHasta) rankingParams.push(fechaHasta);

    const ranking = await query(sqlRanking, rankingParams);

    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Ventas Empleados");

    // Título
    worksheet.mergeCells("A1:I1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "🏪 REPORTE DE VENTAS EMPLEADOS - PIXEL SALUD";
    titleCell.style = estilosExcel.titleStyle;
    worksheet.getRow(1).height = 25;

    // Información del reporte
    worksheet.mergeCells("A2:I2");
    const infoCell = worksheet.getCell("A2");
    infoCell.value = `Generado: ${new Date().toLocaleString("es-AR")}`;
    infoCell.alignment = { horizontal: "center" };
    infoCell.font = { italic: true, size: 10 };

    // Filtros
    let filtrosTexto = "Filtros: ";
    if (fechaDesde) filtrosTexto += `Desde ${formatearFecha(fechaDesde)} `;
    if (fechaHasta) filtrosTexto += `Hasta ${formatearFecha(fechaHasta)} `;
    if (estado && estado !== "todas") filtrosTexto += `Estado: ${estado} `;
    if (metodoPago && metodoPago !== "Todos")
      filtrosTexto += `Pago: ${metodoPago}`;

    worksheet.mergeCells("A3:I3");
    const filtroCell = worksheet.getCell("A3");
    filtroCell.value = filtrosTexto;
    filtroCell.alignment = { horizontal: "center" };
    filtroCell.font = { size: 9, color: { argb: "FF666666" } };

    // Estadísticas
    const totalIngresos = ventas.reduce(
      (sum, v) => sum + parseFloat(v.totalPago || 0),
      0,
    );
    const cantidadVentas = ventas.length;
    const ticketPromedio =
      cantidadVentas > 0 ? totalIngresos / cantidadVentas : 0;

    worksheet.getRow(5).values = ["RESUMEN EJECUTIVO"];
    worksheet.mergeCells("A5:C5");
    worksheet.getCell("A5").style = estilosExcel.subHeaderStyle;

    worksheet.getRow(6).values = [
      "Total Ventas:",
      cantidadVentas,
      "",
      "Total Ingresos:",
      `$${totalIngresos.toFixed(2)}`,
      "",
      "Ticket Promedio:",
      `$${ticketPromedio.toFixed(2)}`,
    ];
    worksheet.getCell("A6").font = { bold: true };
    worksheet.getCell("D6").font = { bold: true };
    worksheet.getCell("G6").font = { bold: true };

    // Ranking de empleados
    worksheet.getRow(8).values = ["🏆 TOP 10 EMPLEADOS"];
    worksheet.mergeCells("A8:C8");
    worksheet.getCell("A8").style = estilosExcel.subHeaderStyle;

    worksheet.getRow(9).values = ["Empleado", "Cant. Ventas", "Total Vendido"];
    worksheet.getRow(9).eachCell((cell, colNumber) => {
      if (colNumber <= 3) cell.style = estilosExcel.headerStyle;
    });

    ranking.forEach((emp, index) => {
      const row = worksheet.getRow(10 + index);
      row.values = [
        emp.empleado,
        emp.cantidadVentas,
        parseFloat(emp.totalVendido),
      ];
      row.getCell(3).numFmt = '"$"#,##0.00';

      // Medalla para top 3
      if (index === 0) row.getCell(1).value = `🥇 ${emp.empleado}`;
      else if (index === 1) row.getCell(1).value = `🥈 ${emp.empleado}`;
      else if (index === 2) row.getCell(1).value = `🥉 ${emp.empleado}`;
    });

    // Tabla de ventas
    const startRow = 10 + ranking.length + 2;
    worksheet.getRow(startRow).values = ["DETALLE DE VENTAS"];
    worksheet.mergeCells(`A${startRow}:I${startRow}`);
    worksheet.getCell(`A${startRow}`).style = estilosExcel.subHeaderStyle;

    worksheet.getRow(startRow + 1).values = [
      "ID Venta",
      "Fecha",
      "Hora",
      "Vendedor", // Cambiamos etiqueta "Empleado" por "Vendedor"
      "DNI",
      "Método Pago",
      "Estado",
      "Total",
      "Productos",
    ];

    worksheet.getRow(startRow + 1).eachCell((cell) => {
      cell.style = estilosExcel.headerStyle;
    });

    // Datos
    ventas.forEach((venta, index) => {
      const row = worksheet.getRow(startRow + 2 + index);
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

      // Formato condicional
      const estadoCell = row.getCell(7);
      if (venta.estado === "completada") {
        estadoCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD4EDDA" },
        };
      } else if (venta.estado === "cancelada" || venta.estado === "anulada") {
        estadoCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8D7DA" },
        };
      }

      row.getCell(8).numFmt = '"$"#,##0.00';
    });

    // Ajustar anchos
    worksheet.columns = [
      { key: "idVentaE", width: 10 },
      { key: "fecha", width: 12 },
      { key: "hora", width: 10 },
      { key: "empleado", width: 25 },
      { key: "dni", width: 12 },
      { key: "metodoPago", width: 15 },
      { key: "estado", width: 12 },
      { key: "total", width: 12 },
      { key: "productos", width: 50 },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=VentasEmpleados_${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generando reporte ventas empleados:", error);
    res
      .status(500)
      .json({ error: "Error al generar reporte", details: error.message });
  }
};

// ==========================================
// 3. REPORTE CONSOLIDADO (CORREGIDO PARA ADMIN)
// ==========================================
const reporteConsolidado = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    // Ventas Online (Sin cambios)
    let sqlOnline = `
            SELECT 
                'Online' as canal,
                v.idVentaO as idVenta,
                v.fechaPago as fecha,
                CONCAT(c.nombreCliente, ' ', c.apellidoCliente) as cliente,
                v.metodoPago,
                v.estado,
                v.totalPago
            FROM VentasOnlines v
            JOIN Clientes c ON v.idCliente = c.idCliente
            WHERE 1=1
        `;

    const paramsOnline = [];
    if (fechaDesde) {
      sqlOnline += " AND v.fechaPago >= ?";
      paramsOnline.push(fechaDesde);
    }
    if (fechaHasta) {
      sqlOnline += " AND v.fechaPago <= ?";
      paramsOnline.push(fechaHasta);
    }

    // Ventas Empleados (CORREGIDO: LEFT JOIN con Admins y COALESCE)
    let sqlEmpleados = `
            SELECT 
                'Local' as canal,
                v.idVentaE as idVenta,
                v.fechaPago as fecha,
                COALESCE(CONCAT(e.nombreEmpleado, ' ', e.apellidoEmpleado), a.nombreAdmin) as vendedor,
                v.metodoPago,
                v.estado,
                v.totalPago
            FROM VentasEmpleados v
            LEFT JOIN Empleados e ON v.idEmpleado = e.idEmpleado
            LEFT JOIN Admins a ON v.idAdmin = a.idAdmin
            WHERE 1=1
        `;

    const paramsEmpleados = [];
    if (fechaDesde) {
      sqlEmpleados += " AND v.fechaPago >= ?";
      paramsEmpleados.push(fechaDesde);
    }
    if (fechaHasta) {
      sqlEmpleados += " AND v.fechaPago <= ?";
      paramsEmpleados.push(fechaHasta);
    }

    const [ventasOnline, ventasEmpleados] = await Promise.all([
      query(sqlOnline, paramsOnline),
      query(sqlEmpleados, paramsEmpleados),
    ]);

    // Productos más vendidos
    // NOTA: Aquí no necesitamos JOIN con Empleados/Admins, solo VentasEmpleados,
    // por lo que las ventas del Admin ya se cuentan correctamente en el stock.
    let sqlProductos = `
            SELECT 
                p.nombreProducto,
                p.categoria,
                SUM(d.cantidad) as cantidadVendida,
                SUM(d.cantidad * d.precioUnitario) as ingresoTotal
            FROM (
                SELECT idProducto, cantidad, precioUnitario FROM DetalleVentaOnline do
                JOIN VentasOnlines vo ON do.idVentaO = vo.idVentaO
                WHERE 1=1 ${fechaDesde ? "AND vo.fechaPago >= ?" : ""} ${fechaHasta ? "AND vo.fechaPago <= ?" : ""}
                UNION ALL
                SELECT idProducto, cantidad, precioUnitario FROM DetalleVentaEmpleado de
                JOIN VentasEmpleados ve ON de.idVentaE = ve.idVentaE
                WHERE ve.estado = 'completada' ${fechaDesde ? "AND ve.fechaPago >= ?" : ""} ${fechaHasta ? "AND ve.fechaPago <= ?" : ""}
            ) d
            JOIN Productos p ON d.idProducto = p.idProducto
            GROUP BY p.idProducto
            ORDER BY cantidadVendida DESC
            LIMIT 20
        `;

    const paramsProductos = [];
    if (fechaDesde) paramsProductos.push(fechaDesde, fechaDesde);
    if (fechaHasta) paramsProductos.push(fechaHasta, fechaHasta);

    const productosTop = await query(sqlProductos, paramsProductos);

    // Crear workbook
    const workbook = new ExcelJS.Workbook();

    // ===== HOJA 1: RESUMEN EJECUTIVO =====
    const wsResumen = workbook.addWorksheet("Resumen Ejecutivo");

    wsResumen.mergeCells("A1:F1");
    const titleCell = wsResumen.getCell("A1");
    titleCell.value = "📊 REPORTE CONSOLIDADO - PIXEL SALUD";
    titleCell.style = estilosExcel.titleStyle;
    wsResumen.getRow(1).height = 30;

    wsResumen.mergeCells("A2:F2");
    wsResumen.getCell("A2").value =
      `Generado: ${new Date().toLocaleString("es-AR")}`;
    wsResumen.getCell("A2").alignment = { horizontal: "center" };
    wsResumen.getCell("A2").font = { italic: true };

    // Estadísticas por canal
    const totalOnline = ventasOnline.reduce(
      (sum, v) => sum + parseFloat(v.totalPago || 0),
      0,
    );
    const totalLocal = ventasEmpleados.reduce(
      (sum, v) => sum + parseFloat(v.totalPago || 0),
      0,
    );
    const totalGeneral = totalOnline + totalLocal;

    wsResumen.getRow(4).values = ["COMPARATIVA POR CANAL"];
    wsResumen.mergeCells("A4:F4");
    wsResumen.getCell("A4").style = estilosExcel.subHeaderStyle;

    wsResumen.getRow(6).values = [
      "Canal",
      "Cantidad Ventas",
      "Total Ingresos",
      "% del Total",
      "Ticket Promedio",
    ];
    wsResumen.getRow(6).eachCell((cell) => {
      cell.style = estilosExcel.headerStyle;
    });

    const porcentajeOnline =
      totalGeneral > 0 ? (totalOnline / totalGeneral) * 100 : 0;
    const porcentajeLocal =
      totalGeneral > 0 ? (totalLocal / totalGeneral) * 100 : 0;

    wsResumen.getRow(7).values = [
      "🌐 Ventas Online",
      ventasOnline.length,
      totalOnline,
      `${porcentajeOnline.toFixed(2)}%`,
      ventasOnline.length > 0 ? totalOnline / ventasOnline.length : 0,
    ];
    wsResumen.getRow(7).getCell(3).numFmt = '"$"#,##0.00';
    wsResumen.getRow(7).getCell(5).numFmt = '"$"#,##0.00';

    wsResumen.getRow(8).values = [
      "🏪 Ventas Local",
      ventasEmpleados.length,
      totalLocal,
      `${porcentajeLocal.toFixed(2)}%`,
      ventasEmpleados.length > 0 ? totalLocal / ventasEmpleados.length : 0,
    ];
    wsResumen.getRow(8).getCell(3).numFmt = '"$"#,##0.00';
    wsResumen.getRow(8).getCell(5).numFmt = '"$"#,##0.00';

    wsResumen.getRow(9).values = [
      "📈 TOTAL",
      ventasOnline.length + ventasEmpleados.length,
      totalGeneral,
      "100%",
      ventasOnline.length + ventasEmpleados.length > 0
        ? totalGeneral / (ventasOnline.length + ventasEmpleados.length)
        : 0,
    ];
    wsResumen.getRow(9).eachCell((cell, colNumber) => {
      if (colNumber !== 1) cell.style = estilosExcel.totalStyle;
    });
    wsResumen.getRow(9).getCell(3).numFmt = '"$"#,##0.00';
    wsResumen.getRow(9).getCell(5).numFmt = '"$"#,##0.00';

    // Top Productos
    wsResumen.getRow(11).values = ["🏆 TOP 20 PRODUCTOS MÁS VENDIDOS"];
    wsResumen.mergeCells("A11:F11");
    wsResumen.getCell("A11").style = estilosExcel.subHeaderStyle;

    wsResumen.getRow(12).values = [
      "#",
      "Producto",
      "Categoría",
      "Unidades Vendidas",
      "Ingresos",
    ];
    wsResumen.getRow(12).eachCell((cell) => {
      cell.style = estilosExcel.headerStyle;
    });

    productosTop.forEach((prod, index) => {
      const row = wsResumen.getRow(13 + index);
      row.values = [
        index + 1,
        prod.nombreProducto,
        prod.categoria,
        prod.cantidadVendida,
        parseFloat(prod.ingresoTotal),
      ];
      row.getCell(5).numFmt = '"$"#,##0.00';

      // Medallas para top 3
      if (index === 0) row.getCell(1).value = "🥇";
      else if (index === 1) row.getCell(1).value = "🥈";
      else if (index === 2) row.getCell(1).value = "🥉";
    });

    wsResumen.columns = [
      { width: 20 },
      { width: 35 },
      { width: 20 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
    ];

    // ===== HOJA 2: VENTAS ONLINE =====
    const wsOnline = workbook.addWorksheet("Ventas Online");
    wsOnline.getRow(1).values = [
      "ID",
      "Fecha",
      "Cliente",
      "Método Pago",
      "Estado",
      "Total",
    ];
    wsOnline.getRow(1).eachCell((cell) => {
      cell.style = estilosExcel.headerStyle;
    });

    ventasOnline.forEach((venta, index) => {
      const row = wsOnline.getRow(2 + index);
      row.values = [
        venta.idVenta,
        formatearFecha(venta.fecha),
        venta.cliente,
        venta.metodoPago,
        venta.estado,
        parseFloat(venta.totalPago),
      ];
      row.getCell(6).numFmt = '"$"#,##0.00';
    });

    wsOnline.columns = [
      { width: 10 },
      { width: 12 },
      { width: 30 },
      { width: 15 },
      { width: 12 },
      { width: 12 },
    ];

    // ===== HOJA 3: VENTAS LOCAL =====
    const wsLocal = workbook.addWorksheet("Ventas Local");
    wsLocal.getRow(1).values = [
      "ID",
      "Fecha",
      "Vendedor",
      "Método Pago",
      "Estado",
      "Total",
    ];
    wsLocal.getRow(1).eachCell((cell) => {
      cell.style = estilosExcel.headerStyle;
    });

    ventasEmpleados.forEach((venta, index) => {
      const row = wsLocal.getRow(2 + index);
      row.values = [
        venta.idVenta,
        formatearFecha(venta.fecha),
        venta.vendedor,
        venta.metodoPago,
        venta.estado,
        parseFloat(venta.totalPago),
      ];
      row.getCell(6).numFmt = '"$"#,##0.00';
    });

    wsLocal.columns = [
      { width: 10 },
      { width: 12 },
      { width: 30 },
      { width: 15 },
      { width: 12 },
      { width: 12 },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ReporteConsolidado_${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generando reporte consolidado:", error);
    res
      .status(500)
      .json({ error: "Error al generar reporte", details: error.message });
  }
};

// ==========================================
// 4. REPORTE DE PRODUCTOS VENDIDOS (SIN CAMBIOS NECESARIOS)
// ==========================================
// Explicación: Este reporte usa JOIN con VentasEmpleados directamente para contar stock,
// no filtra por empleado, así que las ventas del Admin ya se cuentan bien.
const reporteProductosVendidos = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, categoria } = req.query;

    let sqlProductos = `
            SELECT 
                p.idProducto,
                p.nombreProducto,
                p.categoria,
                p.precio,
                p.stock,
                COALESCE(SUM(ventas.cantidad), 0) as cantidadVendida,
                COALESCE(SUM(ventas.cantidad * ventas.precioUnitario), 0) as ingresoTotal,
                COALESCE(SUM(CASE WHEN ventas.canal = 'online' THEN ventas.cantidad ELSE 0 END), 0) as ventasOnline,
                COALESCE(SUM(CASE WHEN ventas.canal = 'local' THEN ventas.cantidad ELSE 0 END), 0) as ventasLocal
            FROM Productos p
            LEFT JOIN (
                SELECT 
                    'online' as canal,
                    d.idProducto,
                    d.cantidad,
                    d.precioUnitario,
                    v.fechaPago as fecha
                FROM DetalleVentaOnline d
                JOIN VentasOnlines v ON d.idVentaO = v.idVentaO
                WHERE v.estado != 'cancelado'
                ${fechaDesde ? "AND v.fechaPago >= ?" : ""}
                ${fechaHasta ? "AND v.fechaPago <= ?" : ""}
                
                UNION ALL
                
                SELECT 
                    'local' as canal,
                    d.idProducto,
                    d.cantidad,
                    d.precioUnitario,
                    v.fechaPago as fecha
                FROM DetalleVentaEmpleado d
                JOIN VentasEmpleados v ON d.idVentaE = v.idVentaE
                WHERE v.estado = 'completada'
                ${fechaDesde ? "AND v.fechaPago >= ?" : ""}
                ${fechaHasta ? "AND v.fechaPago <= ?" : ""}
            ) ventas ON p.idProducto = ventas.idProducto
            WHERE p.activo = TRUE
            ${categoria && categoria !== "Todas" ? "AND p.categoria = ?" : ""}
            GROUP BY p.idProducto
            ORDER BY cantidadVendida DESC
        `;

    const params = [];
    if (fechaDesde) params.push(fechaDesde, fechaDesde);
    if (fechaHasta) params.push(fechaHasta, fechaHasta);
    if (categoria && categoria !== "Todas") params.push(categoria);

    const productos = await query(sqlProductos, params);

    // Estadísticas por categoría
    const sqlCategorias = `
            SELECT 
                p.categoria,
                COUNT(DISTINCT p.idProducto) as cantidadProductos,
                COALESCE(SUM(ventas.cantidad), 0) as unidadesVendidas,
                COALESCE(SUM(ventas.cantidad * ventas.precioUnitario), 0) as ingresoTotal
            FROM Productos p
            LEFT JOIN (
                SELECT d.idProducto, d.cantidad, d.precioUnitario
                FROM DetalleVentaOnline d
                JOIN VentasOnlines v ON d.idVentaO = v.idVentaO
                WHERE v.estado != 'cancelado'
                ${fechaDesde ? "AND v.fechaPago >= ?" : ""}
                ${fechaHasta ? "AND v.fechaPago <= ?" : ""}
                
                UNION ALL
                
                SELECT d.idProducto, d.cantidad, d.precioUnitario
                FROM DetalleVentaEmpleado d
                JOIN VentasEmpleados v ON d.idVentaE = v.idVentaE
                WHERE v.estado = 'completada'
                ${fechaDesde ? "AND v.fechaPago >= ?" : ""}
                ${fechaHasta ? "AND v.fechaPago <= ?" : ""}
            ) ventas ON p.idProducto = ventas.idProducto
            WHERE p.activo = TRUE
            GROUP BY p.categoria
            ORDER BY ingresoTotal DESC
        `;

    const paramsCat = [];
    if (fechaDesde) paramsCat.push(fechaDesde, fechaDesde);
    if (fechaHasta) paramsCat.push(fechaHasta, fechaHasta);

    const categorias = await query(sqlCategorias, paramsCat);

    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Productos Vendidos");

    // Título
    worksheet.mergeCells("A1:J1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "💊 REPORTE DE PRODUCTOS VENDIDOS - PIXEL SALUD";
    titleCell.style = estilosExcel.titleStyle;
    worksheet.getRow(1).height = 25;

    worksheet.mergeCells("A2:J2");
    worksheet.getCell("A2").value =
      `Generado: ${new Date().toLocaleString("es-AR")}`;
    worksheet.getCell("A2").alignment = { horizontal: "center" };
    worksheet.getCell("A2").font = { italic: true, size: 10 };

    // Resumen por categorías
    worksheet.getRow(4).values = ["📦 RESUMEN POR CATEGORÍA"];
    worksheet.mergeCells("A4:E4");
    worksheet.getCell("A4").style = estilosExcel.subHeaderStyle;

    worksheet.getRow(5).values = [
      "Categoría",
      "Cant. Productos",
      "Unidades Vendidas",
      "Ingresos",
      "% del Total",
    ];
    worksheet.getRow(5).eachCell((cell, colNumber) => {
      if (colNumber <= 5) cell.style = estilosExcel.headerStyle;
    });

    const ingresoTotalGeneral = categorias.reduce(
      (sum, c) => sum + parseFloat(c.ingresoTotal || 0),
      0,
    );

    categorias.forEach((cat, index) => {
      const row = worksheet.getRow(6 + index);
      const porcentaje =
        ingresoTotalGeneral > 0
          ? (parseFloat(cat.ingresoTotal) / ingresoTotalGeneral) * 100
          : 0;
      row.values = [
        cat.categoria,
        cat.cantidadProductos,
        cat.unidadesVendidas,
        parseFloat(cat.ingresoTotal),
        `${porcentaje.toFixed(2)}%`,
      ];
      row.getCell(4).numFmt = '"$"#,##0.00';
    });

    // Detalle de productos
    const startRow = 6 + categorias.length + 2;
    worksheet.getRow(startRow).values = ["📋 DETALLE DE PRODUCTOS"];
    worksheet.mergeCells(`A${startRow}:I${startRow}`);
    worksheet.getCell(`A${startRow}`).style = estilosExcel.subHeaderStyle;

    worksheet.getRow(startRow + 1).values = [
      "ID",
      "Producto",
      "Categoría",
      "Precio Actual",
      "Stock Actual",
      "Unidades Vendidas",
      "Ventas Online",
      "Ventas Local",
      "Ingresos Totales",
    ];

    worksheet.getRow(startRow + 1).eachCell((cell) => {
      cell.style = estilosExcel.headerStyle;
    });

    productos.forEach((prod, index) => {
      const row = worksheet.getRow(startRow + 2 + index);
      row.values = [
        prod.idProducto,
        prod.nombreProducto,
        prod.categoria,
        parseFloat(prod.precio),
        prod.stock,
        prod.cantidadVendida,
        prod.ventasOnline,
        prod.ventasLocal,
        parseFloat(prod.ingresoTotal),
      ];

      row.getCell(4).numFmt = '"$"#,##0.00';
      row.getCell(9).numFmt = '"$"#,##0.00';

      // Alerta de stock bajo
      if (prod.stock < 10 && prod.cantidadVendida > 0) {
        row.getCell(5).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFE6E6" },
        };
        row.getCell(6).font = { color: { argb: "FFCC0000" }, bold: true };
      }
    });

    worksheet.columns = [
      { width: 8 },
      { width: 35 },
      { width: 15 },
      { width: 12 },
      { width: 12 },
      { width: 15 },
      { width: 12 },
      { width: 12 },
      { width: 15 },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ProductosVendidos_${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generando reporte productos:", error);
    res
      .status(500)
      .json({ error: "Error al generar reporte", details: error.message });
  }
};

module.exports = {
  reporteVentasOnline,
  reporteVentasEmpleados,
  reporteConsolidado,
  reporteProductosVendidos,
};