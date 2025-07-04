const { conection } = require("../config/database");

const registrarVentaEmpleado = async (req, res) => {
  try {

    const { idEmpleado ,totalPago, metodoPago, productos, recetas } = req.body;

    if (!idEmpleado) {
      return res.status(400).json({ error: "Falta el idEmpleado" });
    }

    // Validar stock
    for (const producto of productos) {
      const { idProducto, cantidad } = producto;

      const stockQuery = "SELECT stock FROM Productos WHERE idProducto = ?";
      const stockResult = await new Promise((resolve, reject) => {
        conection.query(stockQuery, [idProducto], (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        });
      });

      if (!stockResult || stockResult.stock < cantidad) {
        return res
          .status(400)
          .json({ error: `Stock insuficiente para el producto` });
      }
    }

    // Insertar venta con idEmpleado
    const consulta = `
      INSERT INTO VentasEmpleados (idEmpleado, totalPago, metodoPago)
      VALUES (?, ?, ?)
    `;
    const resultVenta = await new Promise((resolve, reject) => {
      conection.query(
        consulta,
        [idEmpleado, totalPago, metodoPago],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    const idVentaE = resultVenta.insertId;

    // Insertar detalles y actualizar stock
    for (const producto of productos) {
      const { idProducto, cantidad, precioUnitario } = producto;

      await new Promise((resolve, reject) => {
        const insertDetalleQuery = `
          INSERT INTO DetalleVentaEmpleado (idVentaE, idProducto, cantidad, precioUnitario)
          VALUES (?, ?, ?, ?)
        `;
        conection.query(
          insertDetalleQuery,
          [idVentaE, idProducto, cantidad, precioUnitario],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

      await new Promise((resolve, reject) => {
        const updateStockQuery = `
          UPDATE Productos SET stock = stock - ?
          WHERE idProducto = ? AND stock >= ?
        `;
        conection.query(
          updateStockQuery,
          [cantidad, idProducto, cantidad],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    // Insertar recetas si hay
    if (recetas && recetas.length > 0) {
      for (const receta of recetas) {
        const { idProducto, cantidad, descripcion } = receta;

        await new Promise((resolve, reject) => {
          const insertRecetaQuery = `
            INSERT INTO receta (idProducto, cantidad, descripcion)
            VALUES (?, ?, ?)
          `;
          conection.query(
            insertRecetaQuery,
            [idProducto, cantidad, descripcion || null],
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        });
      }
    }

    res.status(201).json({
      message: "Venta presencial registrada correctamente",
      idVentaE,
    });
  } catch (error) {
    console.error("Error inesperado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
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

    res.status(200).json(results);
  });
};


const obtenerLaVentaDeUnEmpleado = (req, res) => {

const idEmpleado = req.params.idEmpleado
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

    res.status(200).json(results);
  });
};

module.exports = { registrarVentaEmpleado, obtenerVentasEmpleado, obtenerLaVentaDeUnEmpleado };
