const { pool } = require("../config/database");
const { DatabaseError } = require("../errors");

/**
 * Clase base que proporciona métodos comunes para todos los repositories
 * Maneja la conexión a la base de datos y operaciones CRUD básicas
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  /**
   * Ejecuta una query con manejo de errores
   * @param {string} sql - Query SQL
   * @param {Array} params - Parámetros de la query
   * @returns {Promise<Array>} Resultados
   */
  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error("❌ Database Error:", error.message);
      throw new DatabaseError("Error en la consulta a la base de datos", error);
    }
  }

  /**
   * Buscar todos los registros
   * @param {Object} conditions - Condiciones WHERE (opcional)
   * @returns {Promise<Array>}
   */
  async findAll(conditions = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const where = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      sql += ` WHERE ${where}`;
      params.push(...Object.values(conditions));
    }

    return await this.query(sql, params);
  }

  /**
   * Buscar un registro por ID
   * @param {number|string} id - ID del registro
   * @param {string} idField - Nombre del campo ID (por defecto: id)
   * @returns {Promise<Object|null>}
   */
  async findById(id, idField = "id") {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${idField} = ? LIMIT 1`;
    const rows = await this.query(sql, [id]);
    return rows[0] || null;
  }

  /**
   * Buscar un registro con condiciones personalizadas
   * @param {Object} conditions - Condiciones WHERE
   * @returns {Promise<Object|null>}
   */
  async findOne(conditions) {
    const where = Object.keys(conditions)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const sql = `SELECT * FROM ${this.tableName} WHERE ${where} LIMIT 1`;
    const rows = await this.query(sql, Object.values(conditions));
    return rows[0] || null;
  }

  /**
   * Crear un nuevo registro
   * @param {Object} data - Datos a insertar
   * @returns {Promise<number>} ID del registro creado
   */
  async create(data) {
    const fields = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;

    const result = await this.query(sql, Object.values(data));
    return result.insertId;
  }

  /**
   * Actualizar un registro por ID
   * @param {number|string} id - ID del registro
   * @param {Object} data - Datos a actualizar
   * @param {string} idField - Nombre del campo ID
   * @returns {Promise<boolean>} true si se actualizó
   */
  async update(id, data, idField = "id") {
    const sets = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const sql = `UPDATE ${this.tableName} SET ${sets} WHERE ${idField} = ?`;

    const result = await this.query(sql, [...Object.values(data), id]);
    return result.affectedRows > 0;
  }

  /**
   * Eliminar un registro por ID
   * @param {number|string} id - ID del registro
   * @param {string} idField - Nombre del campo ID
   * @returns {Promise<boolean>} true si se eliminó
   */
  async delete(id, idField = "id") {
    const sql = `DELETE FROM ${this.tableName} WHERE ${idField} = ?`;
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Contar registros
   * @param {Object} conditions - Condiciones WHERE (opcional)
   * @returns {Promise<number>}
   */
  async count(conditions = {}) {
    let sql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const where = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      sql += ` WHERE ${where}`;
      params.push(...Object.values(conditions));
    }

    const rows = await this.query(sql, params);
    return rows[0]?.total || 0;
  }

  /**
   * Verificar si existe un registro
   * @param {Object} conditions - Condiciones WHERE
   * @returns {Promise<boolean>}
   */
  async exists(conditions) {
    const count = await this.count(conditions);
    return count > 0;
  }
}

module.exports = BaseRepository;
