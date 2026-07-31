const { pool } = require("../config/database");

const obtenerClientesCumpleanerosElegibles = async (
  fechaReferencia = new Date(),
) => {
  const fecha = new Date(fechaReferencia);

  const query = `
    SELECT
      c.idCliente,
      c.nombreCliente,
      c.apellidoCliente,
      c.emailCliente,
      c.fechaNacimiento,
      compras.totalCompras
    FROM Clientes c
    INNER JOIN (
      SELECT idCliente, COUNT(*) AS totalCompras
      FROM VentasOnlines
      WHERE estado IN ('retirado', 'entregado')
      GROUP BY idCliente
    ) compras ON compras.idCliente = c.idCliente
    LEFT JOIN CuponesCumpleanosEnvios envios
      ON envios.idCliente = c.idCliente
      AND envios.anioCumple = YEAR(?)
      AND envios.estado = 'enviado'
    WHERE c.activo = TRUE
      AND c.emailCliente IS NOT NULL
      AND c.emailCliente != ''
      AND c.fechaNacimiento IS NOT NULL
      AND DATE_FORMAT(c.fechaNacimiento, '%m-%d') = DATE_FORMAT(?, '%m-%d')
      AND envios.idEnvio IS NULL
    ORDER BY c.idCliente ASC
  `;

  const [rows] = await pool.query(query, [fecha, fecha]);
  return rows;
};

const registrarEnvio = async ({
  idCliente,
  idCupon = null,
  anioCumple,
  estado,
  detalleError = null,
}) => {
  const query = `
    INSERT INTO CuponesCumpleanosEnvios
      (idCliente, idCupon, anioCumple, estado, detalleError)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    idCliente,
    idCupon,
    anioCumple,
    estado,
    detalleError,
  ]);

  return result.insertId;
};

module.exports = {
  obtenerClientesCumpleanerosElegibles,
  registrarEnvio,
};
