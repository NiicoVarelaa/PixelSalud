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
    idsProductosEnCampanas,
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
    idsProductosEnCampanas,
    paginaActual,
    itemsPorPagina,
  });

  if (cargando) return <LoadingState />;

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
      className="flex flex-col lg:min-h-0"
      aria-label="Listado de productos para ofertas"
    >
      <p className="sr-only" role="status" aria-live="polite">
        {productosPaginados.length} productos visibles en esta página.
      </p>

      <div
        className="lg:hidden space-y-2"
        role="list"
        aria-label="Productos en oferta"
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
        transition={{ duration: 0.2 }}
        className="hidden min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:flex lg:flex-col"
        role="region"
        aria-label="Tabla de productos en oferta"
      >
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full" aria-describedby="tabla-ofertas-desc">
            <caption id="tabla-ofertas-desc" className="sr-only">
              Gestión de ofertas individuales por producto
            </caption>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                {["Producto", "Categoría", "Precio", "Estado", "Acciones"].map(
                  (col) => (
                    <th
                      key={col}
                      scope="col"
                      className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 ${
                        ["Estado", "Acciones"].includes(col)
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
