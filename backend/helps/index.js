/**
 * Exportación centralizada de helpers/utilidades
 *
 * Esto permite hacer:
 *   const { EnvioMail, GenerarHash } = require('../helps');
 *
 * En lugar de:
 *   const EnvioMail = require('../helps/EnvioMail');
 *   const GenerarHash = require('../helps/GenerarHash');
 */

module.exports = {
  EnvioMail: require("./EnvioMail"),
  GenerarHash: require("./GenerarHash"),
};
