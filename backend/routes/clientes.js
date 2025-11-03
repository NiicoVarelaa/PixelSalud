const express = require("express");
const {
  getClientes,
  getClienteBajados,
  getCliente,
  crearCliente,
  updateCliente,
  darBajaCliente,
  activarCliente
} = require("../controllers/clientes");
const auth = require("../middlewares/auth")
const { verificarRol }= require("../middlewares/verificarPermisos")

const router = express.Router();



router.get("/clientes",auth,verificarRol(["admin"]), getClientes);
router.get("/clientes/bajados",auth,verificarRol(["admin"]),getClienteBajados)
router.get("/clientes/:id",auth,verificarRol(["admin", "cliente"]),getCliente)
router.post("/clientes/crear", crearCliente);
router.put("/clientes/actualizar/:idCliente",auth,verificarRol(["admin", "cliente"]), updateCliente);
router.put("/clientes/darBaja/:id",auth,verificarRol(["admin", "cliente"]), darBajaCliente)
router.put("/clientes/activar/:id",auth,verificarRol(["admin", "cliente"]),activarCliente)


module.exports = router;