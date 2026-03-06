import PropTypes from "prop-types";

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  iconBgColor,
  hoverBorderColor,
  loading,
  badge,
}) => {
  return (
    <article
      className={`group bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 hover:bg-white hover:border-${hoverBorderColor} hover:shadow-md transition-all duration-300`}
      aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}
      tabIndex="0"
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.currentTarget.focus();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <p
            id={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}
            className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider mb-1"
          >
            {title}
          </p>
        </div>
        <div
          className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center ${iconBgColor} rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          aria-hidden="true"
        >
          {IconComponent && (
            <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div
            className="h-8 sm:h-10 bg-gray-200 animate-pulse rounded-lg"
            aria-label={`Cargando ${title.toLowerCase()}`}
          />
          {subtitle && (
            <div
              className="h-4 w-24 bg-gray-200 animate-pulse rounded"
              aria-hidden="true"
            />
          )}
        </div>
      ) : (
        <>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-word">
            {value}
          </p>
          {subtitle && (
            <div className="flex items-center gap-2">{subtitle}</div>
          )}
          {badge && badge}
        </>
      )}
    </article>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.node,
  icon: PropTypes.elementType.isRequired,
  iconBgColor: PropTypes.string.isRequired,
  hoverBorderColor: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  badge: PropTypes.node,
};

MetricCard.defaultProps = {
  loading: false,
  subtitle: null,
  badge: null,
};

export default MetricCard;
