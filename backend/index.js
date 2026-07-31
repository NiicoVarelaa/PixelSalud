require("dotenv").config();

const { validateEnv, printEnvInfo } = require("./config/validateEnv");
validateEnv();
printEnvInfo();

const { validateConfig } = require("./config/cloudinary");
validateConfig();

const express = require("express");

const { conection } = require("./config/database");

const cors = require("cors");

const routesProductos = require("./routes/ProductosRoutes");
const routesImagenesProductos = require("./routes/ImagenesProductosRoutes");
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
const routesDashboard = require("./routes/DashboardRoutes");
const routesAuditoria = require("./routes/AuditoriaRoutes");
const routesTicket = require("./routes/TicketRoutes");
const routesCloudinary = require("./routes/CloudinaryRoutes");
const routesNewsletter = require("./routes/NewsletterRoutes");
const routesHistorialOfertas = require("./routes/HistorialOfertasRoutes");
const {
  startBirthdayCouponScheduler,
} = require("./services/BirthdayCouponScheduler");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();
const API_PREFIX = "/api";

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

app.use(`${API_PREFIX}/`, routesProductos);
app.use(`${API_PREFIX}/`, routesImagenesProductos);
app.use(`${API_PREFIX}/campanas`, routesCampanas);
app.use(`${API_PREFIX}/`, routesCarrito);
app.use(`${API_PREFIX}/`, routesOnlines);
app.use(`${API_PREFIX}/`, routesVentasEmpleados);
app.use(`${API_PREFIX}/`, routesClientes);
app.use(`${API_PREFIX}/auth`, routesAuth);
app.use(`${API_PREFIX}/`, routesEmpleados);
app.use(`${API_PREFIX}/favoritos`, favoritosRoutes);
app.use(`${API_PREFIX}/mercadopago`, routesMercadoPago);
app.use(`${API_PREFIX}/`, routesPermisos);
app.use(`${API_PREFIX}/`, routesMedicos);
app.use(`${API_PREFIX}/mensajes`, routesMensajes);
app.use(`${API_PREFIX}/`, routesRecetas);
app.use(`${API_PREFIX}/`, routesReportes);
app.use(`${API_PREFIX}/`, routesCupones);
app.use(`${API_PREFIX}/admin`, routesDashboard);
app.use(`${API_PREFIX}/admin/auditoria`, routesAuditoria);
app.use(`${API_PREFIX}/ticket`, routesTicket);
app.use(`${API_PREFIX}/cloudinary`, routesCloudinary);
app.use(`${API_PREFIX}/newsletter`, routesNewsletter);
app.use(`${API_PREFIX}/`, routesHistorialOfertas);

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
    startBirthdayCouponScheduler();
  }
});
