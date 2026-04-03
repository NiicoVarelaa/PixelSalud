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
    <section
      aria-label="Listado de productos para ofertas"
      className="space-y-2"
    >
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-xs sm:px-4">
        <p className="text-sm font-semibold text-gray-900">
          Productos con oferta activa
        </p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Hay {productosPaginados.length} productos visibles en esta pagina.
      </p>

      <div
        className="lg:hidden space-y-3"
        role="list"
        aria-label="Lista de productos en oferta"
      >
        {productosPaginados.map((producto, index) => (
          <div key={producto.idProducto} role="listitem">
            <ProductCard
              producto={producto}
              index={index}
              estaEnCampana={estaEnCampana}
              onEstablecerDescuento={onEstablecerDescuento}
              onCambiarOferta={onCambiarOferta}
            />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block"
        role="region"
        aria-label="Tabla de productos en oferta"
      >
        <div className="overflow-x-auto">
          <table className="w-full" aria-describedby="tabla-ofertas-ayuda">
            <caption id="tabla-ofertas-ayuda" className="sr-only">
              Tabla de productos para activar, cambiar o quitar ofertas
              individuales.
            </caption>
            <thead>
              <tr className="bg-linear-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
                <th
                  scope="col"
                  className="px-3 py-1.5 text-left text-[11px] font-bold text-gray-700 uppercase tracking-wider"
                >
                  Producto
                </th>
                <th
                  scope="col"
                  className="px-3 py-1.5 text-left text-[11px] font-bold text-gray-700 uppercase tracking-wider"
                >
                  Categoría
                </th>
                <th
                  scope="col"
                  className="px-3 py-1.5 text-left text-[11px] font-bold text-gray-700 uppercase tracking-wider"
                >
                  Precio
                </th>
                <th
                  scope="col"
                  className="px-3 py-1.5 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-3 py-1.5 text-center text-[11px] font-bold text-gray-700 uppercase tracking-wider"
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
    </section>
  );
};
