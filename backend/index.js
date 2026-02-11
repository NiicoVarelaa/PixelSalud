require("dotenv").config();
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
const favoritosRoutes = require("./routes/favoritos");
const routesMercadoPago = require("./routes/mercadopago");
const routesPermisos = require("./routes/permisos");
const routesMedicos = require("./routes/medicos");
const mensajesRoutes = require("./routes/mensajes");
const routesRecetas = require("./routes/recetas");
const routesReportes = require("./routes/reportes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a Pixel Salud ❤");
});

app.use("/api", routesProductos);
app.use("/api", routesCarrito);
app.use("/api", routesOnlines);
app.use("/api", ventasEmpleados);
app.use("/api", routesClientes);
app.use("/api", loginRoutes);
app.use("/api", registroRouter);
app.use("/api", routesEmpleados);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/mercadopago", routesMercadoPago);
app.use("/api", routesPermisos);
app.use("/api", routesMedicos);
app.use("/api/mensajes", mensajesRoutes);
app.use("/api", routesRecetas);
app.use("/api", routesReportes);

// Middleware de manejo de errores (DEBE IR AL FINAL, después de todas las rutas)
app.use(notFoundHandler); // Maneja rutas no encontradas (404)
app.use(errorHandler); // Maneja todos los errores de forma centralizada

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
