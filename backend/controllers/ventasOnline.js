const { conection } = require("../config/database");

const createVenta = async (req, res) => {
  try {
    const { totalPago, metodoPago, idCliente, productos } = req.body;

    for (let i = 0; i < productos.length; i++) {
      const { idProducto, cantidad } = productos[i];
      const stockQuery = "SELECT stock FROM Productos WHERE idProducto = ?";

      const [stockResult] = await new Promise((resolve, reject) => {
        conection.query(stockQuery, [idProducto], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (!stockResult || stockResult.stock < cantidad) {
        return res.status(400).json({
          error: `Stock insuficiente del producto `,
        });
      }
    }

    const ventaQuery = `
      INSERT INTO VentasOnlines (totalPago, metodoPago, idCliente)
      VALUES (?, ?, ?)
    `;

    conection.query(
      ventaQuery,
      [totalPago, metodoPago, idCliente],
      (err, result) => {
        if (err) {
          console.error("Error al registrar la venta:", err);
          return res.status(500).json({ error: "Error al registrar la venta" });
        }

        const idVentaO = result.insertId;

        for (let i = 0; i < productos.length; i++) {
          const { idProducto, cantidad, precioUnitario } = productos[i];

          const detalleQuery = `
          INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario)
          VALUES (?, ?, ?, ?)
        `;
          conection.query(
            detalleQuery,
            [idVentaO, idProducto, cantidad, precioUnitario],
            (err) => {
              if (err) console.error("Error al insertar detalle:", err);
            }
          );

          const updateStockQuery = `
          UPDATE Productos
          SET stock = stock - ?
          WHERE idProducto = ? AND stock >= ?
        `;
          conection.query(
            updateStockQuery,
            [cantidad, idProducto, cantidad],
            (err) => {
              if (err) console.error("Error al actualizar stock:", err);
            }
          );
        }

        res
          .status(201)
          .json({ message: "Compra realizada con éxito", idVentaO });
      }
    );
  } catch (error) {
    console.error("Error inesperado en registrarVenta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const mostrarCompras = async (req, res) => {
  const idCliente = req.params.idCliente;
  const consulta =
    "SELECT v.idVentaO, v.fechaPago, v.metodoPago, c.nombreCliente, p.nombreProducto, d.cantidad, d.precioUnitario, v.totalPago FROM VentasOnlines v JOIN Clientes c ON v.idCliente = c.idCliente JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO JOIN Productos p ON d.idProducto = p.idProducto Where c.idCliente = ? ;";
  conection.query(consulta, [idCliente], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error al intentar traer las compras" });
    }
    res.status(200).json({ message: "Exito al traer las compras", results });
  });
};

const mostrarTodasLasVentas = async (req, res) => {
  const consulta = `
    SELECT v.idVentaO, v.fechaPago, v.metodoPago, c.nombreCliente, p.nombreProducto, d.cantidad, d.precioUnitario, v.totalPago
    FROM VentasOnlines v
    JOIN Clientes c ON v.idCliente = c.idCliente
    JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
    JOIN Productos p ON d.idProducto = p.idProducto
    ORDER BY v.idVentaO DESC;
  `;

  conection.query(consulta, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al obtener todas las ventas" });
    }
    res
      .status(200)
      .json({ message: "Éxito al traer todas las ventas", results });
  });
};

module.exports = {
  createVenta,
  mostrarCompras,
  mostrarTodasLasVentas,
};
