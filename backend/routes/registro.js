const express = require("express");
const { registrarCliente } = require("../controllers/registro");

const router = express.Router();

router.post("/registroCliente", registrarCliente);

module.exports = router;
