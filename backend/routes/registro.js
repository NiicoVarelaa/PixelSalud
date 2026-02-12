const express = require("express");
const { registrarCliente } = require("../controllers/registro");
const validate = require("../middlewares/validate");
const { registroClienteBodySchema } = require("../schemas/AuthSchemas");

const router = express.Router();

/**
 * POST /registroCliente
 * Registro de nuevos clientes
 */
router.post(
  "/registroCliente",
  validate({ body: registroClienteBodySchema }),
  registrarCliente,
);

module.exports = router;
