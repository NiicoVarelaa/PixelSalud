const bcrypt = require('bcryptjs');

const passwordDelNuevoAdmin = 'admin123';

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(passwordDelNuevoAdmin, salt);
