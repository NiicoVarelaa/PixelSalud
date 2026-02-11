const BaseRepository = require("./BaseRepository");

/**
 * Repository para la tabla Empleados
 * Maneja acceso a datos de empleados y su relación con Permisos
 */
class EmpleadosRepository extends BaseRepository {
  constructor() {
    super("Empleados");
  }

  /**
   * Obtiene todos los empleados activos con sus permisos
   * @returns {Promise<Array>}
   */
  async findAllWithPermisos() {
    const sql = `
      SELECT e.*, 
             p.crear_productos, 
             p.modificar_productos, 
             p.modificar_ventasE, 
             p.ver_ventasTotalesE 
      FROM Empleados e
      LEFT JOIN Permisos p ON e.idEmpleado = p.idEmpleado
      WHERE e.activo = true
    `;
    return await this.query(sql);
  }

  /**
   * Obtiene empleados inactivos
   * @returns {Promise<Array>}
   */
  async findInactivos() {
    const sql = `SELECT * FROM ${this.tableName} WHERE activo = false`;
    return await this.query(sql);
  }

  /**
   * Busca empleado por ID con permisos
   * @param {number} idEmpleado
   * @returns {Promise<Object|null>}
   */
  async findByIdWithPermisos(idEmpleado) {
    const sql = `
      SELECT e.*, 
             p.crear_productos, 
             p.modificar_productos, 
             p.modificar_ventasE, 
             p.ver_ventasTotalesE 
      FROM Empleados e
      LEFT JOIN Permisos p ON e.idEmpleado = p.idEmpleado
      WHERE e.idEmpleado = ?
    `;
    const results = await this.query(sql, [idEmpleado]);
    return results[0] || null;
  }

  /**
   * Busca empleado por email
   * @param {string} emailEmpleado
   * @returns {Promise<Object|null>}
   */
  async findByEmail(emailEmpleado) {
    const sql = `SELECT * FROM ${this.tableName} WHERE emailEmpleado = ?`;
    const results = await this.query(sql, [emailEmpleado]);
    return results[0] || null;
  }

  /**
   * Busca empleado por DNI
   * @param {string} dniEmpleado
   * @returns {Promise<Object|null>}
   */
  async findByDNI(dniEmpleado) {
    const sql = `SELECT * FROM ${this.tableName} WHERE dniEmpleado = ?`;
    const results = await this.query(sql, [dniEmpleado]);
    return results[0] || null;
  }

  /**
   * Verifica si existe un email excluyendo un ID específico
   * @param {string} emailEmpleado
   * @param {number} excludeId
   * @returns {Promise<boolean>}
   */
  async existsEmailExcept(emailEmpleado, excludeId) {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE emailEmpleado = ? AND idEmpleado != ?`;
    const results = await this.query(sql, [emailEmpleado, excludeId]);
    return results[0].count > 0;
  }

  /**
   * Verifica si existe un DNI excluyendo un ID específico
   * @param {string} dniEmpleado
   * @param {number} excludeId
   * @returns {Promise<boolean>}
   */
  async existsDNIExcept(dniEmpleado, excludeId) {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE dniEmpleado = ? AND idEmpleado != ?`;
    const results = await this.query(sql, [dniEmpleado, excludeId]);
    return results[0].count > 0;
  }

  /**
   * Crea un nuevo empleado
   * @param {Object} empleadoData
   * @returns {Promise<number>} ID del empleado creado
   */
  async create(empleadoData) {
    const sql = `
      INSERT INTO ${this.tableName} 
      (nombreEmpleado, apellidoEmpleado, dniEmpleado, emailEmpleado, contraEmpleado, activo) 
      VALUES (?, ?, ?, ?, ?, 1)
    `;
    const result = await this.query(sql, [
      empleadoData.nombreEmpleado,
      empleadoData.apellidoEmpleado,
      empleadoData.dniEmpleado,
      empleadoData.emailEmpleado,
      empleadoData.contraEmpleado,
    ]);
    return result.insertId;
  }

  /**
   * Actualiza un empleado (con o sin contraseña)
   * @param {number} idEmpleado
   * @param {Object} empleadoData
   * @returns {Promise<void>}
   */
  async update(idEmpleado, empleadoData) {
    const campos = [];
    const valores = [];

    if (empleadoData.nombreEmpleado !== undefined) {
      campos.push("nombreEmpleado = ?");
      valores.push(empleadoData.nombreEmpleado);
    }
    if (empleadoData.apellidoEmpleado !== undefined) {
      campos.push("apellidoEmpleado = ?");
      valores.push(empleadoData.apellidoEmpleado);
    }
    if (empleadoData.dniEmpleado !== undefined) {
      campos.push("dniEmpleado = ?");
      valores.push(empleadoData.dniEmpleado);
    }
    if (empleadoData.emailEmpleado !== undefined) {
      campos.push("emailEmpleado = ?");
      valores.push(empleadoData.emailEmpleado);
    }
    if (empleadoData.contraEmpleado !== undefined) {
      campos.push("contraEmpleado = ?");
      valores.push(empleadoData.contraEmpleado);
    }

    if (campos.length === 0) {
      throw new Error("No hay campos para actualizar");
    }

    valores.push(idEmpleado);
    const sql = `UPDATE ${this.tableName} SET ${campos.join(", ")} WHERE idEmpleado = ?`;
    await this.query(sql, valores);
  }

  /**
   * Actualiza el estado activo de un empleado
   * @param {number} idEmpleado
   * @param {boolean} activo
   * @returns {Promise<void>}
   */
  async updateEstado(idEmpleado, activo) {
    const sql = `UPDATE ${this.tableName} SET activo = ? WHERE idEmpleado = ?`;
    await this.query(sql, [activo ? 1 : 0, idEmpleado]);
  }

  /**
   * Crea permisos para un empleado
   * @param {number} idEmpleado
   * @param {Object} permisos
   * @returns {Promise<void>}
   */
  async createPermisos(idEmpleado, permisos) {
    const sql = `
      INSERT INTO Permisos 
      (idEmpleado, crear_productos, modificar_productos, modificar_ventasE, ver_ventasTotalesE) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await this.query(sql, [
      idEmpleado,
      permisos.crear_productos ? 1 : 0,
      permisos.modificar_productos ? 1 : 0,
      permisos.modificar_ventasE ? 1 : 0,
      permisos.ver_ventasTotalesE ? 1 : 0,
    ]);
  }

  /**
   * Actualiza permisos de un empleado
   * @param {number} idEmpleado
   * @param {Object} permisos
   * @returns {Promise<void>}
   */
  async updatePermisos(idEmpleado, permisos) {
    const sql = `
      UPDATE Permisos SET 
        crear_productos = ?, 
        modificar_productos = ?, 
        modificar_ventasE = ?, 
        ver_ventasTotalesE = ?
      WHERE idEmpleado = ?
    `;
    await this.query(sql, [
      permisos.crear_productos ? 1 : 0,
      permisos.modificar_productos ? 1 : 0,
      permisos.modificar_ventasE ? 1 : 0,
      permisos.ver_ventasTotalesE ? 1 : 0,
      idEmpleado,
    ]);
  }

  /**
   * Verifica si existen permisos para un empleado
   * @param {number} idEmpleado
   * @returns {Promise<boolean>}
   */
  async existsPermisos(idEmpleado) {
    const sql = `SELECT COUNT(*) as count FROM Permisos WHERE idEmpleado = ?`;
    const results = await this.query(sql, [idEmpleado]);
    return results[0].count > 0;
  }
}

module.exports = new EmpleadosRepository();
