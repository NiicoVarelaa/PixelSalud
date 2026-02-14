const pool = require("../config/database");

/**
 * Obtiene todos los permisos
 * @returns {Promise<Array>}
 */
const findAll = async () => {
  const sql = "SELECT * FROM Permisos ORDER BY idPermiso DESC";
  const [rows] = await pool.query(sql);
  return rows;
};

/**
 * Obtiene los permisos de un empleado específico
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<Object|null>}
 */
const findByEmpleadoId = async (idEmpleado) => {
  const sql = "SELECT * FROM Permisos WHERE idEmpleado = ? AND idAdmin IS NULL";
  const [rows] = await pool.query(sql, [idEmpleado]);
  return rows[0] || null;
};

/**
 * Verifica si un empleado ya tiene permisos asignados
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<boolean>}
 */
const existsByEmpleadoId = async (idEmpleado) => {
  const sql =
    "SELECT COUNT(*) as count FROM Permisos WHERE idEmpleado = ? AND idAdmin IS NULL";
  const [rows] = await pool.query(sql, [idEmpleado]);
  return rows[0].count > 0;
};

/**
 * Crea permisos para un empleado
 * @param {Object} permisoData - Datos de permisos
 * @param {number} permisoData.idEmpleado - ID del empleado
 * @param {boolean} permisoData.crear_productos - Permiso para crear productos
 * @param {boolean} permisoData.modificar_productos - Permiso para modificar productos
 * @param {boolean} permisoData.modificar_ventasE - Permiso para modificar ventas de empleados
 * @param {boolean} permisoData.modificar_ventasO - Permiso para modificar ventas online
 * @param {boolean} permisoData.ver_ventasTotalesE - Permiso para ver ventas totales de empleados
 * @param {boolean} permisoData.ver_ventasTotalesO - Permiso para ver ventas totales online
 * @returns {Promise<number>} - ID del permiso creado
 */
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

/**
 * Actualiza los permisos de un empleado
 * @param {number} idEmpleado - ID del empleado
 * @param {Object} permisoData - Datos de permisos a actualizar
 * @returns {Promise<void>}
 */
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

/**
 * Elimina los permisos de un empleado
 * @param {number} idEmpleado - ID del empleado
 * @returns {Promise<void>}
 */
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
