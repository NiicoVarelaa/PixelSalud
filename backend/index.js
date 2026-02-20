require("dotenv").config();

const { validateEnv, printEnvInfo } = require("./config/validateEnv");
validateEnv(); 
printEnvInfo(); 

const express = require("express");

const { conection } = require("./config/database");

const cors = require("cors");

const routesProductos = require("./routes/ProductosRoutes");
const routesOfertas = require("./routes/OfertasRoutes");
const routesCampanas = require("./routes/CampanasRoutes");
const routesCarrito = require("./routes/CarritoRoutes");
const routesClientes = require("./routes/ClientesRoutes");
const routesAuth = require("./routes/AuthRoutes");
const routesEmpleados = require("./routes/EmpleadosRoutes");
const routesOnlines = require("./routes/VentasOnlineRoutes");
const routesVentasEmpleados = require("./routes/VentasEmpleadosRoutes");
const favoritosRoutes = require("./routes/FavoritosRoutes");
const routesMercadoPago = require("./routes/MercadoPagoRoutes");
const routesPermisos = require("./routes/PermisosRoutes");
const routesMedicos = require("./routes/MedicosRoutes");
const routesMensajes = require("./routes/MensajesRoutes");
const routesRecetas = require("./routes/RecetasRoutes");
const routesReportes = require("./routes/ReportesRoutes");
const routesCupones = require("./routes/CuponesRoutes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL?.replace(/\/$/, ""),
      "https://pixel-salud.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      process.env.BACKEND_URL?.replace(/\/$/, ""),
    ].filter(Boolean);

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloqueado para origen: ${origin}`);
      callback(new Error(`Origen ${origin} no permitido por CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "auth", "Authorization"],
  exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a Pixel Salud ❤");
});

// Rutas sin prefijo /api (compatibilidad con frontend actual)
// TODO: Cuando refactoricemos el frontend, agregar prefijo /api
app.use("/", routesProductos);
app.use("/ofertas", routesOfertas);
app.use("/campanas", routesCampanas);
app.use("/", routesCarrito);
app.use("/", routesOnlines);
app.use("/", routesVentasEmpleados);
app.use("/", routesClientes);
app.use("/", routesAuth);
app.use("/", routesEmpleados);
app.use("/favoritos", favoritosRoutes);
app.use("/mercadopago", routesMercadoPago);
app.use("/", routesPermisos);
app.use("/", routesMedicos);
app.use("/mensajes", routesMensajes);
app.use("/", routesRecetas);
app.use("/", routesReportes);
app.use("/", routesCupones);

app.use(notFoundHandler);
app.use(errorHandler);

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
