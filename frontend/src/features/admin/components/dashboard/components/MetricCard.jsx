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
      className={`group bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-white hover:border-${hoverBorderColor} hover:shadow-sm transition-all duration-300`}
      aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}
      tabIndex="0"
      role="button"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p
            id={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}
            className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            {title}
          </p>
        </div>
        <div
          className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center ${iconBgColor} rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300`}
          aria-hidden="true"
        >
          {IconComponent && (
            <IconComponent className="w-4 h-4 text-white" strokeWidth={2.5} />
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-6 sm:h-8 bg-gray-200 animate-pulse rounded-md" />
          {subtitle && (
            <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
          )}
        </div>
      ) : (
        <>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mb-1 truncate">
            {value}
          </p>
          <div className="flex items-center gap-2 min-h-5">
            {subtitle && (
              <div className="flex items-center gap-1">{subtitle}</div>
            )}
            {badge && badge}
          </div>
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
