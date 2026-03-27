const { pool } = require("../config/database");

let tableReady = false;

const ensureTable = async () => {
  if (tableReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS NewsletterSuscripciones (
      idSuscripcion INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(150) NOT NULL,
      nombre VARCHAR(100) NULL,
      idCliente INT NULL,
      fuente VARCHAR(50) NOT NULL DEFAULT 'footer',
      aceptaMarketing TINYINT(1) NOT NULL DEFAULT 1,
      estado ENUM('activa', 'baja') NOT NULL DEFAULT 'activa',
      fechaSuscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_newsletter_email (email),
      INDEX idx_newsletter_estado (estado),
      INDEX idx_newsletter_fecha (fechaSuscripcion),
      CONSTRAINT fk_newsletter_cliente
        FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente)
        ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  tableReady = true;
};

const findByEmail = async (email) => {
  await ensureTable();

  const [rows] = await pool.query(
    `SELECT
      idSuscripcion,
      email,
      nombre,
      idCliente,
      fuente,
      aceptaMarketing,
      estado,
      fechaSuscripcion,
      fechaActualizacion
     FROM NewsletterSuscripciones
     WHERE email = ?
     LIMIT 1`,
    [email],
  );

  return rows[0] || null;
};

const create = async ({
  email,
  nombre,
  idCliente,
  fuente,
  aceptaMarketing,
}) => {
  await ensureTable();

  const [result] = await pool.query(
    `INSERT INTO NewsletterSuscripciones
      (email, nombre, idCliente, fuente, aceptaMarketing, estado)
     VALUES (?, ?, ?, ?, ?, 'activa')`,
    [
      email,
      nombre || null,
      idCliente || null,
      fuente || "footer",
      aceptaMarketing ? 1 : 0,
    ],
  );

  return result.insertId;
};

const reactivate = async ({
  email,
  nombre,
  idCliente,
  fuente,
  aceptaMarketing,
}) => {
  await ensureTable();

  const [result] = await pool.query(
    `UPDATE NewsletterSuscripciones
     SET
      estado = 'activa',
      nombre = COALESCE(?, nombre),
      idCliente = COALESCE(?, idCliente),
      fuente = ?,
      aceptaMarketing = ?,
      fechaSuscripcion = NOW()
     WHERE email = ?`,
    [
      nombre || null,
      idCliente || null,
      fuente || "footer",
      aceptaMarketing ? 1 : 0,
      email,
    ],
  );

  return result.affectedRows > 0;
};

const deactivateByEmail = async (email) => {
  await ensureTable();

  const [result] = await pool.query(
    `UPDATE NewsletterSuscripciones
     SET estado = 'baja'
     WHERE email = ? AND estado = 'activa'`,
    [email],
  );

  return result.affectedRows > 0;
};

module.exports = {
  findByEmail,
  create,
  reactivate,
  deactivateByEmail,
};
