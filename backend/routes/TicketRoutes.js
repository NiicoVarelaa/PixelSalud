const router = require("express").Router();
const ticketController = require("../controllers/TicketController");
const auth = require("../middlewares/Auth");

router.get("/empleado/:idVentaE", auth, ticketController.obtenerTicketEmpleado);

router.get("/online/:idVentaO", auth, ticketController.obtenerTicketOnline);

module.exports = router;
