import { useMemo } from "react";
import PropTypes from "prop-types";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
  Activity,
} from "lucide-react";
import MetricCard from "./MetricCard";
import { formatCurrency } from "../utils/dashboardUtils";

const MetricsSection = ({ data, loading }) => {
  const ventasHoySubtitle = useMemo(
    () => (
      <>
        <Activity className="w-4 h-4 text-orange-600" aria-hidden="true" />
        <p className="text-sm font-semibold text-gray-600">
          {data.ventasHoy.transacciones}{" "}
          {data.ventasHoy.transacciones === 1 ? "transacción" : "transacciones"}
        </p>
      </>
    ),
    [data.ventasHoy.transacciones],
  );

  const stockBajoBadge = useMemo(
    () =>
      data.productos.stockBajo > 0 ? (
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
            {data.productos.stockBajo} Stock bajo
          </p>
        </div>
      ) : null,
    [data.productos.stockBajo],
  );

  return (
    <section aria-labelledby="metrics-heading">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5">
        <h2
          id="metrics-heading"
          className="text-base sm:text-lg font-bold text-gray-900 mb-3"
        >
          Métricas Principales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          <MetricCard
            title="Ventas Hoy"
            value={formatCurrency(data.ventasHoy.total)}
            subtitle={ventasHoySubtitle}
            icon={DollarSign}
            iconBgColor="bg-gradient-to-br from-orange-500 to-orange-600"
            hoverBorderColor="orange-400"
            loading={loading}
          />

          <MetricCard
            title="Ventas Semana"
            value={formatCurrency(data.ventasSemana.total)}
            icon={TrendingUp}
            iconBgColor="bg-gradient-to-br from-green-600 to-green-700"
            hoverBorderColor="green-400"
            loading={loading}
          />

          <MetricCard
            title="Productos"
            value={data.productos.activos}
            badge={stockBajoBadge}
            icon={Package}
            iconBgColor="bg-gradient-to-br from-secondary-700 to-secondary-800"
            hoverBorderColor="secondary-400"
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
};

MetricsSection.propTypes = {
  data: PropTypes.shape({
    ventasHoy: PropTypes.shape({
      total: PropTypes.number.isRequired,
      transacciones: PropTypes.number.isRequired,
    }).isRequired,
    ventasSemana: PropTypes.shape({
      total: PropTypes.number.isRequired,
    }).isRequired,
    productos: PropTypes.shape({
      activos: PropTypes.number.isRequired,
      stockBajo: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  loading: PropTypes.bool,
};

MetricsSection.defaultProps = {
  loading: false,
};

export default MetricsSection;
