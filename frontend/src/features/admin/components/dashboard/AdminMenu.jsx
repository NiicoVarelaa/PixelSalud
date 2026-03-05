import { useState, useEffect } from "react";
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import apiClient from "@utils/apiClient";
import { toast } from "react-toastify";

const AdminMenu = () => {
  const [dashboardData, setDashboardData] = useState({
    ventasHoy: { total: 0, transacciones: 0 },
    ventasSemana: { total: 0 },
    productos: { total: 0, activos: 0, stockBajo: 0 },
    productosMasVendidos: [],
    ticketPromedio: 0,
    loading: true,
    error: null,
  });

  const [chartData, setChartData] = useState({
    ventasPorDia: [],
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

        const response = await apiClient.get("/admin/dashboard/metricas");

        if (response.data.success) {
          const { data } = response.data;

          setDashboardData({
            ventasHoy: data.ventasHoy,
            ventasSemana: data.ventasSemana,
            productos: data.productos,
            productosMasVendidos: data.productosMasVendidos || [],
            ticketPromedio: data.ticketPromedio || 0,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error al cargar métricas del dashboard:", error);
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error: "No se pudieron cargar las métricas",
        }));
        toast.error("Error al cargar las métricas del dashboard");
      }
    };

    fetchDashboardMetrics();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setChartData((prev) => ({ ...prev, loading: true }));

        const response = await apiClient.get(
          "/admin/dashboard/grafico-ventas?dias=7",
        );

        if (response.data.success) {
          const { datos } = response.data.data;

          const formattedData = datos.map((venta) => ({
            fecha: new Date(venta.fecha).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
            }),
            total: venta.total,
            transacciones: venta.transacciones,
          }));

          setChartData({
            ventasPorDia: formattedData,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error al cargar datos del gráfico:", error);
        setChartData({ ventasPorDia: [], loading: false });
      }
    };

    fetchChartData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-green-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
      >
        Saltar al contenido principal
      </a>

      {/* Main content wrapper */}
      <div
        className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-7xl mx-auto"
        id="main-content"
      >
        {/* Header Section - Mobile Optimized */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title Group */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Panel de control y métricas principales
              </p>
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {dashboardData.error && (
          <div
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-red-800 text-sm font-semibold">
                  Error al cargar datos
                </p>
                <p className="text-red-700 text-sm mt-1">
                  {dashboardData.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Cards Section - Mobile First Grid */}
        <section className="mb-8 sm:mb-10" aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="sr-only">
            Métricas principales del dashboard
          </h2>

          {/* Grid: 1 column mobile, 2 columns tablet, 3 columns desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1: Ventas Hoy - Verde/Naranja Principal */}
            <article
              className="group bg-white rounded-2xl p-5 sm:p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl hover:border-orange-500 hover:-translate-y-1 focus-within:ring-4 focus-within:ring-orange-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="ventas-hoy-title"
              tabIndex="0"
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.currentTarget.focus();
                }
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p
                    id="ventas-hoy-title"
                    className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider mb-1"
                  >
                    Ventas Hoy
                  </p>
                </div>
                <div
                  className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <DollarSign
                    className="w-6 h-6 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {dashboardData.loading ? (
                <div className="space-y-3">
                  <div
                    className="h-8 sm:h-10 bg-gray-200 animate-pulse rounded-lg"
                    aria-label="Cargando ventas de hoy"
                  ></div>
                  <div
                    className="h-4 w-24 bg-gray-200 animate-pulse rounded"
                    aria-hidden="true"
                  ></div>
                </div>
              ) : (
                <>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-word">
                    {formatCurrency(dashboardData.ventasHoy.total)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Activity
                      className="w-4 h-4 text-orange-600"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold text-gray-600">
                      {dashboardData.ventasHoy.transacciones}{" "}
                      {dashboardData.ventasHoy.transacciones === 1
                        ? "transacción"
                        : "transacciones"}
                    </p>
                  </div>
                </>
              )}
            </article>

            {/* Card 2: Ventas Semana - Verde Principal */}
            <article
              className="group bg-white rounded-2xl p-5 sm:p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl hover:border-green-500 hover:-translate-y-1 focus-within:ring-4 focus-within:ring-green-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="ventas-semana-title"
              tabIndex="0"
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.currentTarget.focus();
                }
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p
                    id="ventas-semana-title"
                    className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider mb-1"
                  >
                    Ventas Semana
                  </p>
                </div>
                <div
                  className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-linear-to-br from-green-600 to-green-700 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <TrendingUp
                    className="w-6 h-6 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {dashboardData.loading ? (
                <div
                  className="h-8 sm:h-10 bg-gray-200 animate-pulse rounded-lg"
                  aria-label="Cargando ventas de la semana"
                ></div>
              ) : (
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-word">
                  {formatCurrency(dashboardData.ventasSemana.total)}
                </p>
              )}
            </article>

            {/* Card 3: Productos */}
            <article
              className="group bg-white rounded-2xl p-5 sm:p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl hover:border-secondary-500 hover:-translate-y-1 focus-within:ring-4 focus-within:ring-secondary-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="productos-title"
              tabIndex="0"
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.currentTarget.focus();
                }
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p
                    id="productos-title"
                    className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider mb-1"
                  >
                    Productos
                  </p>
                </div>
                <div
                  className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-linear-to-br from-secondary-700 to-secondary-800 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {dashboardData.loading ? (
                <div className="space-y-3">
                  <div
                    className="h-8 sm:h-10 bg-gray-200 animate-pulse rounded-lg"
                    aria-label="Cargando total de productos"
                  ></div>
                  <div
                    className="h-6 w-32 bg-gray-200 animate-pulse rounded-lg"
                    aria-hidden="true"
                  ></div>
                </div>
              ) : (
                <>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 break-word">
                    {dashboardData.productos.activos}
                  </p>
                  {dashboardData.productos.stockBajo > 0 && (
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg"
                      role="status"
                      aria-live="polite"
                    >
                      <AlertCircle
                        className="w-3.5 h-3.5 text-secondary-700 shrink-0"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-bold text-secondary-800">
                        {dashboardData.productos.stockBajo} Stock bajo
                      </p>
                    </div>
                  )}
                </>
              )}
            </article>
          </div>
        </section>

        {/* Charts Section - Mobile Optimized */}
        <section aria-labelledby="charts-heading" className="mb-8 sm:mb-10">
          <h2
            id="charts-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6"
          >
            Análisis de Ventas
          </h2>

          {/* Grid: 1 column mobile, 2 columns large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Chart 1: Line Chart - Ventas */}
            <article
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg focus-within:ring-4 focus-within:ring-green-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="chart-ventas-title"
            >
              <div className="mb-5">
                <h3
                  id="chart-ventas-title"
                  className="text-lg sm:text-xl font-bold text-gray-900 mb-1"
                >
                  Ventas Últimos 7 Días
                </h3>
                <p className="text-sm text-gray-600">
                  Evolución de ingresos diarios
                </p>
              </div>

              {chartData.loading ? (
                <div
                  className="h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-gray-50 rounded-xl"
                  aria-live="polite"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium text-sm">
                      Cargando datos...
                    </p>
                  </div>
                </div>
              ) : chartData.ventasPorDia.length === 0 ? (
                <div
                  className="h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                  role="status"
                >
                  <div className="flex flex-col items-center gap-3 px-4 text-center">
                    <TrendingUp
                      className="w-12 h-12 text-gray-400"
                      aria-hidden="true"
                    />
                    <p className="text-gray-600 font-semibold">
                      No hay datos disponibles
                    </p>
                    <p className="text-sm text-gray-500">
                      Los datos aparecerán cuando haya ventas registradas
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  role="img"
                  aria-label="Gráfico de línea mostrando ventas de los últimos 7 días"
                  className="h-64 sm:h-72 lg:h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.ventasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="fecha"
                        stroke="#6b7280"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tick={{ fill: "#6b7280" }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tick={{ fill: "#6b7280" }}
                        tickFormatter={(value) =>
                          `$${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#16a34a",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          padding: "12px 16px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                        formatter={(value) =>
                          new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          }).format(value)
                        }
                        labelStyle={{ fontWeight: 700, marginBottom: "4px" }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: "16px" }}
                        iconType="circle"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#16a34a"
                        strokeWidth={3}
                        name="Ventas"
                        dot={{
                          fill: "#16a34a",
                          r: 5,
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 7, strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>

            {/* Chart 2: Bar Chart - Transacciones */}
            <article
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg focus-within:ring-4 focus-within:ring-orange-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="chart-transacciones-title"
            >
              <div className="mb-5">
                <h3
                  id="chart-transacciones-title"
                  className="text-lg sm:text-xl font-bold text-gray-900 mb-1"
                >
                  Transacciones por Día
                </h3>
                <p className="text-sm text-gray-600">
                  Cantidad de operaciones realizadas
                </p>
              </div>

              {chartData.loading ? (
                <div
                  className="h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-gray-50 rounded-xl"
                  aria-live="polite"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium text-sm">
                      Cargando datos...
                    </p>
                  </div>
                </div>
              ) : chartData.ventasPorDia.length === 0 ? (
                <div
                  className="h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                  role="status"
                >
                  <div className="flex flex-col items-center gap-3 px-4 text-center">
                    <ShoppingBag
                      className="w-12 h-12 text-gray-400"
                      aria-hidden="true"
                    />
                    <p className="text-gray-600 font-semibold">
                      No hay datos disponibles
                    </p>
                    <p className="text-sm text-gray-500">
                      Los datos aparecerán cuando haya transacciones registradas
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  role="img"
                  aria-label="Gráfico de barras mostrando transacciones por día"
                  className="h-64 sm:h-72 lg:h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.ventasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="fecha"
                        stroke="#6b7280"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tick={{ fill: "#6b7280" }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tick={{ fill: "#6b7280" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f97316",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          padding: "12px 16px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                        labelStyle={{ fontWeight: 700, marginBottom: "4px" }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: "16px" }}
                        iconType="rect"
                      />
                      <Bar
                        dataKey="transacciones"
                        fill="#f97316"
                        name="Transacciones"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>
          </div>
        </section>

        {/* Top Products Section - Mobile First */}
        <section aria-labelledby="top-products-heading" className="mb-6">
          <h2
            id="top-products-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6"
          >
            Productos Más Vendidos
          </h2>

          {dashboardData.loading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              aria-label="Cargando productos"
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 animate-pulse"
                  aria-hidden="true"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : dashboardData.productosMasVendidos.length === 0 ? (
            <div
              className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-10 sm:p-12 text-center"
              role="status"
            >
              <ShoppingBag
                className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-gray-700 text-base sm:text-lg font-bold mb-2">
                No hay datos de ventas
              </p>
              <p className="text-gray-500 text-sm">
                Los productos aparecerán aquí cuando se registren ventas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {dashboardData.productosMasVendidos
                .slice(0, 6)
                .map((producto, index) => (
                  <article
                    key={producto.idProducto}
                    className="group bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-green-300 hover:-translate-y-1 focus-within:ring-4 focus-within:ring-green-200 focus-within:ring-offset-2 transition-all duration-300"
                    tabIndex="0"
                    role="button"
                    aria-label={`Producto ${index + 1}: ${producto.nombre}, ${producto.cantidadVendida} vendidos, ingreso total ${formatCurrency(producto.ingresoTotal)}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.currentTarget.focus();
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Product Image */}
                      <div className="shrink-0">
                        <img
                          src={producto.imagen}
                          alt=""
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-gray-100 group-hover:border-green-200 group-hover:scale-105 transition-all duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 leading-snug">
                          {producto.nombre}
                        </h3>

                        {/* Sales Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 border border-green-200 text-green-800 text-xs font-bold rounded-lg mb-2">
                          <ShoppingBag
                            className="w-3.5 h-3.5"
                            aria-hidden="true"
                          />
                          <span>{producto.cantidadVendida} vendidos</span>
                        </div>

                        {/* Revenue */}
                        <p className="text-sm sm:text-base font-bold text-gray-900 mt-1">
                          {formatCurrency(producto.ingresoTotal)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminMenu;
