const { pool } = require("../config/database");

const withTransaction = async (callback) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    console.error("❌ Transacción revertida (ROLLBACK):", error.message);
    throw error;
  } finally {
    connection.release();
    console.log("🔓 Conexión liberada al pool");
  }
};

module.exports = { withTransaction };
