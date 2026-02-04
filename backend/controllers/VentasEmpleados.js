const { conection } = require("../config/database");

const registrarVentaEmpleado = (req, res) => {
    const { idEmpleado, totalPago, metodoPago, productos } = req.body;

    if (!idEmpleado || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    conection.beginTransaction((err) => {
        if (err) {
            console.error("Error al iniciar transacción:", err);
            return res.status(500).json({ error: "Error al iniciar venta" });
        }

        let i = 0;
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
                    i++;
                    verificarStock();
                });
            } else {
                insertarVenta();
            }
        };

        const insertarVenta = () => {
            conection.query('INSERT INTO VentasEmpleados (idEmpleado, totalPago, metodoPago, estado) VALUES (?, ?, ?, "completada")', 
                [idEmpleado, totalPago, metodoPago], 
                (err, resultVenta) => {
                    if (err) {
                        return conection.rollback(() => {
                             console.error("Error insertando venta:", err);
                             res.status(500).json({ error: "Error al registrar venta" });
                        });
                    }
                    insertarDetalles(resultVenta.insertId);
                }
            );
        };

        const insertarDetalles = (idVentaE) => {
            let j = 0;
            const procesarDetalle = () => {
                if (j < productos.length) {
                    const prod = productos[j];
                    conection.query(
                        'INSERT INTO DetalleVentaEmpleado (idVentaE, idProducto, cantidad, precioUnitario, recetaFisica) VALUES (?, ?, ?, ?, ?)',
                        [idVentaE, prod.idProducto, prod.cantidad, prod.precioUnitario, prod.recetaFisica || null],
                        (err) => {
                            if (err) {
                                return conection.rollback(() => {
                                    console.error("Error insertando detalle:", err);
                                    res.status(500).json({ error: "Error al registrar detalles" });
                                });
                            }
                            
                            conection.query('UPDATE Productos SET stock = stock - ? WHERE idProducto = ?',
                                [prod.cantidad, prod.idProducto],
                                (err) => {
                                     if (err) {
                                         return conection.rollback(() => {
                                             console.error("Error actualizando stock:", err);
                                             res.status(500).json({ error: "Error al actualizar stock" });
                                         });
                                     }
                                     j++;
                                     procesarDetalle();
                                }
                            );
                        }
                    );
                } else {
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
            procesarDetalle();
        };

        verificarStock();
    });
};

const obtenerVentasEmpleado = (req, res) => {
  // --- CORRECCIÓN: Agregamos e.apellidoEmpleado y e.dniEmpleado ---
  const consulta = `SELECT ve.idVentaE, ve.fechaPago, ve.horaPago, ve.metodoPago, ve.estado,
            ve.totalPago, e.nombreEmpleado, e.apellidoEmpleado, e.dniEmpleado
    FROM VentasEmpleados ve
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    ORDER BY ve.idVentaE DESC;
  `;

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener ventas del empleado:", err.sqlMessage);
      return res.status(500).json({ error: "Error al obtener ventas del empleado" });
    }
    if (results.length === 0) {
      return res.status(200).json({msg:"No hay ventas realizadas aun"})
    }
    res.status(200).json(results);
  });
};

const obtenerLaVentaDeUnEmpleado = (req, res) => {
  const idEmpleado = req.params.idEmpleado;
  // --- CORRECCIÓN: Agregamos e.apellidoEmpleado y e.dniEmpleado ---
  const consulta = `SELECT ve.idVentaE, ve.fechaPago, ve.horaPago, ve.metodoPago, ve.estado,
            ve.totalPago, e.nombreEmpleado, e.apellidoEmpleado, e.dniEmpleado
    FROM VentasEmpleados ve
    JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
    WHERE e.idEmpleado = ?
    ORDER BY ve.idVentaE DESC;
  `;

  conection.query(consulta, [idEmpleado], (err, results) => {
    if (err) {
      console.error("Error al obtener ventas del empleado:", err.sqlMessage);
      return res.status(500).json({ error: "Error al obtener ventas del empleado" });
    }
    if (results.length === 0) {
      return res.status(200).json({msg:"El empleado no realizo ninguna venta aun"})
    }
    res.status(200).json(results);
  });
};

const obtenerDetalleVentaEmpleado = (req, res) => {
  const { idVentaE } = req.params;
  const consulta = `
    SELECT dve.idProducto, p.nombreProducto, dve.cantidad, dve.precioUnitario
    FROM DetalleVentaEmpleado dve
    JOIN Productos p ON dve.idProducto = p.idProducto
    WHERE dve.idVentaE = ?
  `;

  conection.query(consulta, [idVentaE], (err, results) => {
    if (err) {
      console.error("Error al obtener detalle de venta:", err.sqlMessage);
      return res.status(500).json({ error: "Error al obtener detalles" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Detalles no encontrados" });
    }
    res.status(200).json(results);
  });
};

const obtenerVentasAnuladas = (req, res) => {
    // --- CORRECCIÓN: También aquí por si las dudas ---
    const consulta = `SELECT ve.idVentaE, ve.fechaPago, ve.horaPago, ve.metodoPago, ve.totalPago, ve.estado,
                e.nombreEmpleado, e.apellidoEmpleado, e.dniEmpleado
        FROM VentasEmpleados ve
        JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
        WHERE ve.estado = 'anulada'
        ORDER BY ve.idVentaE DESC
    `;

    conection.query(consulta, (err, results) => {
        if (err) {
            console.error("Error obteniendo ventas anuladas:", err);
            return res.status(500).json({ error: "Error al obtener ventas anuladas" });
        }
        res.status(200).json(results);
    });
};


const obtenerVentasCompletadas = (req, res) => {
    // --- CORRECCIÓN: También aquí por si las dudas ---
    const consulta = `SELECT ve.idVentaE, ve.fechaPago, ve.horaPago, ve.metodoPago, ve.totalPago, ve.estado,
                e.nombreEmpleado, e.apellidoEmpleado, e.dniEmpleado
        FROM VentasEmpleados ve
        JOIN Empleados e ON ve.idEmpleado = e.idEmpleado
        WHERE ve.estado = 'completada'
        ORDER BY ve.idVentaE DESC
    `;

    conection.query(consulta, (err, results) => {
        if (err) {
            console.error("Error obteniendo ventas completadas:", err);
            return res.status(500).json({ error: "Error al obtener ventas completadas" });
        }
        res.status(200).json(results);
    });
};

const updateVenta = (req, res) => {
    const idVentaE = req.params.idVentaE;
    const { totalPago, metodoPago, productos, idEmpleado } = req.body;

    if (!idVentaE || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Faltan datos para editar" });
    }

    conection.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: "Error iniciando edición" });

        conection.query('SELECT estado FROM VentasEmpleados WHERE idVentaE = ? FOR UPDATE', [idVentaE], (err, r) => {
            if (err || r.length === 0) return conection.rollback(() => res.status(404).json({ error: "Venta no encontrada" }));
            if (r[0].estado === 'anulada') return conection.rollback(() => res.status(400).json({ error: "No se puede editar venta anulada" }));

            conection.query('SELECT idProducto, cantidad FROM DetalleVentaEmpleado WHERE idVentaE = ?', [idVentaE], (err, detallesViejos) => {
                if (err) return conection.rollback(() => res.status(500).json({ error: "Error leyendo detalles anteriores" }));

                let i = 0;
                const revertirStock = () => {
                    if (i < detallesViejos.length) {
                        conection.query('UPDATE Productos SET stock = stock + ? WHERE idProducto = ?', 
                            [detallesViejos[i].cantidad, detallesViejos[i].idProducto], 
                            (err) => {
                                if (err) return conection.rollback(() => res.status(500).json({ error: "Error revirtiendo stock" }));
                                i++;
                                revertirStock();
                            }
                        );
                    } else {
                        conection.query('DELETE FROM DetalleVentaEmpleado WHERE idVentaE = ?', [idVentaE], (err) => {
                            if (err) return conection.rollback(() => res.status(500).json({ error: "Error borrando detalles viejos" }));
                            
                            conection.query('UPDATE VentasEmpleados SET totalPago = ?, metodoPago = ?, idEmpleado = ? WHERE idVentaE = ?', 
                                [totalPago, metodoPago, idEmpleado, idVentaE], 
                                (err) => {
                                    if (err) return conection.rollback(() => res.status(500).json({ error: "Error actualizando cabecera" }));
                                    insertarNuevosDetalles();
                                }
                            );
                        });
                    }
                };

                let j = 0;
                const insertarNuevosDetalles = () => {
                    if (j < productos.length) {
                        const prod = productos[j];
                        conection.query('SELECT stock FROM Productos WHERE idProducto = ?', [prod.idProducto], (err, s) => {
                             if (err || s.length === 0 || s[0].stock < prod.cantidad) {
                                 return conection.rollback(() => res.status(400).json({ error: `Stock insuficiente para editar: ID ${prod.idProducto}` }));
                             }
                             conection.query('INSERT INTO DetalleVentaEmpleado (idVentaE, idProducto, cantidad, precioUnitario) VALUES (?, ?, ?, ?)',
                                 [idVentaE, prod.idProducto, prod.cantidad, prod.precioUnitario],
                                 (err) => {
                                     if (err) return conection.rollback(() => res.status(500).json({ error: "Error insertando nuevo detalle" }));
                                     conection.query('UPDATE Productos SET stock = stock - ? WHERE idProducto = ?',
                                         [prod.cantidad, prod.idProducto],
                                         (err) => {
                                             if (err) return conection.rollback(() => res.status(500).json({ error: "Error actualizando nuevo stock" }));
                                             j++;
                                             insertarNuevosDetalles();
                                         }
                                     );
                                 }
                             );
                         });
                    } else {
                        conection.commit((err) => {
                            if (err) return conection.rollback(() => res.status(500).json({ error: "Error finalizando edición" }));
                            res.status(200).json({ message: "Venta editada correctamente" });
                        });
                    }
                };
                revertirStock();
            });
        });
    });
};

const anularVenta = (req, res) => {
    const { idVentaE } = req.params;

    conection.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: "Error al iniciar anulación" });

        conection.query('SELECT estado FROM VentasEmpleados WHERE idVentaE = ? FOR UPDATE', [idVentaE], (err, results) => {
            if (err) return conection.rollback(() => res.status(500).json({ error: "Error verificando venta" }));
            if (results.length === 0) return conection.rollback(() => res.status(404).json({ error: "Venta no encontrada" }));
            if (results[0].estado === 'anulada') return conection.rollback(() => res.status(400).json({ error: "Venta ya anulada" }));

            conection.query('SELECT idProducto, cantidad FROM DetalleVentaEmpleado WHERE idVentaE = ?', [idVentaE], (err, detalles) => {
                if (err) return conection.rollback(() => res.status(500).json({ error: "Error obteniendo detalles" }));

                let i = 0;
                const devolverStock = () => {
                    if (i < detalles.length) {
                        conection.query('UPDATE Productos SET stock = stock + ? WHERE idProducto = ?', 
                            [detalles[i].cantidad, detalles[i].idProducto], 
                            (err) => {
                                if (err) return conection.rollback(() => res.status(500).json({ error: "Error devolviendo stock" }));
                                i++;
                                devolverStock();
                            }
                        );
                    } else {
                        conection.query("UPDATE VentasEmpleados SET estado = 'anulada' WHERE idVentaE = ?", [idVentaE], (err) => {
                             if (err) return conection.rollback(() => res.status(500).json({ error: "Error actualizando estado" }));
                             conection.commit((err) => {
                                 if (err) return conection.rollback(() => res.status(500).json({ error: "Error finalizando anulación" }));
                                 res.status(200).json({ message: "Venta anulada correctamente" });
                             });
                        });
                    }
                };
                devolverStock();
            });
        });
    });
};

// --- NUEVA FUNCIÓN: REACTIVAR VENTA ---
const reactivarVenta = (req, res) => {
    const { idVentaE } = req.params;

    conection.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: "Error al iniciar reactivación" });

        // 1. Verificar estado actual
        conection.query('SELECT estado FROM VentasEmpleados WHERE idVentaE = ? FOR UPDATE', [idVentaE], (err, results) => {
            if (err) return conection.rollback(() => res.status(500).json({ error: "Error verificando venta" }));
            if (results.length === 0) return conection.rollback(() => res.status(404).json({ error: "Venta no encontrada" }));
            if (results[0].estado !== 'anulada') return conection.rollback(() => res.status(400).json({ error: "Solo se pueden reactivar ventas anuladas" }));

            // 2. Obtener productos para verificar y descontar stock
            conection.query('SELECT idProducto, cantidad FROM DetalleVentaEmpleado WHERE idVentaE = ?', [idVentaE], (err, detalles) => {
                if (err) return conection.rollback(() => res.status(500).json({ error: "Error obteniendo detalles" }));

                let i = 0;
                const verificarYDescontarStock = () => {
                    if (i < detalles.length) {
                        const prod = detalles[i];
                        // Verificar stock disponible
                        conection.query('SELECT stock FROM Productos WHERE idProducto = ?', [prod.idProducto], (err, stockRes) => {
                            if (err) return conection.rollback(() => res.status(500).json({ error: "Error consultando stock" }));
                            if (stockRes.length === 0 || stockRes[0].stock < prod.cantidad) {
                                return conection.rollback(() => res.status(400).json({ error: `Stock insuficiente para reactivar (ID Producto: ${prod.idProducto})` }));
                            }

                            // Descontar stock
                            conection.query('UPDATE Productos SET stock = stock - ? WHERE idProducto = ?', 
                                [prod.cantidad, prod.idProducto], 
                                (err) => {
                                    if (err) return conection.rollback(() => res.status(500).json({ error: "Error descontando stock" }));
                                    i++;
                                    verificarYDescontarStock();
                                }
                            );
                        });
                    } else {
                        // 3. Cambiar estado a completada
                        conection.query("UPDATE VentasEmpleados SET estado = 'completada' WHERE idVentaE = ?", [idVentaE], (err) => {
                             if (err) return conection.rollback(() => res.status(500).json({ error: "Error actualizando estado" }));
                             conection.commit((err) => {
                                 if (err) return conection.rollback(() => res.status(500).json({ error: "Error finalizando reactivación" }));
                                 res.status(200).json({ message: "Venta reactivada exitosamente" });
                             });
                        });
                    }
                };
                verificarYDescontarStock();
            });
        });
    });
};


const obtenerVentaPorId = (req, res) => {
  const { idVentaE } = req.params;
  const consulta = `
    SELECT idVentaE, totalPago, metodoPago, estado
    FROM VentasEmpleados
    WHERE idVentaE = ?
  `;
  conection.query(consulta, [idVentaE], (err, results) => {
    if (err) {
      console.error("Error al obtener venta por ID:", err.sqlMessage);
      return res.status(500).json({ error: "Error al obtener venta" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.status(200).json(results[0]);
  });
};


module.exports = {
  registrarVentaEmpleado,
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
  obtenerDetalleVentaEmpleado,
  obtenerVentasAnuladas,
  obtenerVentasCompletadas,
  updateVenta,
  anularVenta,
  reactivarVenta, // <--- EXPORTAMOS LA NUEVA FUNCIÓN
  obtenerVentaPorId
};