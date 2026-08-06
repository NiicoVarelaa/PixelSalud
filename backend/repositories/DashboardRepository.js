const { pool } = require("../config/database");

const fechaLocal = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const getVentasHoy = async () => {
  const hoy = fechaLocal();

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
  const fechaInicio = fechaLocal(hace7Dias);

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
  const fecha = fechaLocal(hace30Dias);

  const [resultado] = await pool.query(
    `SELECT COUNT(DISTINCT idCliente) as total
      FROM VentasOnlines
      WHERE estado = 'retirado' AND DATE(fechaPago) >= ?`,
    [fecha],
  );

  return parseInt(resultado[0].total);
};

const getTotalClientes = async () => {
  const [resultado] = await pool.query(
    `SELECT COUNT(*) as total
      FROM Clientes
      WHERE activo = TRUE`,
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
        COALESCE(imgPrincipal.urlImagen, p.img) as imagenPrincipal,
        COALESCE(o.vO, 0) + COALESCE(e.vE, 0) as totalVendido,
        COALESCE(o.iO, 0) + COALESCE(e.iE, 0) as ingresoTotal
      FROM Productos p
      LEFT JOIN (
        SELECT dvo.idProducto,
          SUM(dvo.cantidad) as vO,
          SUM(dvo.cantidad * dvo.precioUnitario) as iO
        FROM DetalleVentaOnline dvo
        INNER JOIN VentasOnlines vo ON dvo.idVentaO = vo.idVentaO AND vo.estado = 'retirado'
        GROUP BY dvo.idProducto
      ) o ON p.idProducto = o.idProducto
      LEFT JOIN (
        SELECT dve.idProducto,
          SUM(dve.cantidad) as vE,
          SUM(dve.cantidad * dve.precioUnitario) as iE
        FROM DetalleVentaEmpleado dve
        INNER JOIN VentasEmpleados ve ON dve.idVentaE = ve.idVentaE AND ve.estado = 'completada'
        GROUP BY dve.idProducto
      ) e ON p.idProducto = e.idProducto
      LEFT JOIN (
        SELECT idProducto, urlImagen
        FROM ImagenesProductos
        WHERE esPrincipal = TRUE
      ) as imgPrincipal ON p.idProducto = imgPrincipal.idProducto
      WHERE p.activo = TRUE
      GROUP BY p.idProducto, p.nombreProducto, p.img, p.precio, imgPrincipal.urlImagen, o.vO, o.iO, e.vE, e.iE
      HAVING totalVendido > 0
      ORDER BY totalVendido DESC
      LIMIT ?`,
    [limite],
  );

  return productos.map((producto) => ({
    idProducto: producto.idProducto,
    nombre: producto.nombreProducto,
    imagen: producto.imagenPrincipal,
    precio: parseFloat(producto.precio),
    cantidadVendida: parseInt(producto.totalVendido),
    ingresoTotal: parseFloat(producto.ingresoTotal),
  }));
};

const getVentasPorDia = async (dias = 7) => {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - dias);
  const fecha = fechaLocal(fechaInicio);

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
      ORDER BY dia ASC`,
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
    const totalClientes = await getTotalClientes();
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
      clientes: {
        total: totalClientes,
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
  getTotalClientes,
  getProductosMasVendidos,
  getVentasPorDia,
  getMetricasCompletas,
};
