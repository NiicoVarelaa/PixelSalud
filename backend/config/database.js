const mysql2 = require('mysql2');

const conection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "frida2023",
    database: "pixel_salud"
});

module.exports = { conection };

