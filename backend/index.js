const express = require("express");

const { conection } = require("./config/database");

const cors = require("cors");

const routesProductos = require("./routes/productos");
const routesCarrito = require("./routes/carrito");
const routesClientes = require("./routes/clientes");
const registroRouter = require("./routes/registro");
const loginRoutes = require("./routes/login");
const routesEmpleados = require("./routes/Empleados");
const routesOnlines = require("./routes/ventasOnline");
const ventasEmpleados = require("./routes/VentasEmpleados");
const favoritosRoutes = require('./routes/favoritos');
const routesMercadoPago = require("./routes/mercadopago");
const mensajesRoutes = require('./routes/mensajes'); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a Pixel Salud ❤");
});

app.use("/", routesProductos);
app.use("/", routesCarrito);
app.use("/", routesOnlines);
app.use("/", ventasEmpleados);
app.use("/", routesClientes);
app.use("/", loginRoutes);
app.use("/", registroRouter);
app.use("/", routesEmpleados);
app.use('/favoritos', favoritosRoutes); 
app.use("/mercadopago", routesMercadoPago);
app.use('/mensajes', mensajesRoutes);

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