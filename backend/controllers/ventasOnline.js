const util = require("util");
const { conection } = require("../config/database");

// Función auxiliar para consultas async/await (Más estable y compatible)
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        conection.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const getUserOrders = async (req, res) => { 
  const idCliente = req.user.id; 
  const consulta = `
     SELECT v.idVentaO, v.fechaPago, v.horaPago, v.metodoPago, v.totalPago, v.estado, 
            p.nombreProducto, p.img, d.cantidad, d.precioUnitario 
     FROM VentasOnlines v
     JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
     JOIN Productos p ON d.idProducto = p.idProducto
     WHERE v.idCliente = ? 
     ORDER BY v.idVentaO DESC;`;

  try {
    const results = await query(consulta, [idCliente]);
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener compras", error: err.message });
  }
};

const mostrarTodasLasVentas = async (req, res) => {
  const consulta = `
    SELECT v.idVentaO, v.fechaPago, v.horaPago, v.metodoPago, v.estado, 
           c.nombreCliente, c.apellidoCliente, c.dni,
           p.nombreProducto, d.cantidad, d.precioUnitario, v.totalPago
    FROM VentasOnlines v
    JOIN Clientes c ON v.idCliente = c.idCliente
    JOIN DetalleVentaOnline d ON v.idVentaO = d.idVentaO
    JOIN Productos p ON d.idProducto = p.idProducto
    ORDER BY v.idVentaO DESC;
  `;

  try {
    const results = await query(consulta);
    res.status(200).json({ message: "Éxito al traer todas las ventas", results });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener todas las ventas: " + err.message });
  }
};

const registrarVentaOnline = async (req, res) => {
  try {
    const { metodoPago, idCliente, productos, tipoEntrega, direccionEnvio } = req.body;

    if (!metodoPago || !idCliente || !productos || productos.length === 0 || !tipoEntrega) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // 1. Verificar stock
    for (const prod of productos) {
      const results = await query("SELECT stock FROM Productos WHERE idProducto = ?", [prod.idProducto]);
      if (!results.length || results[0].stock < prod.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente del producto ID ${prod.idProducto}` });
      }
    }

    // 2. Dirección
    let idDireccion = null;
    if (tipoEntrega === "Envio" && direccionEnvio) {
      const sqlDireccion = `INSERT INTO DireccionesEnvio (idCliente, nombreDestinatario, telefono, direccion, ciudad, provincia, codigoPostal, referencias) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const resultDir = await query(sqlDireccion, [idCliente, direccionEnvio.nombreDestinatario, direccionEnvio.telefono, direccionEnvio.direccion, direccionEnvio.ciudad, direccionEnvio.provincia, direccionEnvio.codigoPostal, direccionEnvio.referencias || null]);
      idDireccion = resultDir.insertId;
    }

    // 3. Insertar Venta
    const totalPago = productos.reduce((acc, p) => acc + (p.precioUnitario * p.cantidad), 0);
    const sqlVenta = `INSERT INTO VentasOnlines (totalPago, metodoPago, idCliente, tipoEntrega, estado, idDireccion) VALUES (?, ?, ?, ?, ?, ?)`;
    const resultVenta = await query(sqlVenta, [totalPago, metodoPago, idCliente, tipoEntrega, "Pendiente", idDireccion]);
    
    const idVentaO = resultVenta.insertId;

    // 4. Detalles y Stock
    for (const prod of productos) {
      await query(`INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario) VALUES (?, ?, ?, ?)`, [idVentaO, prod.idProducto, prod.cantidad, prod.precioUnitario]);
      await query(`UPDATE Productos SET stock = stock - ? WHERE idProducto = ?`, [prod.cantidad, prod.idProducto]);
    }

    res.status(201).json({ mensaje: "Venta registrada", idVentaO });

  } catch (error) {
    console.error("Error registrarVentaOnline:", error);
    res.status(500).json({ error: "Error al registrar la venta: " + error.message });
  }
};

const actualizarEstadoVenta = async (req, res) => {
  const { idVentaO, nuevoEstado } = req.body;
  if (!idVentaO || !nuevoEstado) return res.status(400).json({ error: "Faltan datos" });

  try {
    const result = await query(`UPDATE VentasOnlines SET estado = ? WHERE idVentaO = ?`, [nuevoEstado, idVentaO]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Venta no encontrada" });
    res.json({ mensaje: "Estado actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// NUEVAS FUNCIONES PARA EDITAR (SIN TRANSACTION)
// ==========================================

const obtenerDetalleVentaOnline = async (req, res) => {
    const { idVentaO } = req.params;
    const consulta = `
        SELECT d.idProducto, p.nombreProducto, d.cantidad, d.precioUnitario 
        FROM DetalleVentaOnline d
        JOIN Productos p ON d.idProducto = p.idProducto
        WHERE d.idVentaO = ?
    `;
    try {
        const results = await query(consulta, [idVentaO]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener detalles: " + err.message });
    }
};

const actualizarVentaOnline = async (req, res) => {
    const { idVentaO } = req.params;
    const { metodoPago, productos } = req.body;

    if (!idVentaO || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Faltan datos para actualizar" });
    }

    try {
        // 1️⃣ Obtener detalles viejos para devolver stock
        const detallesViejos = await query(
            'SELECT idProducto, cantidad FROM DetalleVentaOnline WHERE idVentaO = ?',
            [idVentaO]
        );

        // 2️⃣ Devolver stock anterior
        for (const det of detallesViejos) {
            await query(
                'UPDATE Productos SET stock = stock + ? WHERE idProducto = ?',
                [det.cantidad, det.idProducto]
            );
        }

        // 3️⃣ Borrar detalles viejos
        await query(
            'DELETE FROM DetalleVentaOnline WHERE idVentaO = ?',
            [idVentaO]
        );

        let totalCalculado = 0;

        // 4️⃣ Insertar nuevos productos (precio y stock desde BD)
        for (const prod of productos) {
            const idProd = Number(prod.idProducto);
            const cant = Number(prod.cantidad);

            if (!idProd || cant <= 0) {
                return res.status(400).json({ error: "Producto o cantidad inválida" });
            }

            // Obtener precio y stock real
            const prodDB = await query(
                'SELECT precio, stock FROM Productos WHERE idProducto = ?',
                [idProd]
            );

            if (!prodDB.length) {
                return res.status(404).json({ error: `Producto ID ${idProd} no existe` });
            }

            const { precio, stock } = prodDB[0];

            if (stock < cant) {
                return res.status(400).json({
                    error: `Stock insuficiente para producto ID ${idProd}`
                });
            }

            // Insertar detalle
            await query(
                `INSERT INTO DetalleVentaOnline 
                 (idVentaO, idProducto, cantidad, precioUnitario)
                 VALUES (?, ?, ?, ?)`,
                [idVentaO, idProd, cant, precio]
            );

            // Descontar stock
            await query(
                'UPDATE Productos SET stock = stock - ? WHERE idProducto = ?',
                [cant, idProd]
            );

            totalCalculado += precio * cant;
        }

        // 5️⃣ Actualizar cabecera de la venta
        await query(
            'UPDATE VentasOnlines SET totalPago = ?, metodoPago = ? WHERE idVentaO = ?',
            [totalCalculado, metodoPago, idVentaO]
        );

        res.status(200).json({ message: "Venta online actualizada correctamente" });

    } catch (error) {
        console.error("ERROR actualizarVentaOnline:", error);
        res.status(500).json({
            error: "Error interno al actualizar la venta: " + error.message
        });
    }
};


module.exports = {
  getUserOrders,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta,
  obtenerDetalleVentaOnline,
  actualizarVentaOnline
};