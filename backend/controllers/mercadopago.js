require("dotenv").config();
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const { conection } = require("../config/database");
const jwt = require("jsonwebtoken");

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || req.header("auth");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Función para obtener productos de la base de datos
const getProductsByIds = (productIds) => {
  if (productIds.length === 0) return Promise.resolve([]);

  const placeholders = productIds.map(() => "?").join(", ");
  const sql = `
    SELECT 
      p.idProducto,
      p.nombreProducto,
      p.descripcion,
      p.precio AS precio,
      -- calcular precioFinal si hay oferta válida
      CASE
        WHEN o.idOferta IS NOT NULL AND o.esActiva = 1 AND NOW() BETWEEN o.fechaInicio AND o.fechaFin
        THEN p.precio * (1 - o.porcentajeDescuento / 100)
        ELSE p.precio
      END AS precioFinal,
      p.img,
      p.categoria,
      p.stock
    FROM Productos p
    LEFT JOIN ofertas o ON p.idProducto = o.idProducto
      AND o.esActiva = 1
      AND NOW() BETWEEN o.fechaInicio AND o.fechaFin
    WHERE p.idProducto IN (${placeholders});
  `;

  return new Promise((resolve, reject) => {
    conection.query(sql, productIds, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

// Función para crear venta online en la base de datos
const createVentaOnline = (ventaData) => {
  return new Promise((resolve, reject) => {
    const {
      idCliente,
      preferenceId,
      totalPago,
      customerInfo,
      estado = "pendiente",
      externalReference, // 👈 ACEPTAR externalReference
    } = ventaData;

    const sql = `
      INSERT INTO VentasOnlines (idCliente, totalPago, metodoPago, estado, fechaPago, horaPago, externalReference) 
      VALUES (?, ?, 'Mercado Pago', ?, CURRENT_DATE, CURRENT_TIME, ?) 
    `;

    conection.query(
      sql,
      [idCliente, totalPago, estado, externalReference],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      }
    );
  });
};

// Función para crear detalle de venta online
// Inserta los items de la venta online en la tabla DetalleVentaOnline
const createDetalleVentaOnline = (idVentaO, items) => {
  return new Promise((resolve, reject) => {
    if (!items || items.length === 0) {
      return resolve();
    }

    // Normaliza los campos por si vienen con id o idProducto
    const values = items.map((item) => [
      idVentaO,
      item.idProducto ?? item.id, // acepta ambos
      item.quantity,
      item.unit_price,
    ]);

    const sql = `
      INSERT INTO DetalleVentaOnline (idVentaO, idProducto, cantidad, precioUnitario)
      VALUES ?
    `;

    conection.query(sql, [values], (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

// Función para actualizar stock de productos
const updateProductStock = (items) => {
  const promises = items.map((item) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE Productos 
        SET stock = stock - ? 
        WHERE idProducto = ? AND stock >= ?
      `;

      conection.query(
        sql,
        [item.quantity, item.idProducto, item.quantity],
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  });

  return Promise.all(promises);
};

// Crear orden de pago con JWT
exports.createOrder = [
  verifyToken,
  async (req, res) => {
    const { products, customer_info, discount = 0 } = req.body;
    const userId = req.user.id;
    
    // Limpiar y validar URLs
    const frontendUrl = process.env.FRONTEND_URL?.trim();
    const backendUrl = process.env.BACKEND_URL?.trim();
    const isProduction = frontendUrl && !frontendUrl.includes('localhost');
    
    if (!frontendUrl || !frontendUrl.startsWith("http")) {
      console.error("FRONTEND_URL inválida:", process.env.FRONTEND_URL);
      return res.status(500).json({
        success: false,
        message: "Error de configuración del servidor",
        error: "FRONTEND_URL no está configurada correctamente",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron productos para la compra.",
      });
    }

    // Validar datos del cliente
    if (!customer_info || !customer_info.email) {
      return res.status(400).json({
        success: false,
        message: "Información del cliente incompleta.",
      });
    }

    const productIds = products.map((p) => p.id);
    const productQuantities = products.reduce(
      (acc, p) => ({ ...acc, [p.id]: p.quantity }),
      {}
    );

    try {
      const dbProducts = await getProductsByIds(productIds);

      if (dbProducts.length !== products.length) {
        return res.status(400).json({
          success: false,
          message: "Algunos productos no fueron encontrados.",
        });
      }

      // Verificar stock disponible
      const stockErrors = [];
      dbProducts.forEach((product) => {
        const requestedQuantity = productQuantities[product.idProducto];
        if (product.stock < requestedQuantity) {
          stockErrors.push({
            product: product.nombreProducto,
            available: product.stock,
            requested: requestedQuantity,
          });
        }
      });

      if (stockErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Stock insuficiente para algunos productos",
          errors: stockErrors,
        });
      }

      // Calcular totales
      let subtotal = 0;
      const items = dbProducts.map((product) => {
        const priceToUse = product.precioFinal || product.precio;
        const price = Number(priceToUse);
        const quantity = Number(productQuantities[product.idProducto]);
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        return {
          id: product.idProducto,
          title: product.nombreProducto,
          description: product.descripcion || product.nombreProducto,
          unit_price: price,
          quantity: quantity,
          picture_url: product.img,
          category_id: product.categoria || "general",
          currency_id: "ARS",
        };
      });

      const total = Math.max(subtotal - discount, 0);
      const externalReference = `venta_${userId}_${Date.now()}`;
      const preference = new Preference(client);

      // Construir el body de la preferencia
      const preferenceBody = {
        items,
        payer: {
          name: customer_info.name || "",
          surname: customer_info.surname || "",
          email: customer_info.email,
          phone: {
            number: customer_info.phone?.replace(/\D/g, "") || "",
          },
          address: {
            street_name: customer_info.address?.street_name || "",
            street_number: customer_info.address?.street_number || "",
            zip_code: customer_info.address?.zip_code || "",
          },
        },
        back_urls: {
          success: `${frontendUrl}/checkout/success`,
          failure: `${frontendUrl}/checkout/failure`,
          pending: `${frontendUrl}/checkout/pending`,
        },
        statement_descriptor: "PIXELSTORE",
        external_reference: externalReference,
        notification_url: `${backendUrl}/mercadopago/notifications`,
      };

      // Solo agregar auto_return si NO es localhost
      if (isProduction) {
        preferenceBody.auto_return = "approved";
      }

      console.log("DEBUG - Configuración:");
      console.log("FRONTEND_URL:", frontendUrl);
      console.log("BACKEND_URL:", backendUrl);
      console.log("Es producción:", isProduction);
      console.log("Auto return:", preferenceBody.auto_return || "disabled");
      console.log("Back URLs:", preferenceBody.back_urls);

      console.log("Creating Mercado Pago preference for user:", userId);

      const response = await preference.create({
        body: preferenceBody,
      });

      // Crear venta en la base de datos (estado pendiente)
      const idVentaO = await createVentaOnline({
        idCliente: userId,
        preferenceId: response.id,
        totalPago: total,
        customerInfo: customer_info,
        estado: "pendiente",
        externalReference: externalReference,
      });

      // Crear detalles de la venta
      await createDetalleVentaOnline(idVentaO, items);

      res.json({
        success: true,
        id: response.id,
        idVentaO: idVentaO,
        init_point: response.init_point,
        total: total,
      });
    } catch (error) {
      console.error("Error al crear la orden de Mercado Pago:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear la orden",
        error: error.message,
      });
    }
  },
];

// Webhook para recibir notificaciones de pago
exports.receiveWebhook = async (req, res) => {
  console.log("\n=== WEBHOOK RECIBIDO ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { type, data, action } = req.body;
    
    console.log("Type:", type);
    console.log("Data:", data);
    console.log("Action:", action);

    // SIEMPRE responder 200 OK primero para que MP no reintente
    res.status(200).send("OK");
    console.log("✅ Respuesta 200 OK enviada a MercadoPago");

    // Detectar webhooks de prueba de MercadoPago
    const paymentId = data?.id;
    if (paymentId === "123456" || paymentId === 123456 || paymentId === "12345678") {
      console.log("⚠️ WEBHOOK DE PRUEBA detectado - No se procesará");
      console.log("✅ Endpoint funcionando correctamente - Prueba exitosa");
      return;
    }

    // Si es una notificación de pago REAL
    if (type === "payment" && paymentId) {
      console.log(`📋 Procesando pago REAL ID: ${paymentId}`);
      
      try {
        // Obtener detalles del pago desde MercadoPago
        const payment = new Payment(client);
        console.log("🔍 Consultando API de MercadoPago...");
        
        const paymentDetails = await payment.get({ id: paymentId });
        
        console.log("📦 Detalles del pago recibidos:");
        console.log("  - Status:", paymentDetails.status);
        console.log("  - External Reference:", paymentDetails.external_reference);
        console.log("  - Transaction Amount:", paymentDetails.transaction_amount);

        const externalReference = paymentDetails.external_reference;
        
        if (!externalReference) {
          console.error("❌ No se encontró external_reference en el pago");
          return;
        }

        // PAGO APROBADO
        if (paymentDetails.status === "approved") {
          console.log(`✅ PAGO APROBADO - Referencia: ${externalReference}`);
          
          const findVentaSql = `
            SELECT vo.idVentaO, vo.idCliente, vo.estado
            FROM VentasOnlines vo
            WHERE vo.externalReference = ?
          `;

          conection.query(findVentaSql, [externalReference], async (error, results) => {
            if (error) {
              console.error("❌ Error buscando venta:", error);
              return;
            }

            console.log(`📊 Ventas encontradas: ${results.length}`);
            
            if (results.length > 0) {
              const venta = results[0];
              console.log(`📄 Venta encontrada: ID=${venta.idVentaO}, Estado=${venta.estado}`);
              
              if (venta.estado !== 'pendiente') {
                console.log(`⚠️ Venta ${venta.idVentaO} ya procesada anteriormente`);
                return;
              }
              
              const updateVentaSql = `
                UPDATE VentasOnlines 
                SET estado = 'retirado', 
                    metodoPago = 'Mercado Pago - Aprobado'
                WHERE idVentaO = ?
              `;

              conection.query(updateVentaSql, [venta.idVentaO], async (updateError) => {
                if (updateError) {
                  console.error("❌ Error actualizando venta:", updateError);
                  return;
                }
                
                console.log(`✅ Venta ${venta.idVentaO} actualizada a 'retirado'`);
                
                // Obtener detalles para actualizar stock
                const getDetallesSql = `
                  SELECT idProducto, cantidad 
                  FROM DetalleVentaOnline 
                  WHERE idVentaO = ?
                `;

                conection.query(getDetallesSql, [venta.idVentaO], async (detalleError, detalles) => {
                  if (detalleError) {
                    console.error("❌ Error obteniendo detalles:", detalleError);
                    return;
                  }

                  console.log(`📦 Productos a actualizar (${detalles.length}):`, detalles);

                  try {
                    await updateProductStock(detalles);
                    console.log(`✅ Stock actualizado exitosamente para venta ${venta.idVentaO}`);
                  } catch (stockError) {
                    console.error("❌ Error actualizando stock:", stockError);
                  }
                });
              });
            } else {
              console.log(`⚠️ No se encontró venta con referencia: ${externalReference}`);
            }
          });
          
        // PAGO RECHAZADO
        } else if (paymentDetails.status === "rejected") {
          console.log(`❌ PAGO RECHAZADO - Referencia: ${externalReference}`);
          
          const findVentaSql = `
            SELECT vo.idVentaO, vo.estado
            FROM VentasOnlines vo
            WHERE vo.externalReference = ?
          `;

          conection.query(findVentaSql, [externalReference], (error, results) => { 
            if (error) {
              console.error("❌ Error buscando venta rechazada:", error);
              return;
            }

            if (results.length > 0) {
              const venta = results[0];
              
              if (venta.estado !== 'pendiente') {
                console.log(`⚠️ Venta ${venta.idVentaO} ya procesada`);
                return;
              }
              
              const updateVentaSql = `
                UPDATE VentasOnlines 
                SET estado = 'cancelado'
                WHERE idVentaO = ?
              `;

              conection.query(updateVentaSql, [venta.idVentaO], (updateError) => {
                if (updateError) {
                  console.error("❌ Error actualizando venta rechazada:", updateError);
                } else {
                  console.log(`✅ Venta ${venta.idVentaO} marcada como 'cancelado'`);
                }
              });
            }
          });
          
        } else {
          console.log(`ℹ️ Estado del pago: ${paymentDetails.status} - Sin acción inmediata`);
        }
        
      } catch (paymentError) {
        console.error("❌ ERROR obteniendo detalles del pago:");
        console.error("  Message:", paymentError.message);
        if (paymentError.message === "Payment not found") {
          console.log("ℹ️ El pago no existe en MercadoPago (posible prueba)");
        }
      }
    } else {
      console.log(`ℹ️ Tipo de notificación: ${type} - No requiere procesamiento`);
    }

  } catch (error) {
    console.error("❌ ERROR CRÍTICO en receiveWebhook:");
    console.error("  Message:", error.message);
    console.error("  Stack:", error.stack);
  }
  
  console.log("=== FIN WEBHOOK ===\n");
};

// Obtener historial de ventas del usuario
exports.getUserOrders = [
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const sql = `
        SELECT 
          vo.idVentaO,
          vo.totalPago,
          vo.fechaPago,
          vo.horaPago,
          vo.metodoPago,
          vo.estado,
          dvo.idProducto,
          dvo.cantidad,
          dvo.precioUnitario,
          p.nombreProducto,
          p.img
        FROM VentasOnlines vo
        INNER JOIN DetalleVentaOnline dvo ON vo.idVentaO = dvo.idVentaO
        INNER JOIN Productos p ON dvo.idProducto = p.idProducto
        WHERE vo.idCliente = ? 
        ORDER BY vo.fechaPago DESC, vo.horaPago DESC
      `;

      conection.query(sql, [userId], (error, results) => {
        if (error) {
          console.error("Error fetching user orders:", error);
          return res.status(500).json({
            success: false,
            message: "Error al obtener las ventas",
          });
        }

        // Agrupar productos por venta
        const ventasMap = new Map();

        results.forEach((row) => {
          if (!ventasMap.has(row.idVentaO)) {
            ventasMap.set(row.idVentaO, {
              idVentaO: row.idVentaO,
              totalPago: row.totalPago,
              fechaPago: row.fechaPago,
              horaPago: row.horaPago,
              metodoPago: row.metodoPago,
              estado: row.estado,
              productos: [],
            });
          }

          ventasMap.get(row.idVentaO).productos.push({
            idProducto: row.idProducto,
            nombreProducto: row.nombreProducto,
            cantidad: row.cantidad,
            precioUnitario: row.precioUnitario,
            img: row.img,
          });
        });

        const ventas = Array.from(ventasMap.values());

        res.json({
          success: true,
          ventas: ventas,
        });
      });
    } catch (error) {
      console.error("Error in getUserOrders:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },
];

// Función para limpiar carrito después de una compra exitosa
exports.clearUserCart = [
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const sql = `DELETE FROM Carrito WHERE idCliente = ?`;

      conection.query(sql, [userId], (error) => {
        if (error) {
          console.error("Error clearing cart:", error);
          return res.status(500).json({
            success: false,
            message: "Error al limpiar el carrito",
          });
        }

        res.json({
          success: true,
          message: "Carrito limpiado exitosamente",
        });
      });
    } catch (error) {
      console.error("Error in clearUserCart:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },
];
