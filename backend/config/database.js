const mysql2 = require("mysql2");
const mysql2Promise = require("mysql2/promise");

const conection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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

pool
  .getConnection()
  .then((connection) => {
    connection.release();
  })
  .catch((err) => {
    console.error("Error al conectar a MySQL:", err.message);
  });

module.exports = {
  conection, 
  pool, 
};
