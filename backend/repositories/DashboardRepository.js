const { pool } = require("../config/database");

const getVentasHoy = async () => {
  const hoy = new Date().toISOString().split("T")[0];

  const [ventasOnline] = await pool.query(
    `SELECT 
        COALESCE(SUM(totalPago), 0) as total,
        COUNT(*) as cantidad
      FROM VentasOnlines
      WHERE DATE(fechaPago) = ? AND estado = 'retirado'`,
    [hoy],
  );

  const [ventasEmpleados] = await pool.query(
    `SELECT 
        COALESCE(SUM(totalPago), 0) as total,
        COUNT(*) as cantidad
      FROM VentasEmpleados
      WHERE DATE(fechaPago) = ? AND estado = 'completada'`,
    [hoy],
  );

  return {
    total:
      parseFloat(ventasOnline[0].total) + parseFloat(ventasEmpleados[0].total),
    transacciones:
      parseInt(ventasOnline[0].cantidad) +
      parseInt(ventasEmpleados[0].cantidad),
  };
};

const getVentasSemana = async () => {
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  const fechaInicio = hace7Dias.toISOString().split("T")[0];

  const [ventasOnline] = await pool.query(
    `SELECT COALESCE(SUM(totalPago), 0) as total
      FROM VentasOnlines
      WHERE DATE(fechaPago) >= ? AND estado = 'retirado'`,
    [fechaInicio],
  );

  const [ventasEmpleados] = await pool.query(
    `SELECT COALESCE(SUM(totalPago), 0) as total
      FROM VentasEmpleados
      WHERE DATE(fechaPago) >= ? AND estado = 'completada'`,
    [fechaInicio],
  );

  return {
    total:
      parseFloat(ventasOnline[0].total) + parseFloat(ventasEmpleados[0].total),
  };
};

const getEstadisticasProductos = async () => {
  const [resultado] = await pool.query(
    `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN activo = TRUE THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN stock > 0 AND stock <= 10 AND activo = TRUE THEN 1 ELSE 0 END) as stockBajo
      FROM Productos`,
  );

  return {
    total: parseInt(resultado[0].total),
    activos: parseInt(resultado[0].activos),
    stockBajo: parseInt(resultado[0].stockBajo),
  };
};

const getClientesActivos = async () => {
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);
  const fecha = hace30Dias.toISOString().split("T")[0];

  const [resultado] = await pool.query(
    `SELECT COUNT(DISTINCT idCliente) as total
      FROM VentasOnlines
      WHERE estado = 'retirado' AND DATE(fechaPago) >= ?`,
    [fecha],
  );

  return parseInt(resultado[0].total);
};

const getProductosMasVendidos = async (limite = 5) => {
  const [productos] = await pool.query(
    `SELECT 
        p.idProducto,
        p.nombreProducto,
        p.img,
        p.precio,
        COALESCE(SUM(dvo.cantidad), 0) + COALESCE(SUM(dve.cantidad), 0) as totalVendido,
        COALESCE(SUM(dvo.cantidad * dvo.precioUnitario), 0) + COALESCE(SUM(dve.cantidad * dve.precioUnitario), 0) as ingresoTotal
      FROM Productos p
      LEFT JOIN DetalleVentaOnline dvo ON p.idProducto = dvo.idProducto
      LEFT JOIN VentasOnlines vo ON dvo.idVentaO = vo.idVentaO AND vo.estado = 'retirado'
      LEFT JOIN DetalleVentaEmpleado dve ON p.idProducto = dve.idProducto
      LEFT JOIN VentasEmpleados ve ON dve.idVentaE = ve.idVentaE AND ve.estado = 'completada'
      WHERE p.activo = TRUE
      GROUP BY p.idProducto, p.nombreProducto, p.img, p.precio
      HAVING totalVendido > 0
      ORDER BY totalVendido DESC
      LIMIT ?`,
    [limite],
  );

  return productos.map((producto) => ({
    idProducto: producto.idProducto,
    nombre: producto.nombreProducto,
    imagen: producto.img,
    precio: parseFloat(producto.precio),
    cantidadVendida: parseInt(producto.totalVendido),
    ingresoTotal: parseFloat(producto.ingresoTotal),
  }));
};

const getVentasPorDia = async (dias = 7) => {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - dias);
  const fecha = fechaInicio.toISOString().split("T")[0];

  const [ventasDiarias] = await pool.query(
    `SELECT 
        DATE(fecha) as dia,
        COALESCE(SUM(total), 0) as totalVentas,
        COUNT(*) as transacciones
      FROM (
        SELECT fechaPago as fecha, totalPago as total
        FROM VentasOnlines
        WHERE DATE(fechaPago) >= ? AND estado = 'retirado'
        UNION ALL
        SELECT fechaPago as fecha, totalPago as total
        FROM VentasEmpleados
        WHERE DATE(fechaPago) >= ? AND estado = 'completada'
      ) AS ventas_consolidadas
      GROUP BY DATE(fecha)
      ORDER BY dia DESC`,
    [fecha, fecha],
  );

  return ventasDiarias.map((venta) => ({
    fecha: venta.dia,
    total: parseFloat(venta.totalVentas),
    transacciones: parseInt(venta.transacciones),
  }));
};

const getMetricasCompletas = async () => {
  try {
    const ventasHoy = await getVentasHoy();
    const ventasSemana = await getVentasSemana();
    const productos = await getEstadisticasProductos();
    const clientesActivos = await getClientesActivos();
    const productosMasVendidos = await getProductosMasVendidos(5);
    const ventasPorDia = await getVentasPorDia(7);

    return {
      ventasHoy: {
        total: ventasHoy.total,
        transacciones: ventasHoy.transacciones,
      },
      ventasSemana: {
        total: ventasSemana.total,
      },
      productos: {
        total: productos.total,
        activos: productos.activos,
        stockBajo: productos.stockBajo,
      },
      clientesActivos,
      productosMasVendidos,
      ventasPorDia,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getVentasHoy,
  getVentasSemana,
  getEstadisticasProductos,
  getClientesActivos,
  getProductosMasVendidos,
  getVentasPorDia,
  getMetricasCompletas,
};
