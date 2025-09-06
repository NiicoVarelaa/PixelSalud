const { conection } = require("../config/database");



const mostrarCompras = async (req, res) => {
  const idCliente = req.params.idCliente;
  const consulta =
    `SELECT v.idVentaO, v.fechaPago, v.metodoPago, c.nombreCliente, p.nombreProducto, d.cantidad, d.precioUnitario, v.totalPago, v.estado, p.img
     FROM VentasOnlines v
     JOIN Clientes c ON v.idCliente = c.idCliente
     JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
     JOIN Productos p ON d.idProducto = p.idProducto
     WHERE c.idCliente = ?;`;
  conection.query(consulta, [idCliente], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener compras", err });
    }
    res.status(200).json({ message: "Compras obtenidas", results });
  });
};

const mostrarTodasLasVentas = async (req, res) => {
  const consulta = `
    SELECT v.idVentaO, v.fechaPago, v.horaPago, v.metodoPago, v.estado, c.nombreCliente, p.nombreProducto, d.cantidad, d.precioUnitario, v.totalPago
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

const registrarVentaOnline = async (req, res) => {
  try {
    const { metodoPago, idCliente, productos, tipoEntrega, direccionEnvio } = req.body;

    if (!metodoPago || !idCliente || !productos || productos.length === 0 || !tipoEntrega) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Verificar stock de todos los productos antes de continuar
    for (let i = 0; i < productos.length; i++) {
      const { idProducto, cantidad } = productos[i];
      const [stockResult] = await new Promise((resolve, reject) => {
        conection.query("SELECT stock FROM Productos WHERE idProducto = ?", [idProducto], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (!stockResult || stockResult.stock < cantidad) {
        return res.status(400).json({
          error: `Stock insuficiente del producto con ID ${idProducto}`,
        });
      }
    }

    // Si es envío, guardar dirección primero
    let idDireccion = null;
    if (tipoEntrega === "Envio" && direccionEnvio) {
      const sqlDireccion = `
        INSERT INTO DireccionesEnvio 
        (idCliente, nombreDestinatario, telefono, direccion, ciudad, provincia, codigoPostal, referencias)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const resultDireccion = await new Promise((resolve, reject) => {
        conection.query(sqlDireccion, [
          idCliente,
          direccionEnvio.nombreDestinatario,
          direccionEnvio.telefono,
          direccionEnvio.direccion,
          direccionEnvio.ciudad,
          direccionEnvio.provincia,
          direccionEnvio.codigoPostal,
          direccionEnvio.referencias || null
        ], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      idDireccion = resultDireccion.insertId;
    }

    // Insertar venta
    const totalPago = productos.reduce((acc, p) => acc + (p.precioUnitario * p.cantidad), 0);
    const sqlVenta = `
      INSERT INTO VentasOnlines (totalPago, metodoPago, idCliente, tipoEntrega, estado, idDireccion)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const resultVenta = await new Promise((resolve, reject) => {
      conection.query(sqlVenta, [
        totalPago,
        metodoPago,
        idCliente,
        tipoEntrega,
        "Pendiente",
        idDireccion
      ], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    const idVentaO = resultVenta.insertId;

    // Insertar detalle y actualizar stock
    for (let i = 0; i < productos.length; i++) {
      const { idProducto, cantidad, precioUnitario } = productos[i];

      await new Promise((resolve, reject) => {
        conection.query(
          `INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario) VALUES (?, ?, ?, ?)`,
          [idVentaO, idProducto, cantidad, precioUnitario],
          (err) => err ? reject(err) : resolve()
        );
      });

      await new Promise((resolve, reject) => {
        conection.query(
          `UPDATE Productos SET stock = stock - ? WHERE idProducto = ? AND stock >= ?`,
          [cantidad, idProducto, cantidad],
          (err) => err ? reject(err) : resolve()
        );
      });
    }

    res.status(201).json({ mensaje: "Venta registrada", idVentaO });

  } catch (error) {
    console.error("Error al registrar la venta online:", error);
    res.status(500).json({ error: "Error al registrar la venta" });
  }
};

const actualizarEstadoVenta = (req, res) => {
  const { idVentaO, nuevoEstado } = req.body;

  if (!idVentaO || !nuevoEstado) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = `UPDATE VentasOnlines SET estado = ? WHERE idVentaO = ?`;
  conection.query(sql, [nuevoEstado, idVentaO], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    res.json({ mensaje: "Estado actualizado correctamente" });
  });
};

function formatearFechaConDia(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const fechaFormateada = date.toLocaleDateString("es-AR", opciones);
  return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
}


module.exports = {
  mostrarCompras,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta
};
