import PropTypes from "prop-types";
import PageHeader from "./PageHeader";

const AdminLayout = ({
  title,
  description,
  children,
  headerAction,
  contentClassName = "",
  nested = false,
  usePageScroll = false,
}) => {
  return (
    <div
      className={
        nested
          ? "flex-1 h-full min-h-0 w-full flex flex-col"
          : "flex-1 h-full min-h-0 bg-gray-50 p-3 sm:px-4 sm:py-3 lg:px-6 lg:py-3 w-full flex flex-col"
      }
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-green-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
      >
        Saltar al contenido principal
      </a>

      <div
        className={
          nested
            ? "w-full flex-1 flex flex-col min-h-0"
            : "w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0"
        }
        id="main-content"
      >
        <div className="shrink-0">
          {headerAction ? (
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-5">
              <PageHeader title={title} description={description} />
              <div className="shrink-0">{headerAction}</div>
            </div>
          ) : (
            <PageHeader title={title} description={description} />
          )}
        </div>

        <div
          className={
            usePageScroll
              ? `${contentClassName}`
              : `flex-1 overflow-y-auto min-h-0 ${contentClassName}`
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  headerAction: PropTypes.node,
  contentClassName: PropTypes.string,
  nested: PropTypes.bool,
  usePageScroll: PropTypes.bool,
};

export default AdminLayout;
