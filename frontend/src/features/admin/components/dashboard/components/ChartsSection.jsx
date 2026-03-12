import PropTypes from "prop-types";
import ChartCard from "./ChartCard";
import { tooltipStyle } from "../utils/dashboardUtils";

const ChartsSection = ({ ventasData, productosData, loading, currentTab }) => {
  return (
    <section aria-labelledby="charts-heading">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-3 sm:p-4">
        <h2
          id="charts-heading"
          className="text-base sm:text-lg font-bold text-gray-900 mb-2"
        >
          Análisis de Ventas
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <ChartCard
            title="Ventas Diarias"
            subtitle="Total de ventas por día"
            data={ventasData}
            dataKey="total"
            type="line"
            name="Total"
            color="#00a339"
            tooltipStyle={tooltipStyle}
            loading={loading}
          />

          <ChartCard
            title="Productos Vendidos"
            subtitle="Cantidad de productos vendidos"
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
  ventasData: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ).isRequired,
  productosData: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    }),
  ).isRequired,
  loading: PropTypes.bool,
  currentTab: PropTypes.number,
};

ChartsSection.defaultProps = {
  loading: false,
  currentTab: 7,
};

export default ChartsSection;
