require("dotenv").config();
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const { conection } = require("../config/database");

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Función para obtener productos de la base de datos
const getProductsByIds = (productIds) => {
  // Maneja el caso en que no se pasen IDs, para evitar un error en la consulta SQL
  if (productIds.length === 0) {
    return Promise.resolve([]);
  }

  const placeholders = productIds.map(() => "?").join(", ");
  const sql = `SELECT idProducto, nombreProducto, descripcion, precio, img, categoria, stock 
               FROM productos 
               WHERE idProducto IN (${placeholders})`;

  return new Promise((resolve, reject) => {
    conection.query(sql, productIds, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

// Crear orden de pago
exports.createOrder = async (req, res) => {
  // Ahora esperamos un array de 'products' con 'id' y 'quantity'
  const { products, customer_info } = req.body;

  if (!products || products.length === 0) {
    return res
      .status(400)
      .json({ message: "No se proporcionaron productos para la compra." });
  }

  // Extraer los IDs de los productos para la consulta a la base de datos
  const productIds = products.map((p) => p.id);
  // Crear un mapa para acceder fácilmente a la cantidad de cada producto
  const productQuantities = products.reduce(
    (acc, p) => ({ ...acc, [p.id]: p.quantity }),
    {}
  );

  try {
    const dbProducts = await getProductsByIds(productIds);

    // Mapear los productos de la base de datos al formato de Mercado Pago
    const items = dbProducts.map((product) => ({
      id: product.idProducto,
      title: product.nombreProducto,
      description: product.descripcion,
      unit_price: Number(product.precio),
      quantity: Number(productQuantities[product.idProducto]), // Usamos la cantidad del frontend
      picture_url: product.img,
      category_id: product.categoria,
    }));

    const preference = new Preference(client);

    const preferenceBody = {
      items,
      payer: {
        name: customer_info?.name,
        surname: customer_info?.surname,
        email: customer_info?.email,
      },
      back_urls: {
        success: "https://xxxx.ngrok.io/mis-compras?status=success",
        failure: "https://xxxx.ngrok.io/checkout?status=failure",
        pending: "https://xxxx.ngrok.io/checkout?status=pending",
      },
      auto_return: "approved",
    };

    console.log("Preference enviada a Mercado Pago:", JSON.stringify(preferenceBody, null, 2));

    const response = await preference.create({
      body: preferenceBody,
    });

    res.json({ id: response.id });
  } catch (error) {
    console.error("Error al crear la orden de Mercado Pago:", error);
    res.status(500).json({ message: "Error al crear la orden" });
  }
};

// Webhook para recibir notificaciones de pago
exports.receiveWebhook = async (req, res) => {
  const topic = req.query.topic;
  const paymentId = req.query.id;

  if (topic === "payment") {
    try {
      const payment = new Payment(client);
      const result = await payment.get({ id: paymentId });

      if (result.status === "approved") {
        console.log(`Pago aprobado para el ID de pago: ${paymentId}`);
        // Aquí puedes actualizar tu base de datos con el estado de la orden
      }
    } catch (error) {
      console.error(
        "Error al procesar la notificación de Mercado Pago:",
        error
      );
    }
  }

  res.status(200).send("OK");
};