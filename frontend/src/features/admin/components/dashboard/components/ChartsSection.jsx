import PropTypes from "prop-types";
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
  return (
    <section
      aria-labelledby="charts-heading"
      className="w-full flex-1 flex flex-col min-h-0"
    >
      <div className="bg-white rounded-xl border border-gray-100 p-3 flex-1 flex flex-col min-h-0 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 px-1 shrink-0">
          <h2
            id="charts-heading"
            className="text-sm sm:text-base font-extrabold text-gray-900"
          >
            Evolución de Ventas
          </h2>
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <DayFilterTabs activeTab={currentTab} onTabChange={onTabChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
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
    </section>
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
