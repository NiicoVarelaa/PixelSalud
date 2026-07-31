const express = require("express");
const router = express.Router();

const {
  registrarVentaEmpleado,
  obtenerVentasEmpleado,
  obtenerLaVentaDeUnEmpleado,
  obtenerDetalleVentaEmpleado,
  obtenerVentasAnuladas,
  obtenerVentasCompletadas,
  updateVenta,
  anularVenta,
  reactivarVenta,
  obtenerVentaPorId,
  obtenerVentaParaEditar,
  obtenerVentasParaAdmin,
} = require("../controllers/VentasEmpleadosController");

const auth = require("../middlewares/Auth");
const {
  verificarRol,
  verificarPermisos,
} = require("../middlewares/VerificarPermisos");
const { validate } = require("../middlewares/validate");
const { mutationLimiter } = require("../config/rateLimiters");

const {
  idVentaEParamSchema,
  idEmpleadoParamSchema,
  createVentaEmpleadoSchema,
  updateVentaEmpleadoSchema,
} = require("../schemas/VentaEmpleadoSchemas");

router.get(
  "/ventasEmpleados",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("ver_ventasTotalesE"),
  obtenerVentasEmpleado,
);

router.get(
  "/ventasEmpleados/completas",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("ver_ventasTotalesE"),
  obtenerVentasCompletadas,
);

router.get(
  "/ventasEmpleados/anuladas",
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("ver_ventasTotalesE"),
  obtenerVentasAnuladas,
);

router.get(
  "/ventasEmpleados/detalle/:idVentaE",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idVentaEParamSchema, "params"),
  obtenerDetalleVentaEmpleado,
);

router.get(
  "/ventasEmpleados/venta/:idVentaE",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idVentaEParamSchema, "params"),
  obtenerVentaPorId,
);

router.get(
  "/ventasEmpleados/:idEmpleado",
  auth,
  verificarRol(["admin", "empleado"]),
  validate(idEmpleadoParamSchema, "params"),
  obtenerLaVentaDeUnEmpleado,
);

router.get(
  "/ventasEmpleados/admin/listado",
  auth,
  verificarRol(["admin"]),
  obtenerVentasParaAdmin,
);

router.get(
  "/ventasEmpleados/admin/detalle/:idVentaE",
  auth,
  verificarRol(["admin"]),
  validate(idVentaEParamSchema, "params"),
  obtenerVentaParaEditar,
);

router.post(
  "/ventasEmpleados/crear",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  validate(createVentaEmpleadoSchema),
  registrarVentaEmpleado,
);

router.put(
  "/ventasEmpleados/actualizar/:idVentaE",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_ventasE"),
  validate(updateVentaEmpleadoSchema),
  updateVenta,
);

router.put(
  "/ventasEmpleados/anular/:idVentaE",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_ventasE"),
  validate(idVentaEParamSchema, "params"),
  anularVenta,
);

router.put(
  "/ventasEmpleados/reactivar/:idVentaE",
  mutationLimiter,
  auth,
  verificarRol(["admin", "empleado"]),
  verificarPermisos("modificar_ventasE"),
  validate(idVentaEParamSchema, "params"),
  reactivarVenta,
);

module.exports = router;
