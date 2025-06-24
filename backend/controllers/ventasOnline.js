const { conection } = require("../config/database");

/* Crear una venta con sus productos usando for tradicional */
const createVenta = (req, res) => {
  const { totalPago, metodoPago, idEnvio, idCliente, productos } = req.body;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: "La venta debe incluir al menos un producto" });
  }

  const consultaVenta = "INSERT INTO VentasOnlines (totalPago, metodoPago, idEnvio, idCliente) VALUES (?, ?, ?, ?)";

  conection.query(consultaVenta, [totalPago, metodoPago, idEnvio, idCliente], (err, result) => {
    if (err) {
      console.error("Error al crear la venta:", err);
      return res.status(500).json({ error: "Error al crear la venta" });
    }
    const idVentaO = result.insertId;

    // Función para insertar productos uno por uno con for tradicional
    const insertarProducto = (index) => {
      if (index >= productos.length) {
        // Terminó de insertar todos los productos
        return res.status(201).json({ message: "Venta registrada correctamente", idVentaO });
      }

      const { idProducto, cantidad, precioUnitario } = productos[index];
      const consultaDetalle = "INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario) VALUES (?, ?, ?, ?)";

      conection.query(consultaDetalle, [idVentaO, idProducto, cantidad, precioUnitario], (err2) => {
        if (err2) {
          console.error("Error al insertar producto en detalle:", err2);
          return res.status(500).json({ error: "Error al insertar producto en detalle" });
        }
        // Llamo recursivamente para el siguiente producto
        insertarProducto(index + 1);
      });
    };

    // Empiezo a insertar desde el primer producto
    insertarProducto(0);
  });
};

module.exports = {
  createVenta
};
