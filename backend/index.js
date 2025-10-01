const express = require("express");
const { conection } = require("./config/database");
const cors = require("cors");
// Importa tus rutas existentes
const routesProductos = require("./routes/productos");
const routesCarrito = require("./routes/carrito");
const routesClientes = require("./routes/clientes");
const registroRouter = require("./routes/registro");
const loginRoutes = require("./routes/login");
const routesEmpleados = require("./routes/Empleados");
const routesOnlines = require("./routes/ventasOnline");
const ventasEmpleados = require("./routes/VentasEmpleados");

// Importa la nueva ruta de Mercado Pago
const routesMercadoPago = require("./routes/mercadopago"); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a Pixel Salud ❤");
});

// Usa tus rutas existentes
app.use("/", routesProductos);
app.use("/", routesCarrito);
app.use("/", routesOnlines);
app.use("/", ventasEmpleados);
app.use("/", routesClientes);
app.use("/", loginRoutes);
app.use("/", registroRouter);
app.use("/", routesEmpleados);

// Usa la nueva ruta para Mercado Pago
app.use("/mercadopago", routesMercadoPago);

conection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión a la base de datos exitosa");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error al iniciar el servidor:", err);
  } else {
    console.log("Servidor corriendo en el puerto " + PORT);
  }
});