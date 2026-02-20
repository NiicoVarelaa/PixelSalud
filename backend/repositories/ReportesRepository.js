const { pool } = require("../config/database");

const getVentasOnline = async ({
  fechaDesde,
  fechaHasta,
  estado,
  metodoPago,
}) => {
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

  const [rows] = await pool.query(sql, params);
  return rows;
};

const getVentasEmpleados = async ({
  fechaDesde,
  fechaHasta,
  estado,
  metodoPago,
  idEmpleado,
}) => {
  let sql = `
    SELECT 
      v.idVentaE,
      v.fechaPago,
      v.horaPago,
      CONCAT(e.nombreEmpleado, ' ', e.apellidoEmpleado) as empleado,
      e.dniEmpleado,
      v.metodoPago,
      v.estado,
      v.totalPago,
      GROUP_CONCAT(
        CONCAT(p.nombreProducto, ' (x', d.cantidad, ')') 
        SEPARATOR ', '
      ) as productos
    FROM VentasEmpleados v
    JOIN Empleados e ON v.idEmpleado = e.idEmpleado
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
  if (idEmpleado) {
    sql += " AND v.idEmpleado = ?";
    params.push(idEmpleado);
  }

  sql += " GROUP BY v.idVentaE ORDER BY v.fechaPago DESC, v.horaPago DESC";

  const [rows] = await pool.query(sql, params);
  return rows;
};

const getRankingEmpleados = async ({ fechaDesde, fechaHasta }) => {
  let sql = `
    SELECT 
      CONCAT(e.nombreEmpleado, ' ', e.apellidoEmpleado) as empleado,
      COUNT(v.idVentaE) as cantidadVentas,
      SUM(v.totalPago) as totalVendido
    FROM VentasEmpleados v
    JOIN Empleados e ON v.idEmpleado = e.idEmpleado
    WHERE v.estado = 'completada'
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

  sql += " GROUP BY v.idEmpleado ORDER BY totalVendido DESC LIMIT 10";

  const [rows] = await pool.query(sql, params);
  return rows;
};

const getProductosTop = async ({ fechaDesde, fechaHasta }) => {
  let sql = `
    SELECT 
      p.nombreProducto,
      p.categoria,
      SUM(d.cantidad) as cantidadVendida,
      SUM(d.cantidad * d.precioUnitario) as ingresoTotal
    FROM (
      SELECT idProducto, cantidad, precioUnitario FROM DetalleVentaOnline dvo
      JOIN VentasOnlines vo ON dvo.idVentaO = vo.idVentaO
      WHERE 1=1
  `;

  const params = [];

  if (fechaDesde) {
    sql += " AND vo.fechaPago >= ?";
    params.push(fechaDesde);
  }
  if (fechaHasta) {
    sql += " AND vo.fechaPago <= ?";
    params.push(fechaHasta);
  }

  sql += `
      UNION ALL
      SELECT idProducto, cantidad, precioUnitario FROM DetalleVentaEmpleado dve
      JOIN VentasEmpleados ve ON dve.idVentaE = ve.idVentaE
      WHERE ve.estado = 'completada'
  `;

  if (fechaDesde) {
    sql += " AND ve.fechaPago >= ?";
    params.push(fechaDesde);
  }
  if (fechaHasta) {
    sql += " AND ve.fechaPago <= ?";
    params.push(fechaHasta);
  }

  sql += `
    ) d
    JOIN Productos p ON d.idProducto = p.idProducto
    GROUP BY p.idProducto
    ORDER BY cantidadVendida DESC
    LIMIT 20
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
};

const getComparativaCanales = async ({ fechaDesde, fechaHasta }) => {
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

  let sqlEmpleados = `
    SELECT 
      'Local' as canal,
      v.idVentaE as idVenta,
      v.fechaPago as fecha,
      CONCAT(e.nombreEmpleado, ' ', e.apellidoEmpleado) as vendedor,
      v.metodoPago,
      v.estado,
      v.totalPago
    FROM VentasEmpleados v
    JOIN Empleados e ON v.idEmpleado = e.idEmpleado
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

  const [ventasOnline] = await pool.query(sqlOnline, paramsOnline);
  const [ventasEmpleados] = await pool.query(sqlEmpleados, paramsEmpleados);

  return {
    ventasOnline,
    ventasEmpleados,
  };
};

const getVentasConDetalles = async ({ fechaDesde, fechaHasta }) => {
  let sql = `
    SELECT 
      'Online' as tipoVenta,
      v.idVentaO as idVenta,
      v.fechaPago,
      CONCAT(c.nombreCliente, ' ', c.apellidoCliente) as cliente,
      p.nombreProducto,
      p.categoria,
      d.cantidad,
      d.precioUnitario,
      (d.cantidad * d.precioUnitario) as subtotal,
      v.metodoPago
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

  sql += `
    UNION ALL
    SELECT 
      'Local' as tipoVenta,
      v.idVentaE as idVenta,
      v.fechaPago,
      CONCAT(e.nombreEmpleado, ' ', e.apellidoEmpleado) as cliente,
      p.nombreProducto,
      p.categoria,
      d.cantidad,
      d.precioUnitario,
      (d.cantidad * d.precioUnitario) as subtotal,
      v.metodoPago
    FROM VentasEmpleados v
    JOIN Empleados e ON v.idEmpleado = e.idEmpleado
    JOIN DetalleVentaEmpleado d ON v.idVentaE = d.idVentaE
    JOIN Productos p ON d.idProducto = p.idProducto
    WHERE v.estado = 'completada'
  `;

  if (fechaDesde) {
    sql += " AND v.fechaPago >= ?";
    params.push(fechaDesde);
  }
  if (fechaHasta) {
    sql += " AND v.fechaPago <= ?";
    params.push(fechaHasta);
  }

  sql += " ORDER BY fechaPago DESC";

  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = {
  getVentasOnline,
  getVentasEmpleados,
  getRankingEmpleados,
  getProductosTop,
  getComparativaCanales,
  getVentasConDetalles,
};
