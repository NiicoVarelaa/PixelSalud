const mysql2 = require("mysql2");
const mysql2Promise = require("mysql2/promise");

// Conexión legacy (callback-based) - Se mantendrá temporalmente para compatibilidad
const conection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Pool moderno con Promesas - Usar este para nuevo código
const pool = mysql2Promise.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test de conexión
pool
  .getConnection()
  .then((connection) => {
    connection.release();
  })
  .catch((err) => {
    console.error("Error al conectar a MySQL:", err.message);
  });

module.exports = {
  conection, // Legacy (callback-based)
  pool, // Moderno (promise-based) - USAR ESTE
};
