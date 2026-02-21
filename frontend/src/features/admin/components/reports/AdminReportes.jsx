import { useState } from "react";
import apiClient from "@utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Users,
  UserCheck,
  Activity,
  Box,
  Calendar,
  Filter,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  CreditCard,
  Tag,
  Settings,
} from "lucide-react";

const AdminReportes = () => {
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    estado: "Todos",
    metodoPago: "Todos",
    categoria: "Todas",
  });

  const [descargando, setDescargando] = useState({
    ventasOnline: false,
    ventasEmpleados: false,
    consolidado: false,
    productos: false,
  });

  // Estado para colapsar filtros en mobile
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Función para descargar reportes con feedback accesible
  const descargarReporte = async (tipo) => {
    try {
      setDescargando((prev) => ({ ...prev, [tipo]: true }));

      let url = `/reportes/${tipo}?`;
      const params = new URLSearchParams();

      if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);

      if (tipo === "ventas-online") {
        if (filtros.estado !== "Todos") params.append("estado", filtros.estado);
        if (filtros.metodoPago !== "Todos")
          params.append("metodoPago", filtros.metodoPago);
      } else if (tipo === "ventas-empleados") {
        if (filtros.estado !== "Todos") params.append("estado", filtros.estado);
        if (filtros.metodoPago !== "Todos")
          params.append("metodoPago", filtros.metodoPago);
      } else if (tipo === "productos-vendidos") {
        if (filtros.categoria !== "Todas")
          params.append("categoria", filtros.categoria);
      }

      url += params.toString();

      const response = await apiClient.get(url, {
        responseType: "blob",
      });

      // Crear blob y descargar
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      const nombreArchivo = {
        "ventas-online": "VentasOnline",
        "ventas-empleados": "VentasEmpleados",
        consolidado: "ReporteConsolidado",
        "productos-vendidos": "ProductosVendidos",
      };

      link.download = `${nombreArchivo[tipo]}_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Reporte descargado exitosamente", {
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
    } catch (error) {
      console.error("Error descargando reporte:", error);

      // Leer el mensaje de error del Blob
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        console.error("Error message from server:", text);
        try {
          const errorData = JSON.parse(text);
          console.error("Parsed error:", errorData);
        } catch {
          console.error("Could not parse error:", text);
        }
      }

      if (error.response?.status === 403) {
        toast.error("No tienes permisos para generar reportes", {
          icon: <AlertCircle className="w-5 h-5" />,
        });
      } else if (error.response?.status === 401) {
        toast.error("Sesión expirada, inicia sesión nuevamente", {
          icon: <AlertCircle className="w-5 h-5" />,
        });
      } else if (error.response?.status === 500) {
        toast.error("Error en el servidor al generar reporte", {
          icon: <AlertCircle className="w-5 h-5" />,
        });
      } else {
        toast.error("Error al descargar el reporte", {
          icon: <AlertCircle className="w-5 h-5" />,
        });
      }
    } finally {
      setDescargando((prev) => ({ ...prev, [tipo]: false }));
    }
  };

  // Función para establecer fechas rápidas
  const establecerRangoFecha = (tipo) => {
    const hoy = new Date();
    let desde = new Date();

    switch (tipo) {
      case "hoy":
        desde = hoy;
        break;
      case "semana":
        desde.setDate(hoy.getDate() - 7);
        break;
      case "mes":
        desde.setMonth(hoy.getMonth() - 1);
        break;
      case "trimestre":
        desde.setMonth(hoy.getMonth() - 3);
        break;
      case "año":
        desde.setFullYear(hoy.getFullYear() - 1);
        break;
      default:
        desde = null;
    }

    if (desde) {
      setFiltros({
        ...filtros,
        fechaDesde: desde.toISOString().split("T")[0],
        fechaHasta: hoy.toISOString().split("T")[0],
      });
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaDesde: "",
      fechaHasta: "",
      estado: "Todos",
      metodoPago: "Todos",
      categoria: "Todas",
    });
  };

  const reportes = [
    {
      id: "ventas-online",
      titulo: "Ventas Online",
      descripcion:
        "Ventas realizadas por clientes en la plataforma web con análisis detallado",
      icono: Users,
      color: "from-blue-500 to-cyan-500",
      colorText: "text-blue-600",
      bgColor: "bg-blue-50",
      checkColor: "text-blue-500",
      borderColor: "",
      hoverColor: "",
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
      colorText: "text-purple-600",
      bgColor: "bg-purple-50",
      checkColor: "text-purple-500",
      borderColor: "",
      hoverColor: "",
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
      colorText: "text-green-700",
      bgColor: "bg-green-50",
      checkColor: "text-green-600",
      borderColor: "",
      hoverColor: "",
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
      colorText: "text-orange-600",
      bgColor: "bg-orange-50",
      checkColor: "text-orange-500",
      borderColor: "",
      hoverColor: "",
      incluye: [
        "Unidades vendidas por producto",
        "Ingresos por categoría",
        "Ventas por canal (online/local)",
        "Alertas de stock bajo",
        "Análisis de rentabilidad",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header - Mobile First - Verde farmacia */}
      <header
        role="banner"
        className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg"
      >
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0">
              <FileText
                className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-md">
                Reportes y Análisis
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-1 sm:mt-2 font-medium drop-shadow">
                Genera informes exportables en Excel con análisis detallados de
                ventas y productos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Sección de Filtros - Colapsable en Mobile - Mejorado */}
        <section aria-labelledby="filtros-heading" className="mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header de Filtros - Siempre visible */}
            <button
              onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
              className="w-full px-4 sm:px-6 py-5 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset cursor-pointer group"
              aria-expanded={filtrosAbiertos}
              aria-controls="filtros-content"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Filter
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h2
                    id="filtros-heading"
                    className="text-lg sm:text-xl font-bold text-gray-900"
                  >
                    Filtros de Búsqueda
                  </h2>
                  {(filtros.fechaDesde ||
                    filtros.fechaHasta ||
                    filtros.estado !== "Todos" ||
                    filtros.metodoPago !== "Todos" ||
                    filtros.categoria !== "Todas") && (
                    <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-md animate-pulse">
                      {
                        [
                          filtros.fechaDesde && "Fecha",
                          filtros.estado !== "Todos" && "Estado",
                          filtros.metodoPago !== "Todos" && "Pago",
                          filtros.categoria !== "Todas" && "Categoría",
                        ].filter(Boolean).length
                      }{" "}
                      Activo(s)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-green-600 hidden sm:inline">
                  {filtrosAbiertos ? "Ocultar" : "Mostrar"}
                </span>
                {filtrosAbiertos ? (
                  <ChevronUp
                    className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>

            {/* Contenido de Filtros - Colapsable */}
            <div
              id="filtros-content"
              className={`transition-all duration-300 ease-in-out ${
                filtrosAbiertos
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-4 sm:px-6 pb-6 space-y-6 mt-3">
                {/* Rangos Rápidos */}
                <div>
                  <label
                    id="rangos-rapidos-label"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3"
                  >
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    Rangos Rápidos
                  </label>
                  <div
                    role="group"
                    aria-labelledby="rangos-rapidos-label"
                    className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2"
                  >
                    {[
                      { key: "hoy", label: "Hoy" },
                      { key: "semana", label: "Última Semana" },
                      { key: "mes", label: "Último Mes" },
                      { key: "trimestre", label: "Último Trimestre" },
                      { key: "año", label: "Último Año" },
                    ].map((rango) => (
                      <button
                        key={rango.key}
                        onClick={() => establecerRangoFecha(rango.key)}
                        className="min-h-[44px] px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors text-sm font-medium cursor-pointer"
                        aria-label={`Seleccionar rango de ${rango.label.toLowerCase()}`}
                      >
                        {rango.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de Filtros - Mobile First */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Fecha Desde */}
                  <div>
                    <label
                      htmlFor="fecha-desde"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
                    >
                      <CalendarDays className="w-4 h-4 text-green-600" />
                      Fecha Desde
                    </label>
                    <div className="relative">
                      <input
                        id="fecha-desde"
                        type="date"
                        value={filtros.fechaDesde}
                        onChange={(e) =>
                          setFiltros({ ...filtros, fechaDesde: e.target.value })
                        }
                        className="w-full min-h-[44px] px-4 py-3 pl-12 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                        aria-describedby="fecha-desde-desc"
                      />
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span id="fecha-desde-desc" className="sr-only">
                      Selecciona la fecha inicial del rango
                    </span>
                  </div>

                  {/* Fecha Hasta */}
                  <div>
                    <label
                      htmlFor="fecha-hasta"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
                    >
                      <CalendarDays className="w-4 h-4 text-green-600" />
                      Fecha Hasta
                    </label>
                    <div className="relative">
                      <input
                        id="fecha-hasta"
                        type="date"
                        value={filtros.fechaHasta}
                        onChange={(e) =>
                          setFiltros({ ...filtros, fechaHasta: e.target.value })
                        }
                        className="w-full min-h-[44px] px-4 py-3 pl-12 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                        aria-describedby="fecha-hasta-desc"
                      />
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span id="fecha-hasta-desc" className="sr-only">
                      Selecciona la fecha final del rango
                    </span>
                  </div>

                  {/* Estado */}
                  <div>
                    <label
                      htmlFor="estado-filter"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
                    >
                      <Settings className="w-4 h-4 text-green-600" />
                      Estado
                    </label>
                    <div className="relative">
                      <select
                        id="estado-filter"
                        value={filtros.estado}
                        onChange={(e) =>
                          setFiltros({ ...filtros, estado: e.target.value })
                        }
                        className="w-full min-h-[44px] px-4 py-3 pl-12 pr-10 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg appearance-none cursor-pointer"
                        aria-label="Filtrar por estado de la venta"
                      >
                        <option value="Todos">Todos los Estados</option>
                        <optgroup label="Ventas Online">
                          <option value="pendiente">Pendiente</option>
                          <option value="retirado">Retirado</option>
                          <option value="cancelado">Cancelado</option>
                        </optgroup>
                        <optgroup label="Ventas Empleados">
                          <option value="completada">Completada</option>
                          <option value="anulada">Anulada</option>
                        </optgroup>
                      </select>
                      <Settings className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <label
                      htmlFor="metodo-pago-filter"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
                    >
                      <CreditCard className="w-4 h-4 text-green-600" />
                      Método de Pago
                    </label>
                    <div className="relative">
                      <select
                        id="metodo-pago-filter"
                        value={filtros.metodoPago}
                        onChange={(e) =>
                          setFiltros({ ...filtros, metodoPago: e.target.value })
                        }
                        className="w-full min-h-[44px] px-4 py-3 pl-12 pr-10 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg appearance-none cursor-pointer"
                        aria-label="Filtrar por método de pago"
                      >
                        <option value="Todos">Todos los Métodos</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Mercado Pago">Mercado Pago</option>
                      </select>
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Categoría */}
                  <div>
                    <label
                      htmlFor="categoria-filter"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
                    >
                      <Tag className="w-4 h-4 text-green-600" />
                      Categoría
                    </label>
                    <div className="relative">
                      <select
                        id="categoria-filter"
                        value={filtros.categoria}
                        onChange={(e) =>
                          setFiltros({ ...filtros, categoria: e.target.value })
                        }
                        className="w-full min-h-[44px] px-4 py-3 pl-12 pr-10 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg appearance-none cursor-pointer"
                        aria-label="Filtrar por categoría de producto"
                      >
                        <option value="Todas">Todas las Categorías</option>
                        <option value="Fragancias">Fragancias</option>
                        <option value="Belleza">Belleza</option>
                        <option value="Dermocosmética">Dermocosmética</option>
                        <option value="Medicamentos con Receta">
                          Medicamentos con Receta
                        </option>
                        <option value="Medicamentos Venta Libre">
                          Medicamentos Venta Libre
                        </option>
                        <option value="Cuidado Personal">
                          Cuidado Personal
                        </option>
                        <option value="Bebes y Niños">Bebés y Niños</option>
                      </select>
                      <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Botón Limpiar Filtros */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={limpiarFiltros}
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 transition-colors text-sm font-medium cursor-pointer"
                    aria-label="Limpiar todos los filtros aplicados"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Reportes - Mobile First */}
        <section
          aria-labelledby="reportes-heading"
          className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-6"
        >
          <h2 id="reportes-heading" className="sr-only">
            Tipos de reportes disponibles
          </h2>

          {reportes.map((reporte) => {
            const IconComponent = reporte.icono;
            const estaDescargando = descargando[reporte.id];

            return (
              <article
                key={reporte.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2`}
                aria-labelledby={`reporte-${reporte.id}-titulo`}
              >
                {/* Header del reporte */}
                <div className={`bg-gradient-to-r ${reporte.color} p-6 sm:p-8`}>
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0"
                      aria-hidden="true"
                    >
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        id={`reporte-${reporte.id}-titulo`}
                        className="text-xl sm:text-2xl font-bold text-white leading-tight"
                      >
                        {reporte.titulo}
                      </h3>
                      <p className="text-white/90 text-sm sm:text-base mt-2 leading-relaxed">
                        {reporte.descripcion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contenido del reporte */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2
                      className={`w-5 h-5 ${reporte.checkColor}`}
                      aria-hidden="true"
                    />
                    Incluye:
                  </h4>
                  <ul
                    className="space-y-2 mb-6"
                    aria-label={`Características incluidas en ${reporte.titulo}`}
                  >
                    {reporte.incluye.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${reporte.checkColor} flex-shrink-0 mt-0.5`}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Botón de descarga - accesible */}
                  <button
                    onClick={() => descargarReporte(reporte.id)}
                    disabled={estaDescargando}
                    className={`w-full min-h-[48px] py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ${
                      estaDescargando
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : `bg-gradient-to-r ${reporte.color} text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer`
                    }`}
                    aria-label={`Descargar reporte de ${reporte.titulo} en formato Excel`}
                    aria-busy={estaDescargando}
                    aria-live="polite"
                  >
                    {estaDescargando ? (
                      <>
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" aria-hidden="true" />
                        <span>Descargar Excel</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Información adicional */}
        <aside
          aria-labelledby="info-adicional"
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <FileText
              className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <h4
                id="info-adicional"
                className="font-semibold text-blue-900 mb-2 text-base sm:text-lg"
              >
                Información sobre los reportes
              </h4>
              <p className="text-blue-800 text-sm sm:text-base leading-relaxed">
                Los reportes se generan en formato Excel (.xlsx) con tablas
                formateadas profesionalmente, estadísticas detalladas y análisis
                comparativos. Aplica filtros antes de descargar para
                personalizar los datos según tus necesidades. Incluyen formato
                condicional, rankings y múltiples hojas de datos.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default AdminReportes;
