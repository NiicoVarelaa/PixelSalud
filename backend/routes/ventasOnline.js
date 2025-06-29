const express = require("express")
const {createVenta, mostrarCompras} = require("../controllers/ventasOnline")
const router = express.Router()

/* Peticiones */

router.post("/ventaOnline/crear", createVenta)
router.get("/ventaOnline/misCompras/:idCliente", mostrarCompras)

module.exports = router;
