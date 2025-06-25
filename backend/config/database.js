const mysql2 = require('mysql2');

const conection = mysql2.createConnection({
    host: "localhost",
    user: "root",
<<<<<<< HEAD
    password: "frida2023",
=======
    password: "juanlescano93",
>>>>>>> 2acdb5174ede09192d8cabed698dec1c1fd138f9
    database: "pixel_salud"
});

module.exports = { conection };

