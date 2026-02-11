const BaseRepository = require("./BaseRepository");

/**
 * Repositorio para la tabla Clientes
 * Maneja todas las operaciones de acceso a datos de clientes
 */
class ClientesRepository extends BaseRepository {
  constructor() {
    super("Clientes");
  }

  /**
   * Obtiene todos los clientes (sin contraseña)
   * @returns {Promise<Array>}
   */
  async findAll() {
    const query = `
      SELECT 
        idCliente, 
        nombreCliente, 
        apellidoCliente, 
        emailCliente, 
        dni, 
        telefono,
        direccion,
        activo, 
        rol 
      FROM Clientes 
      ORDER BY idCliente DESC`;

    return await this.query(query);
  }

  /**
   * Obtiene clientes inactivos
   * @returns {Promise<Array>}
   */
  async findInactivos() {
    const query = `
      SELECT 
        idCliente, 
        nombreCliente, 
        apellidoCliente, 
        emailCliente, 
        dni, 
        telefono,
        direccion,
        activo, 
        rol 
      FROM Clientes 
      WHERE activo = false 
      ORDER BY idCliente DESC`;

    return await this.query(query);
  }

  /**
   * Obtiene un cliente por ID (sin contraseña)
   * @param {number} idCliente
   * @returns {Promise<Object|null>}
   */
  async findById(idCliente) {
    const query = `
      SELECT 
        idCliente, 
        nombreCliente, 
        apellidoCliente, 
        emailCliente, 
        dni, 
        telefono,
        direccion,
        activo, 
        rol,
        tokenRecuperacion,
        tokenExpiracion
      FROM Clientes 
      WHERE idCliente = ?`;

    const results = await this.query(query, [idCliente]);
    return results[0] || null;
  }

  /**
   * Obtiene un cliente por email (con contraseña para auth)
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const query = "SELECT * FROM Clientes WHERE emailCliente = ?";
    const results = await this.query(query, [email]);
    return results[0] || null;
  }

  /**
   * Obtiene un cliente por DNI
   * @param {string} dni
   * @returns {Promise<Object|null>}
   */
  async findByDNI(dni) {
    const query = `
      SELECT 
        idCliente,
        nombreCliente, 
        apellidoCliente, 
        dni,
        emailCliente,
        telefono,
        direccion,
        activo
      FROM Clientes 
      WHERE dni = ?`;

    const results = await this.query(query, [dni]);
    return results[0] || null;
  }

  /**
   * Verifica si existe un cliente con el email dado (excepto el ID especificado)
   * @param {string} email
   * @param {number} excludeId - ID a excluir de la búsqueda
   * @returns {Promise<boolean>}
   */
  async existsEmailExcept(email, excludeId) {
    const query =
      "SELECT COUNT(*) as count FROM Clientes WHERE emailCliente = ? AND idCliente != ?";
    const results = await this.query(query, [email, excludeId]);
    return results[0].count > 0;
  }

  /**
   * Verifica si existe un cliente con el email dado
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email) {
    const query =
      "SELECT COUNT(*) as count FROM Clientes WHERE emailCliente = ?";
    const results = await this.query(query, [email]);
    return results[0].count > 0;
  }

  /**
   * Verifica si existe un cliente con el DNI dado
   * @param {string} dni
   * @returns {Promise<boolean>}
   */
  async existsByDNI(dni) {
    const query = "SELECT COUNT(*) as count FROM Clientes WHERE dni = ?";
    const results = await this.query(query, [dni]);
    return results[0].count > 0;
  }

  /**
   * Crea un nuevo cliente
   * @param {Object} clienteData
   * @returns {Promise<Object>}
   */
  async create(clienteData) {
    const query = `
      INSERT INTO Clientes 
      (nombreCliente, apellidoCliente, contraCliente, emailCliente, dni, telefono, direccion, rol, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      clienteData.nombreCliente,
      clienteData.apellidoCliente,
      clienteData.contraCliente,
      clienteData.emailCliente,
      clienteData.dni,
      clienteData.telefono || null,
      clienteData.direccion || null,
      clienteData.rol || "cliente",
      clienteData.activo !== undefined ? clienteData.activo : true,
    ];

    return await this.query(query, values);
  }

  /**
   * Actualiza un cliente (campos dinámicos)
   * @param {number} idCliente
   * @param {Object} updates - Objeto con campos a actualizar
   * @returns {Promise<Object>}
   */
  async update(idCliente, updates) {
    const campos = [];
    const valores = [];

    if (updates.nombreCliente !== undefined) {
      campos.push("nombreCliente = ?");
      valores.push(updates.nombreCliente);
    }
    if (updates.apellidoCliente !== undefined) {
      campos.push("apellidoCliente = ?");
      valores.push(updates.apellidoCliente);
    }
    if (updates.emailCliente !== undefined) {
      campos.push("emailCliente = ?");
      valores.push(updates.emailCliente);
    }
    if (updates.dni !== undefined) {
      campos.push("dni = ?");
      valores.push(updates.dni);
    }
    if (updates.telefono !== undefined) {
      campos.push("telefono = ?");
      valores.push(updates.telefono);
    }
    if (updates.direccion !== undefined) {
      campos.push("direccion = ?");
      valores.push(updates.direccion);
    }
    if (updates.contraCliente !== undefined) {
      campos.push("contraCliente = ?");
      valores.push(updates.contraCliente);
    }

    if (campos.length === 0) {
      throw new Error("No hay campos para actualizar");
    }

    const query = `UPDATE Clientes SET ${campos.join(", ")} WHERE idCliente = ?`;
    valores.push(idCliente);

    return await this.query(query, valores);
  }

  /**
   * Actualiza el estado activo de un cliente
   * @param {number} idCliente
   * @param {boolean} activo
   * @returns {Promise<Object>}
   */
  async updateEstado(idCliente, activo) {
    const query = "UPDATE Clientes SET activo = ? WHERE idCliente = ?";
    return await this.query(query, [activo, idCliente]);
  }

  /**
   * Guarda el token de recuperación de contraseña
   * @param {number} idCliente
   * @param {string} token
   * @param {Date} expiracion
   * @returns {Promise<Object>}
   */
  async saveRecoveryToken(idCliente, token, expiracion) {
    const query = `
      UPDATE Clientes 
      SET tokenRecuperacion = ?, tokenExpiracion = ? 
      WHERE idCliente = ?`;

    return await this.query(query, [token, expiracion, idCliente]);
  }

  /**
   * Busca cliente por token de recuperación válido
   * @param {string} token
   * @returns {Promise<Object|null>}
   */
  async findByValidToken(token) {
    const query = `
      SELECT * FROM Clientes 
      WHERE tokenRecuperacion = ? 
      AND tokenExpiracion > NOW()`;

    const results = await this.query(query, [token]);
    return results[0] || null;
  }

  /**
   * Actualiza contraseña y limpia tokens de recuperación
   * @param {number} idCliente
   * @param {string} nuevaContra - Contraseña ya hasheada
   * @returns {Promise<Object>}
   */
  async updatePassword(idCliente, nuevaContra) {
    const query = `
      UPDATE Clientes 
      SET contraCliente = ?, 
          tokenRecuperacion = NULL, 
          tokenExpiracion = NULL 
      WHERE idCliente = ?`;

    return await this.query(query, [nuevaContra, idCliente]);
  }
}

module.exports = new ClientesRepository();
