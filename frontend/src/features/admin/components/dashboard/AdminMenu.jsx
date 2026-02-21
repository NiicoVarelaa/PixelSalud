import { useState, useEffect } from "react";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
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
    clientesActivos: 0,
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
            clientesActivos: data.clientesActivos,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/20">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
      >
        Saltar al contenido principal
      </a>

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="main-content">
        <header className="mb-8 sm:mb-10">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                Dashboard Analytics
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-2 leading-relaxed">
                Panel de control y métricas principales
              </p>
            </div>

            <div
              className="flex items-center gap-2.5 text-sm text-gray-700 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 w-fit"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
              </span>
              <span className="font-medium">
                {dashboardData.loading ? "Cargando datos..." : "Datos actualizados"}
              </span>
            </div>
          </div>
        </header>

        {dashboardData.error && (
          <div
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-red-800 text-sm font-medium">{dashboardData.error}</p>
            </div>
          </div>
        )}

        <section className="mb-10 sm:mb-14" aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="sr-only">
            Métricas principales del dashboard
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article
              className="group relative bg-gradient-to-br from-secondary-50 to-secondary-100/60 rounded-2xl p-6 border-2 border-secondary-200/60 shadow-sm hover:shadow-lg hover:border-secondary-300 focus-within:ring-4 focus-within:ring-secondary-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="ventas-hoy-title"
              tabIndex="0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    id="ventas-hoy-title"
                    className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Ventas Hoy
                  </p>
                  {dashboardData.loading ? (
                    <div className="h-10 w-36 bg-secondary-200/60 animate-pulse rounded-lg" aria-label="Cargando ventas de hoy"></div>
                  ) : (
                    <>
                      <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 break-words">
                        {formatCurrency(dashboardData.ventasHoy.total)}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {dashboardData.ventasHoy.transacciones}{" "}
                        {dashboardData.ventasHoy.transacciones === 1
                          ? "transacción"
                          : "transacciones"}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className="p-3.5 bg-secondary-500 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </article>

            <article
              className="group relative bg-gradient-to-br from-primary-50 to-primary-100/60 rounded-2xl p-6 border-2 border-primary-200/60 shadow-sm hover:shadow-lg hover:border-primary-300 focus-within:ring-4 focus-within:ring-primary-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="ventas-semana-title"
              tabIndex="0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    id="ventas-semana-title"
                    className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Ventas Semana
                  </p>
                  {dashboardData.loading ? (
                    <div className="h-10 w-36 bg-primary-200/60 animate-pulse rounded-lg" aria-label="Cargando ventas de la semana"></div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900 break-words">
                      {formatCurrency(dashboardData.ventasSemana.total)}
                    </p>
                  )}
                </div>
                <div
                  className="p-3.5 bg-primary-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </article>

            <article
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 focus-within:ring-4 focus-within:ring-gray-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="productos-title"
              tabIndex="0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    id="productos-title"
                    className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Total Productos
                  </p>
                  {dashboardData.loading ? (
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg" aria-label="Cargando total de productos"></div>
                  ) : (
                    <>
                      <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        {dashboardData.productos.activos}
                      </p>
                      {dashboardData.productos.stockBajo > 0 && (
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary-100 rounded-lg w-fit"
                          role="status"
                          aria-live="polite"
                        >
                          <AlertCircle className="w-4 h-4 text-secondary-700 flex-shrink-0" aria-hidden="true" />
                          <p className="text-xs text-secondary-800 font-semibold">
                            {dashboardData.productos.stockBajo} con stock bajo
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div
                  className="p-3.5 bg-gray-700 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </article>

            <article
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 focus-within:ring-4 focus-within:ring-gray-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="clientes-title"
              tabIndex="0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    id="clientes-title"
                    className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Clientes Activos
                  </p>
                  {dashboardData.loading ? (
                    <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-lg" aria-label="Cargando clientes activos"></div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {dashboardData.clientesActivos}
                    </p>
                  )}
                </div>
                <div
                  className="p-3.5 bg-primary-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <Users className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="charts-heading" className="mb-10 sm:mb-14">
          <h2
            id="charts-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
          >
            Análisis de Ventas
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md focus-within:ring-4 focus-within:ring-primary-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="chart-ventas-title"
            >
              <h3 id="chart-ventas-title" className="text-xl font-bold text-gray-900 mb-6">
                Ventas Últimos 7 Días
              </h3>
              {chartData.loading ? (
                <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg" aria-live="polite">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Cargando gráfico...</p>
                  </div>
                </div>
              ) : chartData.ventasPorDia.length === 0 ? (
                <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg" role="status">
                  <div className="flex flex-col items-center gap-3">
                    <TrendingUp className="w-12 h-12 text-gray-300" aria-hidden="true" />
                    <p className="text-gray-500 font-medium">No hay datos disponibles</p>
                  </div>
                </div>
              ) : (
                <div role="img" aria-label="Gráfico de línea mostrando ventas de los últimos 7 días">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.ventasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="fecha"
                        stroke="#4b5563"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      />
                      <YAxis
                        stroke="#4b5563"
                        style={{ fontSize: "13px", fontWeight: 500 }}
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
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                        formatter={(value) =>
                          new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          }).format(value)
                        }
                      />
                      <Legend wrapperStyle={{ paddingTop: "16px" }} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#16a34a"
                        strokeWidth={3}
                        name="Ventas"
                        dot={{ fill: "#16a34a", r: 5, strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>

            <article
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md focus-within:ring-4 focus-within:ring-primary-200 focus-within:ring-offset-2 transition-all duration-300"
              aria-labelledby="chart-transacciones-title"
            >
              <h3 id="chart-transacciones-title" className="text-xl font-bold text-gray-900 mb-6">
                Transacciones por Día
              </h3>
              {chartData.loading ? (
                <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg" aria-live="polite">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Cargando gráfico...</p>
                  </div>
                </div>
              ) : chartData.ventasPorDia.length === 0 ? (
                <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg" role="status">
                  <div className="flex flex-col items-center gap-3">
                    <ShoppingBag className="w-12 h-12 text-gray-300" aria-hidden="true" />
                    <p className="text-gray-500 font-medium">No hay datos disponibles</p>
                  </div>
                </div>
              ) : (
                <div role="img" aria-label="Gráfico de barras mostrando transacciones por día">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.ventasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="fecha"
                        stroke="#4b5563"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      />
                      <YAxis
                        stroke="#4b5563"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f97316",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          padding: "12px 16px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "16px" }} />
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

        <section aria-labelledby="top-products-heading" className="mb-10">
          <h2
            id="top-products-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
          >
            Productos Más Vendidos
          </h2>

          {dashboardData.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Cargando productos">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 animate-pulse"
                  aria-hidden="true"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
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
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-12 text-center" role="status">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-600 text-lg font-medium">
                No hay productos vendidos en este período
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dashboardData.productosMasVendidos
                .slice(0, 6)
                .map((producto, index) => (
                  <article
                    key={producto.idProducto}
                    className="group bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-300 focus-within:ring-4 focus-within:ring-primary-200 focus-within:ring-offset-2 transition-all duration-300"
                    tabIndex="0"
                    aria-label={`Producto ${index + 1}: ${producto.nombre}, ${producto.cantidadVendida} vendidos, ingreso total ${formatCurrency(producto.ingresoTotal)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={producto.imagen}
                          alt=""
                          className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100 group-hover:border-primary-200 transition-colors duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-snug">
                          {producto.nombre}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-lg">
                            {producto.cantidadVendida} vendidos
                          </span>
                        </div>
                        <p className="text-base font-bold text-gray-900">
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
