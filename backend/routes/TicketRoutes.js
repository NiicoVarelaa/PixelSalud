const router = require("express").Router();
const ticketController = require("../controllers/TicketController");
const auth = require("../middlewares/Auth");

/**
 * @route   GET /api/ticket/empleado/:idVentaE
 * @desc    Obtener ticket de venta de empleado
 * @access  Private (empleado/admin)
 */
router.get("/empleado/:idVentaE", auth, ticketController.obtenerTicketEmpleado);

/**
 * @route   GET /api/ticket/online/:idVentaO
 * @desc    Obtener ticket de venta online
 * @access  Private (cliente/admin)
 */
router.get("/online/:idVentaO", auth, ticketController.obtenerTicketOnline);

module.exports = router;
