const mysql2 = require('mysql2');

const conection = mysql2.createConnection({
    host: "localhost",
    user: "root",
<<<<<<< HEAD
<<<<<<< HEAD
    password: "frida2023",
=======
    password: "juanlescano93",
>>>>>>> 2acdb5174ede09192d8cabed698dec1c1fd138f9
=======
    password: "frida2023",
>>>>>>> d81c51cf320f9ab68f73c50d6e92dd6958ffe938
    database: "pixel_salud"
});

module.exports = { conection };

