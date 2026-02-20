const { pool } = require("../config/database");

const create = async (cuponData) => {
  const {
    codigo,
    tipoCupon,
    valorDescuento,
    descripcion,
    fechaInicio,
    fechaVencimiento,
    usoMaximo = 1,
    tipoUsuario = "todos",
    montoMinimo = 0,
    creadoPor = null,
  } = cuponData;

  const query = `
    INSERT INTO Cupones (
      codigo, tipoCupon, valorDescuento, descripcion,
      fechaInicio, fechaVencimiento, usoMaximo, tipoUsuario,
      montoMinimo, creadoPor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    codigo,
    tipoCupon,
    valorDescuento,
    descripcion,
    fechaInicio,
    fechaVencimiento,
    usoMaximo,
    tipoUsuario,
    montoMinimo,
    creadoPor,
  ]);

  return result.insertId;
};

const findByCodigo = async (codigo) => {
  const query = `
    SELECT * FROM Cupones
    WHERE codigo = ?
  `;

  const [rows] = await pool.query(query, [codigo]);
  return rows[0] || null;
};

const findById = async (idCupon) => {
  const query = `SELECT * FROM Cupones WHERE idCupon = ?`;
  const [rows] = await pool.query(query, [idCupon]);
  return rows[0] || null;
};

const findAllActivos = async () => {
  const query = `
    SELECT * FROM CuponesActivos
    ORDER BY fechaCreacion DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
};

const findAll = async () => {
  const query = `
    SELECT 
      *,
      (usoMaximo - vecesUsado) AS usosDisponibles,
      CASE 
        WHEN CURDATE() > fechaVencimiento THEN 'expirado'
        WHEN vecesUsado >= usoMaximo THEN 'agotado'
        ELSE estado
      END AS estadoCalculado
    FROM Cupones
    ORDER BY fechaCreacion DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
};

const validarCupon = async (codigo, idCliente, montoCompra) => {
  const cupon = await findByCodigo(codigo);

  if (!cupon) {
    return { valido: false, mensaje: "Cupón no encontrado", cupon: null };
  }

  if (cupon.estado !== "activo") {
    return { valido: false, mensaje: "Cupón inactivo", cupon: null };
  }

  const hoy = new Date();
  const fechaInicio = new Date(cupon.fechaInicio);
  const fechaVencimiento = new Date(cupon.fechaVencimiento);

  if (hoy < fechaInicio) {
    return {
      valido: false,
      mensaje: "Cupón aún no disponible",
      cupon: null,
    };
  }

  if (hoy > fechaVencimiento) {
    return { valido: false, mensaje: "Cupón vencido", cupon: null };
  }

  if (cupon.vecesUsado >= cupon.usoMaximo) {
    return { valido: false, mensaje: "Cupón agotado", cupon: null };
  }

  if (montoCompra < cupon.montoMinimo) {
    return {
      valido: false,
      mensaje: `Monto mínimo de compra: $${cupon.montoMinimo}`,
      cupon: null,
    };
  }

  if (cupon.tipoUsuario === "nuevo") {
    const esPrimeraCompra = await verificarPrimeraCompra(idCliente);
    if (!esPrimeraCompra) {
      return {
        valido: false,
        mensaje: "Cupón solo para nuevos usuarios",
        cupon: null,
      };
    }
  }

  const yaUso = await verificarUsoCliente(cupon.idCupon, idCliente);
  if (yaUso) {
    return { valido: false, mensaje: "Ya usaste este cupón", cupon: null };
  }

  return { valido: true, mensaje: "Cupón válido", cupon };
};

const verificarPrimeraCompra = async (idCliente) => {
  const query = `
    SELECT COUNT(*) AS totalCompras
    FROM VentasOnlines
    WHERE idCliente = ? AND estado IN ('retirado', 'entregado')
  `;

  const [rows] = await pool.query(query, [idCliente]);
  return rows[0].totalCompras === 0;
};

const verificarUsoCliente = async (idCupon, idCliente) => {
  const query = `
    SELECT COUNT(*) AS veces
    FROM CuponesUsados
    WHERE idCupon = ? AND idCliente = ?
  `;

  const [rows] = await pool.query(query, [idCupon, idCliente]);
  return rows[0].veces > 0;
};

const incrementarUso = async (idCupon) => {
  const query = `
    UPDATE Cupones
    SET vecesUsado = vecesUsado + 1
    WHERE idCupon = ?
  `;

  const [result] = await pool.query(query, [idCupon]);
  return result.affectedRows > 0;
};

const registrarUso = async (usoData) => {
  const {
    idCupon,
    idCliente,
    idVentaO,
    montoDescuento,
    montoOriginal,
    montoFinal,
  } = usoData;

  const query = `
    INSERT INTO CuponesUsados (
      idCupon, idCliente, idVentaO, montoDescuento, montoOriginal, montoFinal
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    idCupon,
    idCliente,
    idVentaO,
    montoDescuento,
    montoOriginal,
    montoFinal,
  ]);

  return result.insertId;
};

const obtenerHistorialCliente = async (idCliente) => {
  const query = `
    SELECT * FROM CuponesUsadosDetalle
    WHERE idCliente = ?
    ORDER BY fechaUso DESC
  `;

  const [rows] = await pool.query(query, [idCliente]);
  return rows;
};

const obtenerTodoHistorial = async () => {
  const query = `
    SELECT * FROM CuponesUsadosDetalle
    ORDER BY fechaUso DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
};

const updateEstado = async (idCupon, estado) => {
  const query = `UPDATE Cupones SET estado = ? WHERE idCupon = ?`;
  const [result] = await pool.query(query, [estado, idCupon]);
  return result.affectedRows > 0;
};

const deleteCupon = async (idCupon) => {
  // Verificar que no haya sido usado
  const query = `
    DELETE FROM Cupones
    WHERE idCupon = ? AND vecesUsado = 0
  `;

  const [result] = await pool.query(query, [idCupon]);
  return result.affectedRows > 0;
};

const aplicarCuponTx = async (connection, data) => {
  const {
    idCupon,
    idCliente,
    idVentaO,
    montoDescuento,
    montoOriginal,
    montoFinal,
  } = data;

  await connection.query(
    `INSERT INTO CuponesUsados (
      idCupon, idCliente, idVentaO, montoDescuento, montoOriginal, montoFinal
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [idCupon, idCliente, idVentaO, montoDescuento, montoOriginal, montoFinal],
  );

  await connection.query(
    `UPDATE Cupones SET vecesUsado = vecesUsado + 1 WHERE idCupon = ?`,
    [idCupon],
  );
};

module.exports = {
  create,
  findByCodigo,
  findById,
  findAllActivos,
  findAll,
  validarCupon,
  verificarPrimeraCompra,
  verificarUsoCliente,
  incrementarUso,
  registrarUso,
  obtenerHistorialCliente,
  obtenerTodoHistorial,
  updateEstado,
  deleteCupon,
  aplicarCuponTx,
};
