import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { AdminLayout } from "@features/admin/components/shared";
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
    <AdminLayout
      title="Dashboard"
      description="Panel de control y métricas principales"
      contentClassName="space-y-2 sm:space-y-3 overflow-y-auto"
    >
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
    </AdminLayout>
  );
};

export default AdminMenu;
