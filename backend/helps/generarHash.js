const bcrypt = require('bcryptjs');


const passwordDelNuevoAdmin = 'laClaveQueQuieranPoner';

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(passwordDelNuevoAdmin, salt);

console.log('======================================================');
console.log('Este es el HASH para poner en la Base de Datos:');
console.log(hash);
console.log('======================================================');