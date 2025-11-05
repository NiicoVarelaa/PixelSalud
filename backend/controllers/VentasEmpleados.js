const { conection } = require("../config/database");

const registrarVentaEmpleado = (req, res) => {
    const { idEmpleado, totalPago, metodoPago, productos, recetas } = req.body;

    if (!idEmpleado || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // 1. Iniciar Transacción
    conection.beginTransaction((err) => {
        if (err) {
            console.error("Error al iniciar transacción:", err);
            return res.status(500).json({ error: "Error al iniciar venta" });
        }

        let i = 0;
        // Función flecha recursiva para verificar stock
        const verificarStock = () => {
            if (i < productos.length) {
                const prod = productos[i];
                conection.query('SELECT stock, nombreProducto FROM Productos WHERE idProducto = ? FOR UPDATE', [prod.idProducto], (err, results) => {
                    if (err) {
                        return conection.rollback(() => {
                            console.error("Error verificando stock:", err);
                            res.status(500).json({ error: "Error al verificar stock" });
                        });
                    }
                    if (results.length === 0 || results[0].stock < prod.cantidad) {
                        return conection.rollback(() => {
                            res.status(400).json({ error: `Stock insuficiente para: ${results[0]?.nombreProducto || 'Producto desconocido'}` });
                        });
                    }
                    // Siguiente producto
                    i++;
                    verificarStock();
                });
            } else {
                // Todo el stock verificado, procedemos a insertar la venta
                insertarVenta();
            }
        };

        const insertarVenta = () => {
            conection.query('INSERT INTO VentasEmpleados (idEmpleado, totalPago, metodoPago) VALUES (?, ?, ?)', 
                [idEmpleado, totalPago, metodoPago], 
                (err, resultVenta) => {
                    if (err) {
                        return conection.rollback(() => {
                             console.error("Error insertando venta:", err);
                             res.status(500).json({ error: "Error al registrar venta" });
                        });
                    }
                    // Una vez insertada la venta, insertamos sus detalles
                    insertarDetalles(resultVenta.insertId);
                }
            );
        };

        const insertarDetalles = (idVentaE) => {
            let j = 0;
            // Función flecha recursiva para insertar detalles y actualizar stock
            const procesarDetalle = () => {
                if (j < productos.length) {
                    const prod = productos[j];
                    // 1. Insertar detalle
                    conection.query('INSERT INTO DetalleVentaEmpleado (idVentaE, idProducto, cantidad, precioUnitario) VALUES (?, ?, ?, ?)',
                        [idVentaE, prod.idProducto, prod.cantidad, prod.precioUnitario],
                        (err) => {
                            if (err) {
                                return conection.rollback(() => {
                                    console.error("Error insertando detalle:", err);
                                    res.status(500).json({ error: "Error al registrar detalles" });
                                });
                            }
                            // 2. Actualizar stock
                            conection.query('UPDATE Productos SET stock = stock - ? WHERE idProducto = ?',
                                [prod.cantidad, prod.idProducto],
                                (err) => {
                                     if (err) {
                                        return conection.rollback(() => {
                                            console.error("Error actualizando stock:", err);
                                            res.status(500).json({ error: "Error al actualizar stock" });
                                        });
                                     }
                                     // Siguiente detalle
                                     j++;
                                     procesarDetalle();
                                }
                            );
                        }
                    );
                } else {
                    // ¡Todo listo! Confirmamos la transacción
                    conection.commit((err) => {
                        if (err) {
                             return conection.rollback(() => {
                                 console.error("Error en commit:", err);
                                 res.status(500).json({ error: "Error finalizando venta" });
                             });
                        }
                        res.status(201).json({ message: "Venta registrada con éxito", idVentaE });
                    });
                }
            };
            // Iniciamos el loop de detalles
            procesarDetalle();
        };

        // Arrancamos el proceso con la primera verificación
        verificarStock();
    });
};

const obtenerVentasEmpleado = (req, res) => {
  const consulta = `
    SELECT ve.idVentaE, ve.fechaPago, ve.horaPago, ve.metodoPago,
       p.nombreProducto, dve.cantidad, dve.precioUnitario, ve.totalPago,
       e.nombreEmpleado
    FROM VentasEmpleados ve
    JOIN DetalleVentaEmpleado dve ON ve.idVentaE = dve.idVentaE
    JOIN Productos p ON dve.idProducto = p.idProducto
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    ORDER BY ve.idVentaE DESC;
  `;

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener ventas del empleado:", err.sqlMessage);
      return res
        .status(500)
        .json({ error: "Error al obtener ventas del empleado" });
    }
    if (results.length === 0) {
      return res.status(200).json({msg:"No hay ventas realizadas aun"})
    }
    res.status(200).json(results);
  });
};

const obtenerLaVentaDeUnEmpleado = (req, res) => {
  const idEmpleado = req.params.idEmpleado;
  const consulta = `
    SELECT ve.idVentaE, ve.fechaPago, ve.horaPago, ve.metodoPago,
       p.nombreProducto, dve.cantidad, dve.precioUnitario, ve.totalPago,
       e.nombreEmpleado
    FROM VentasEmpleados ve
    JOIN DetalleVentaEmpleado dve ON ve.idVentaE = dve.idVentaE
    JOIN Productos p ON dve.idProducto = p.idProducto
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    where e.idEmpleado = ?
    ORDER BY ve.idVentaE DESC;
  `;

  conection.query(consulta, [idEmpleado], (err, results) => {
    if (err) {
      console.error("Error al obtener ventas del empleado:", err.sqlMessage);
      return res
        .status(500)
        .json({ error: "Error al obtener ventas del empleado" });
    }
     if (results.length === 0) {
      return res.status(200).json({msg:"El empleado no realizo ninguna venta aun"})
    }
    res.status(200).json(results);
  });
};

module.exports = {
  registrarVentaEmpleado,
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
};
