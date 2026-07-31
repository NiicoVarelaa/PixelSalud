import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Activity, BarChart3 } from "lucide-react";
import ChartCard from "./ChartCard";
import DayFilterTabs from "./DayFilterTabs";
import { tooltipStyle } from "../utils/dashboardUtils";

const ChartsSection = ({
  ventasData,
  productosData,
  loading,
  currentTab,
  onTabChange,
}) => {
  const periodLabel = `${currentTab} días`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      aria-labelledby="charts-heading"
      aria-describedby="charts-description"
      className="flex w-full flex-col xl:min-h-0 xl:flex-1"
    >
      <div className="relative flex flex-col rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 xl:min-h-0 xl:flex-1">
        <header className="mb-4 flex shrink-0 flex-col gap-3 sm:mb-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
              Métricas
            </div>

            <h2
              id="charts-heading"
              className="min-w-0 text-base font-extrabold tracking-tight text-gray-900 sm:text-lg"
            >
              Evolución de Ventas
            </h2>

            <p
              id="charts-description"
              className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 sm:text-sm"
            >
              <Activity
                className="h-3.5 w-3.5 text-emerald-600"
                aria-hidden="true"
              />
              Datos acumulados del período activo: {periodLabel}
            </p>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[320px]">
            <DayFilterTabs activeTab={currentTab} onTabChange={onTabChange} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-2">
          <ChartCard
            title="Ingresos Diarios"
            subtitle="Total facturado por día"
            data={ventasData}
            dataKey="total"
            type="line"
            name="Total"
            color="#00a339"
            tooltipStyle={tooltipStyle}
            loading={loading}
          />
          <ChartCard
            title="Volumen de Productos"
            subtitle="Unidades vendidas por día"
            data={productosData}
            dataKey="cantidad"
            type="bar"
            name="Cantidad"
            color={currentTab === 7 ? "#f97316" : "#00a339"}
            tooltipStyle={tooltipStyle}
            loading={loading}
          />
        </div>
      </div>
    </motion.section>
  );
};

ChartsSection.propTypes = {
  ventasData: PropTypes.array.isRequired,
  productosData: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  currentTab: PropTypes.number,
  onTabChange: PropTypes.func.isRequired,
};

ChartsSection.defaultProps = {
  loading: false,
  currentTab: 7,
};

export default ChartsSection;
