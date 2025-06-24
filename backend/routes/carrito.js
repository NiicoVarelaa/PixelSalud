const express = require("express")
const {addCarrito, getCarrito, deleteCarrito} = require("../controllers/carrito")


const router = express.Router()

/* Peticiones */

router.get("/carrito/:idCliente", getCarrito);
router.post("/carrito/agregar",addCarrito);
router.delete("/carrito/eliminar/:idProducto",deleteCarrito);

module.exports = router;