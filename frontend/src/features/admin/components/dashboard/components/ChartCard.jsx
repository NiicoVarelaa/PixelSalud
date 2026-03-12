import React from "react";
import PropTypes from "prop-types";
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
import { TrendingUp, ShoppingBag } from "lucide-react";
import { axisStyle, formatYAxis } from "../utils/dashboardUtils";

const capitalize = (str) =>
  typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str;

const capitalizeDate = (value) => {
  if (typeof value === "string" && value.length > 0) {
    const parts = value.split(" ");
    if (parts.length === 2) {
      return `${parts[0]} ${capitalize(parts[1])}`;
    }
    return capitalize(value);
  }
  return value;
};

const ChartCard = ({
  title,
  subtitle,
  data,
  loading,
  type = "line",
  dataKey,
  name,
  color,
  tooltipStyle,
}) => {
  const emptyIcon = type === "line" ? TrendingUp : ShoppingBag;
  const chartColor = color || (type === "line" ? "#16a34a" : "#f97316");

  const formatTooltipValue = (value) =>
    type === "line"
      ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(value)
      : value;

  const formatLegend = (value) => {
    const capitalized = capitalize(value);
    return type === "line" ? (
      <span className="text-green-600 font-semibold">{capitalized}</span>
    ) : (
      <span className="text-orange-500 font-semibold">{capitalized}</span>
    );
  };

  const renderChart = () => {
    const ChartComponent = type === "line" ? LineChart : BarChart;
    return (
      <ResponsiveContainer width="99%" height="100%">
        <ChartComponent data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="fecha"
            stroke="#6b7280"
            style={axisStyle}
            tick={{ fill: "#6b7280" }}
            tickFormatter={capitalizeDate}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            stroke="#6b7280"
            style={axisStyle}
            tick={{ fill: "#6b7280" }}
            tickFormatter={type === "line" ? formatYAxis : undefined}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              ...tooltipStyle,
              color: "#fff",
              borderRadius: "8px",
              border: "none",
            }}
            formatter={(value, name) => [
              <span style={{ color: "#fff" }}>
                {formatTooltipValue(value)}
              </span>,
              <span style={{ color: "#fff" }}>{capitalize(name)}</span>,
            ]}
            labelStyle={{ fontWeight: 700, marginBottom: "4px", color: "#fff" }}
            cursor={{ fill: type === "bar" ? "#f3f4f6" : "transparent" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "16px" }}
            iconType={type === "line" ? "circle" : "rect"}
            formatter={formatLegend}
          />
          {type === "line" ? (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={chartColor}
              strokeWidth={4}
              name={capitalize(name)}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
              dot={{
                fill: chartColor,
                r: 4,
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ) : (
            <Bar
              dataKey={dataKey}
              fill={chartColor}
              name={capitalize(name)}
              radius={[6, 6, 0, 0]}
              barSize={40}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <article
      className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
      aria-labelledby={`chart-${dataKey}-title`}
    >
      <div className="mb-3">
        <h3
          id={`chart-${dataKey}-title`}
          className="text-sm sm:text-base font-bold text-gray-900 mb-1"
        >
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
      </div>

      {loading ? (
        <div
          className="h-32 sm:h-36 lg:h-40 flex items-center justify-center bg-gray-50 rounded-xl"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full animate-spin border-4 border-gray-200 ${type === "line" ? "border-t-green-500" : "border-t-orange-500"}`}
            />
            <p className="text-gray-500 font-medium text-sm">
              Actualizando métricas...
            </p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div
          className="h-32 sm:h-36 lg:h-40 flex items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200"
          role="status"
        >
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            {emptyIcon && (
              <emptyIcon.type
                className="w-10 h-10 text-gray-400"
                aria-hidden="true"
              />
            )}
            <p className="text-gray-600 font-semibold">
              No hay datos para este período
            </p>
          </div>
        </div>
      ) : (
        <div className="h-32 sm:h-36 lg:h-40 w-full">{renderChart()}</div>
      )}
    </article>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(["line", "bar"]),
  dataKey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  tooltipStyle: PropTypes.object,
};

ChartCard.defaultProps = {
  loading: false,
  type: "line",
  subtitle: "",
};

export default ChartCard;
