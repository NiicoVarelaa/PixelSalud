const { pool } = require("../config/database");

const createRefreshToken = async (userId, tokenHash, expiresAt) => {
  const query = `
    INSERT INTO RefreshTokens (idUsuario, tokenHash, fechaExpiracion, revocado)
    VALUES (?, ?, ?, FALSE)
  `;
  const [result] = await pool.query(query, [userId, tokenHash, expiresAt]);
  return result.insertId;
};

const findRefreshToken = async (tokenHash) => {
  const query = `
    SELECT idRefreshToken, idUsuario, tokenHash, fechaExpiracion, revocado, fechaCreacion
    FROM RefreshTokens
    WHERE tokenHash = ? AND revocado = FALSE AND fechaExpiracion > NOW()
  `;
  const [rows] = await pool.query(query, [tokenHash]);
  return rows[0] || null;
};

const revokeRefreshToken = async (tokenHash) => {
  const query = `UPDATE RefreshTokens SET revocado = TRUE WHERE tokenHash = ?`;
  const [result] = await pool.query(query, [tokenHash]);
  return result.affectedRows > 0;
};

const revokeAllUserTokens = async (userId) => {
  const query = `UPDATE RefreshTokens SET revocado = TRUE WHERE idUsuario = ?`;
  const [result] = await pool.query(query, [userId]);
  return result.affectedRows;
};

const deleteExpiredTokens = async () => {
  const query = `DELETE FROM RefreshTokens WHERE fechaExpiracion <= NOW()`;
  const [result] = await pool.query(query);
  return result.affectedRows;
};

module.exports = {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  deleteExpiredTokens,
};
