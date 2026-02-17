const { pool } = require("../config/database");

const withTransaction = async (callback) => {
  const connection = await pool.getConnection();

  try {
    // Iniciar transacción
    await connection.beginTransaction();

    // Ejecutar operaciones dentro de la transacción
    const result = await callback(connection);

    // Si todo salió bien, confirmar cambios
    await connection.commit();

    return result;
  } catch (error) {
    // Si algo falló, revertir todos los cambios
    await connection.rollback();
    console.error("❌ Transacción revertida (ROLLBACK):", error.message);

    // Propagar el error para que el llamador lo maneje
    throw error;
  } finally {
    // SIEMPRE liberar la conexión al pool
    connection.release();
    console.log("🔓 Conexión liberada al pool");
  }
};

module.exports = { withTransaction };
