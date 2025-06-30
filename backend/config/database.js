const mysql2 = require('mysql2');

const conection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "pixel2025",
    database: "pixel_salud"
});

module.exports = { conection };

