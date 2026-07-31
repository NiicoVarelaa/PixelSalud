const pool = require("../config/database");

const findAll = async () => {
  const sql = "SELECT * FROM Permisos ORDER BY idPermiso DESC";
  const [rows] = await pool.query(sql);
  return rows;
};

const findByEmpleadoId = async (idEmpleado) => {
  const sql = "SELECT * FROM Permisos WHERE idEmpleado = ? AND idAdmin IS NULL";
  const [rows] = await pool.query(sql, [idEmpleado]);
  return rows[0] || null;
};

const existsByEmpleadoId = async (idEmpleado) => {
  const sql =
    "SELECT COUNT(*) as count FROM Permisos WHERE idEmpleado = ? AND idAdmin IS NULL";
  const [rows] = await pool.query(sql, [idEmpleado]);
  return rows[0].count > 0;
};

const create = async (permisoData) => {
  const {
    idEmpleado,
    crear_productos,
    modificar_productos,
    modificar_ventasE,
    modificar_ventasO,
    ver_ventasTotalesE,
    ver_ventasTotalesO,
  } = permisoData;

  const sql = `
    INSERT INTO Permisos (
      crear_productos,
      modificar_productos,
      modificar_ventasE,
      modificar_ventasO,
      ver_ventasTotalesE,
      ver_ventasTotalesO,
      idEmpleado,
      idAdmin
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
  `;

  const [result] = await pool.query(sql, [
    crear_productos,
    modificar_productos,
    modificar_ventasE,
    modificar_ventasO,
    ver_ventasTotalesE,
    ver_ventasTotalesO,
    idEmpleado,
  ]);

  return result.insertId;
};

const update = async (idEmpleado, permisoData) => {
  const {
    crear_productos,
    modificar_productos,
    modificar_ventasE,
    modificar_ventasO,
    ver_ventasTotalesE,
    ver_ventasTotalesO,
  } = permisoData;

  const sql = `
    UPDATE Permisos
    SET crear_productos = ?,
        modificar_productos = ?,
        modificar_ventasE = ?,
        modificar_ventasO = ?,
        ver_ventasTotalesE = ?,
        ver_ventasTotalesO = ?,
        idAdmin = NULL
    WHERE idEmpleado = ? AND idAdmin IS NULL
  `;

  await pool.query(sql, [
    crear_productos,
    modificar_productos,
    modificar_ventasE,
    modificar_ventasO,
    ver_ventasTotalesE,
    ver_ventasTotalesO,
    idEmpleado,
  ]);
};

const deleteByEmpleadoId = async (idEmpleado) => {
  const sql = "DELETE FROM Permisos WHERE idEmpleado = ? AND idAdmin IS NULL";
  await pool.query(sql, [idEmpleado]);
};

module.exports = {
  findAll,
  findByEmpleadoId,
  existsByEmpleadoId,
  create,
  update,
  deleteByEmpleadoId,
};
