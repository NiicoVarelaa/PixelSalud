import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "@features/admin/components/shared";
import { useDashboardData, useChartData } from "./hooks";
import {
  MetricsSection,
  ChartsSection,
  TopProductsSection,
  DayFilterTabs,
} from "./components";

const AdminMenu = () => {
  const [dias, setDias] = useState(7);

  const {
    data: metricas,
    loading: metricasLoading,
    error,
  } = useDashboardData();
  const {
    ventasData,
    productosData,
    loading: chartLoading,
  } = useChartData(dias);

  const handleTabChange = (newDias) => {
    setDias(newDias);
  };

  return (
    <div className="flex-1 h-full min-h-0 bg-gray-50 p-3 sm:p-4 lg:p-6 w-full flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-green-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
      >
        Saltar al contenido principal
      </a>
      <div
        className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0"
        id="main-content"
      >
        <div className="shrink-0">
          <PageHeader
            title="Dashboard"
            description="Panel de control y métricas principales"
          />
        </div>

        {error && (
          <div
            className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shrink-0"
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
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
          <MetricsSection data={metricas} loading={metricasLoading} />

          <DayFilterTabs activeTab={dias} onTabChange={handleTabChange} />

          <ChartsSection
            ventasData={ventasData}
            productosData={productosData}
            loading={chartLoading}
            currentTab={dias}
          />

          <TopProductsSection
            productos={metricas.productosMasVendidos}
            loading={metricasLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
