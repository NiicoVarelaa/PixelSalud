const ticketService = require("../services/TicketService");

const obtenerTicketEmpleado = async (req, res, next) => {
  try {
    const { idVentaE } = req.params;
    const ticket = await ticketService.obtenerTicketVentaEmpleado(
      parseInt(idVentaE, 10),
    );

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerTicketOnline = async (req, res, next) => {
  try {
    const { idVentaO } = req.params;
    const ticket = await ticketService.obtenerTicketVentaOnline(
      parseInt(idVentaO, 10),
    );

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTicketEmpleado,
  obtenerTicketOnline,
};
