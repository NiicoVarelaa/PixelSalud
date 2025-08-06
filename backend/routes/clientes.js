const express = require("express");
const {
  getClientes,
  crearCliente,
  actualizarLogueado,
  desloguearCliente,
  updateCliente,
  borrarCliente,
} = require("../controllers/clientes");

const router = express.Router();

router.get("/clientes", getClientes);
router.post("/clientes/crear", crearCliente);
router.put("/clientes/loguear/:idCliente", actualizarLogueado);
router.put("/clientes/:idCliente/logout", desloguearCliente);
router.put("/clientes/actualizar/:idCliente", updateCliente);
router.delete("/clientes/eliminar/:idCliente", borrarCliente);

module.exports = router;
