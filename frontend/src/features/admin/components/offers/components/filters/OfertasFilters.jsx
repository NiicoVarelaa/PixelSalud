import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, XCircle, RotateCcw, Tag, Download } from "lucide-react";
import { useOfertasStore } from "../../store/useOfertasStore";
import { useMemo } from "react";
import CustomSelect from "../../../products/components/CustomSelect";
import { hasActiveOffer } from "../../utils/ofertasFilters";
import { OPCIONES_DESCUENTO_FILTRO } from "../../utils/constants";
import { exportarOfertasCSV } from "../../utils/exportCSV";

export const OfertasFilters = ({
  categorias = [],
  onOpenAgregarOferta = () => {},
}) => {
  const {
    busqueda,
    filtroCategoria,
    filtroDescuento,
    setBusqueda,
    setFiltroCategoria,
    setFiltroDescuento,
    resetFiltros,
    productos,
  } = useOfertasStore();

  const stats = useMemo(() => {
    const conOferta = productos.filter((p) => hasActiveOffer(p)).length;
    return {
      total: productos.length,
      conOferta,
      sinOferta: productos.length - conOferta,
    };
  }, [productos]);

  const hayFiltrosActivos =
    busqueda || filtroCategoria !== "todas" || filtroDescuento !== "todos";

  const opcionesCategoria = useMemo(
    () => [
      { value: "todas", label: "Todas las categorías" },
      ...categorias.map((cat) => ({ value: cat, label: cat })),
    ],
    [categorias],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-visible rounded-2xl border border-gray-200 bg-white"
      role="search"
      aria-label="Filtros del gestor de ofertas"
    >
      <div className="border-b border-gray-100 px-4 py-3.5 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white"
                aria-hidden="true"
              >
                <Tag size={14} />
              </span>
              <p className="text-sm font-semibold leading-none text-gray-900">
                Ofertas individuales
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {stats.total} productos · {stats.conOferta} con descuento activo
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportarOfertasCSV(productos)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2.5 rounded-xl transition-all border border-gray-200 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer"
              title="Exportar ofertas"
              aria-label="Exportar ofertas a CSV"
            >
              <Download size={18} />
              <span className="text-sm font-medium hidden sm:inline">Exportar</span>
            </button>

            <button
              type="button"
              onClick={onOpenAgregarOferta}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/20 focus-visible:ring-4 focus-visible:ring-green-500/30 outline-none cursor-pointer"
              title="Agregar Producto"
              aria-label="Agregar Producto"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-green-600 group-hover:bg-green-50">
                <Plus size={16} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">Agregar producto</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="search-ofertas" className="sr-only">
              Buscar producto por nombre
            </label>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="search-ofertas"
                type="search"
                inputMode="search"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring focus:ring-primary-600"
                aria-describedby="search-hint"
              />
              <span id="search-hint" className="sr-only">
                Filtra los productos por nombre
              </span>
              <AnimatePresence>
                {busqueda && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => setBusqueda("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                    aria-label="Limpiar búsqueda"
                  >
                    <XCircle size={17} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <CustomSelect
            id="filter-categoria"
            label="Categoría"
            value={filtroCategoria}
            onChange={setFiltroCategoria}
            options={opcionesCategoria}
            hideLabel
          />

          <CustomSelect
            id="filter-descuento"
            label="Descuento"
            value={filtroDescuento}
            onChange={setFiltroDescuento}
            options={OPCIONES_DESCUENTO_FILTRO}
            hideLabel
          />
        </div>

        <AnimatePresence>
          {hayFiltrosActivos && (
            <div className="flex flex-wrap items-center gap-2">
              <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                type="button"
                onClick={resetFiltros}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1"
                aria-label="Limpiar todos los filtros activos"
              >
                <RotateCcw size={13} aria-hidden="true" />
                Limpiar
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hayFiltrosActivos && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5"
              aria-label="Filtros activos"
            >
              {busqueda && (
                <Chip
                  label={`"${busqueda}"`}
                  onRemove={() => setBusqueda("")}
                  removeLabel="Quitar filtro de búsqueda"
                />
              )}
              {filtroCategoria !== "todas" && (
                <Chip
                  label={filtroCategoria}
                  onRemove={() => setFiltroCategoria("todas")}
                  removeLabel="Quitar filtro de categoría"
                />
              )}
              {filtroDescuento !== "todos" && (
                <Chip
                  label={`${filtroDescuento}% OFF`}
                  onRemove={() => setFiltroDescuento("todos")}
                  removeLabel="Quitar filtro de descuento"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

const Chip = ({ label, onRemove, removeLabel }) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 transition-all hover:bg-orange-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1"
    aria-label={removeLabel}
  >
    {label}
    <XCircle size={13} aria-hidden="true" />
  </button>
);
