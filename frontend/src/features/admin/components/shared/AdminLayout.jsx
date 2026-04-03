import PropTypes from "prop-types";
import PageHeader from "./PageHeader";

const AdminLayout = ({
  title,
  description,
  children,
  headerAction,
  contentClassName = "",
  nested = false,
}) => {
  const rootClass = nested
    ? "flex h-full min-h-0 w-full flex-1 flex-col"
    : "flex h-full min-h-0 w-full flex-1 flex-col bg-slate-50";

  const scrollAreaClass = nested
    ? "flex w-full min-h-0 flex-1 flex-col"
    : "mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col overflow-y-auto overscroll-contain pb-4 sm:pb-5 lg:pb-0";

  return (
    <div className={rootClass}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-green-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
      >
        Saltar al contenido principal
      </a>

      <div className={scrollAreaClass} id="main-content">
        <div className="shrink-0">
          {headerAction ? (
            <div className="mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
              <PageHeader title={title} description={description} />
              <div className="shrink-0">{headerAction}</div>
            </div>
          ) : (
            <PageHeader title={title} description={description} />
          )}
        </div>

        <div className={`flex flex-1 min-h-0 flex-col ${contentClassName}`}>
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
};

export default AdminLayout;
