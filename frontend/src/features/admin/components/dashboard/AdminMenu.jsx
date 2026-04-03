import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { AdminLayout } from "@features/admin/components/shared";
import { useDashboardData, useChartData } from "./hooks";
import {
  MetricsSection,
  ChartsSection,
  TopProductsSection,
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

  return (
    <AdminLayout
      title="Dashboard"
      description="Panel de control y métricas principales"
      contentClassName="flex flex-col gap-3 min-h-0"
    >
      {error && (
        <div
          className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl shrink-0"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 text-sm font-semibold">
                Error al cargar datos
              </p>
              <p className="text-red-700 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 shrink-0">
        <div className="xl:col-span-5 flex flex-col">
          <MetricsSection data={metricas} loading={metricasLoading} />
        </div>
        <div className="xl:col-span-7 flex flex-col">
          <TopProductsSection
            productos={metricas?.productosMasVendidos || []}
            loading={metricasLoading}
          />
        </div>
      </div>

      <ChartsSection
        ventasData={ventasData}
        productosData={productosData}
        loading={chartLoading}
        currentTab={dias}
        onTabChange={setDias}
      />
    </AdminLayout>
  );
};

export default AdminMenu;
