import { Users, UserCheck, Activity, Box } from "lucide-react";

/**
 * Configuración de reportes disponibles
 * @constant {Array<Object>}
 */
export const REPORTS_CONFIG = [
  {
    id: "ventas-online",
    titulo: "Ventas Online",
    descripcion:
      "Ventas realizadas por clientes en la plataforma web con análisis detallado",
    icono: Users,
    color: "from-blue-500 to-cyan-500",
    checkColor: "text-blue-500",
    incluye: [
      "Datos completos del cliente",
      "Detalle de productos vendidos",
      "Estados y métodos de pago",
      "Estadísticas de ingresos",
      "Filtros por fecha y estado",
    ],
  },
  {
    id: "ventas-empleados",
    titulo: "Ventas Empleados",
    descripcion:
      "Análisis detallado de ventas realizadas por los empleados en el local",
    icono: UserCheck,
    color: "from-purple-500 to-violet-500",
    checkColor: "text-purple-500",
    incluye: [
      "Ranking de mejores vendedores",
      "Ventas por empleado",
      "Productos más vendidos",
      "Análisis de desempeño",
      "Comparativas de rendimiento",
    ],
  },
  {
    id: "consolidado",
    titulo: "Reporte Consolidado",
    descripcion:
      "Vista integral combinando todas las ventas con análisis comparativo",
    icono: Activity,
    color: "from-green-700 to-emerald-400",
    checkColor: "text-green-600",
    incluye: [
      "Comparativa por canal de venta",
      "Top 20 productos más vendidos",
      "Estadísticas consolidadas",
      "Análisis de rendimiento global",
      "Múltiples hojas de datos",
    ],
  },
  {
    id: "productos-vendidos",
    titulo: "Productos Vendidos",
    descripcion:
      "Análisis detallado del comportamiento de los productos y categorías",
    icono: Box,
    color: "from-orange-500 to-amber-500",
    checkColor: "text-orange-500",
    incluye: [
      "Unidades vendidas por producto",
      "Ingresos por categoría",
      "Ventas por canal (online/local)",
      "Alertas de stock bajo",
      "Análisis de rentabilidad",
    ],
  },
];

/**
 * Rangos de fecha predefinidos
 * @constant {Array<Object>}
 */
export const DATE_RANGES = [
  { key: "hoy", label: "Hoy" },
  { key: "semana", label: "Última Semana" },
  { key: "mes", label: "Último Mes" },
  { key: "trimestre", label: "Último Trimestre" },
  { key: "año", label: "Último Año" },
];

/**
 * Valores iniciales de filtros
 * @constant {Object}
 */
export const INITIAL_FILTERS = {
  fechaDesde: "",
  fechaHasta: "",
  estado: "Todos",
  metodoPago: "Todos",
  categoria: "Todas",
};

/**
 * Mapeo de tipos de reporte a nombres de archivo
 * @constant {Object}
 */
export const REPORT_FILE_NAMES = {
  "ventas-online": "VentasOnline",
  "ventas-empleados": "VentasEmpleados",
  consolidado: "ReporteConsolidado",
  "productos-vendidos": "ProductosVendidos",
};
