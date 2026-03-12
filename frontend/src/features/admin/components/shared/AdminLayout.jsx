import PropTypes from "prop-types";
import PageHeader from "./PageHeader";

/**
 * Layout centralizado para todos los módulos del admin
 *
 * ✅ Padding/margins consistentes (horizontal y vertical)
 * ✅ Layout sin scroll (flex-1 h-full min-h-0)
 * ✅ Skip link para accesibilidad (WCAG 2.1 AAA)
 * ✅ Responsive mobile-first (320px → 1440px+)
 * ✅ Estructura estandarizada: Header + Scrollable Content
 *
 * @param {Object} props
 * @param {string} props.title - Título del encabezado
 * @param {string} [props.description] - Descripción opcional del encabezado
 * @param {React.ReactNode} props.children - Contenido principal del módulo
 * @param {React.ReactNode} [props.headerAction] - Acción opcional en el header (ej: botón crear)
 * @param {string} [props.contentClassName] - Clases adicionales para el área de contenido
 *
 * @example
 * <AdminLayout
 *   title="Productos"
 *   description="Gestión de productos de la tienda"
 *   headerAction={<button>Crear Producto</button>}
 * >
 *   <ProductList />
 * </AdminLayout>
 */
const AdminLayout = ({
  title,
  description,
  children,
  headerAction,
  contentClassName = "",
}) => {
  return (
    <div className="flex-1 h-full min-h-0 bg-gray-50 p-3 sm:p-4 lg:p-6 w-full flex flex-col">
      {/* Skip link para accesibilidad WCAG 2.1 AAA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-green-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
      >
        Saltar al contenido principal
      </a>

      {/* Wrapper principal con max-width centrado */}
      <div
        className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0"
        id="main-content"
      >
        {/* Header - Fijo, no scrolleable */}
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

        {/* Área de contenido scrolleable */}
        <div className={`flex-1 overflow-y-auto min-h-0 ${contentClassName}`}>
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
};

export default AdminLayout;
