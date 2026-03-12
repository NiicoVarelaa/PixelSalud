import { motion } from "framer-motion";
import { useOfertasStore } from "../../store/useOfertasStore";
import { LoadingState, EmptyState } from "./States";
import { ProductCard } from "./ProductCard";
import { ProductTableRow } from "./ProductTableRow";
import { useProductFilters } from "./useProductFilters";

export const OfertasTable = ({
  onEstablecerDescuento,
  onCambiarOferta,
  estaEnCampana,
}) => {
  const {
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    paginaActual,
    itemsPorPagina,
    cargando,
  } = useOfertasStore();

  const productosPaginados = useProductFilters({
    productos,
    busqueda,
    filtroCategoria,
    filtroDescuento,
    paginaActual,
    itemsPorPagina,
  });

  if (cargando) {
    return <LoadingState />;
  }

  if (productosPaginados.length === 0) {
    return (
      <EmptyState
        busqueda={busqueda}
        filtroCategoria={filtroCategoria}
        filtroDescuento={filtroDescuento}
      />
    );
  }

  return (
    <>
      {/* VISTA MOBILE: Cards (< lg) */}
      <div
        className="lg:hidden space-y-3"
        role="list"
        aria-label="Lista de productos en oferta"
      >
        {productosPaginados.map((producto, index) => (
          <ProductCard
            key={producto.idProducto}
            producto={producto}
            index={index}
            estaEnCampana={estaEnCampana}
            onEstablecerDescuento={onEstablecerDescuento}
            onCambiarOferta={onCambiarOferta}
          />
        ))}
      </div>

      {/* VISTA DESKTOP: Tabla (≥ lg) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        role="region"
        aria-label="Tabla de productos en oferta"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary-50 to-primary-100/50 border-b-2 border-primary-200">
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Producto
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Categoría
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Precio
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosPaginados.map((producto, index) => (
                <ProductTableRow
                  key={producto.idProducto}
                  producto={producto}
                  index={index}
                  estaEnCampana={estaEnCampana}
                  onEstablecerDescuento={onEstablecerDescuento}
                  onCambiarOferta={onCambiarOferta}
                />
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};
