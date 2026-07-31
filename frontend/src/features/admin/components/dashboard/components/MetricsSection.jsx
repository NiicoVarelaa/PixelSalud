import { useMemo } from "react";
import PropTypes from "prop-types";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
  Activity,
  Users,
} from "lucide-react";
import MetricCard from "./MetricCard";
import { formatCurrency } from "../utils/dashboardUtils";

const MetricsSection = ({ data, loading }) => {
  const ventasHoySubtitle = useMemo(
    () => (
      <>
        <Activity className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
        <p className="text-xs font-semibold text-gray-600">
          {data?.ventasHoy?.transacciones || 0}{" "}
          {data?.ventasHoy?.transacciones === 1
            ? "transacción"
            : "transacciones"}
        </p>
      </>
    ),
    [data?.ventasHoy?.transacciones],
  );

  const stockBajoBadge = useMemo(
    () =>
      data?.productos?.stockBajo > 0 ? (
        <div
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md"
          role="status"
          aria-live="polite"
        >
          <AlertCircle
            className="w-3 h-3 text-secondary-700 shrink-0"
            aria-hidden="true"
          />
          <p className="text-[10px] font-bold text-secondary-800 uppercase tracking-wider">
            {data.productos.stockBajo} Stock bajo
          </p>
        </div>
      ) : null,
    [data?.productos?.stockBajo],
  );

  return (
    <section aria-labelledby="metrics-heading" className="h-full">
      <div className="bg-white rounded-xl border border-gray-100 p-3 h-full">
        <h2
          id="metrics-heading"
          className="text-sm sm:text-base font-extrabold text-gray-900 mb-2"
        >
          Resumen de Actividad
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            title="Ventas Hoy"
            value={data ? formatCurrency(data.ventasHoy.total) : "$0"}
            subtitle={ventasHoySubtitle}
            icon={DollarSign}
            iconBgColor="bg-gradient-to-br from-orange-500 to-orange-600"
            hoverBorderColor="orange-400"
            loading={loading}
          />
          <MetricCard
            title="Ventas Semana"
            value={data ? formatCurrency(data.ventasSemana.total) : "$0"}
            icon={TrendingUp}
            iconBgColor="bg-gradient-to-br from-green-600 to-green-700"
            hoverBorderColor="green-400"
            loading={loading}
          />
          <MetricCard
            title="Productos"
            value={data ? data.productos.activos : 0}
            badge={stockBajoBadge}
            icon={Package}
            iconBgColor="bg-gradient-to-br from-secondary-700 to-secondary-800"
            hoverBorderColor="secondary-400"
            loading={loading}
          />
          <MetricCard
            title="Clientes"
            value={data?.clientes?.total || 0}
            icon={Users}
            iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            hoverBorderColor="blue-400"
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
    clientes: PropTypes.shape({
      total: PropTypes.number,
    }),
  }).isRequired,
  loading: PropTypes.bool,
};

MetricsSection.defaultProps = {
  loading: false,
};

export default MetricsSection;
