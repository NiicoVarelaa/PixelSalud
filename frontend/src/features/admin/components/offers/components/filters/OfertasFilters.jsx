import { motion } from "framer-motion";
import {
  Search,
  Percent,
  Filter,
  Plus,
  XCircle,
  RotateCcw,
  Package,
  TrendingUp,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useOfertasStore } from "../../store/useOfertasStore";
import { useMemo } from "react";
import CustomSelect from "../../../products/components/CustomSelect";

const normalizeDiscount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};

const hasActiveOffer = (product) =>
  Boolean(product.enOferta) &&
  normalizeDiscount(product.porcentajeDescuento) > 0;

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

  // Calcular stats para mostrar
  const stats = useMemo(() => {
    const productosConOferta = productos.filter((p) => hasActiveOffer(p));
    const total = productos.length;
    const conOferta = productosConOferta.length;
    const sinOferta = total - conOferta;

    return { total, conOferta, sinOferta };
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

  const opcionesDescuento = useMemo(
    () => [
      { value: "todos", label: "Todos los descuentos" },
      { value: "10", label: "10% OFF" },
      { value: "15", label: "15% OFF" },
      { value: "20", label: "20% OFF" },
    ],
    [],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-3 overflow-visible"
      role="search"
      aria-label="Filtros de ofertas"
    >
      <div className="border-b border-primary-200/80 bg-linear-to-r from-primary-50 via-emerald-50 to-green-50">
        <div className="relative overflow-hidden px-4 py-3 sm:px-5 sm:py-3.5 lg:px-5 lg:py-2.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-primary-500 to-emerald-500" />

          <div className="ml-1.5 flex items-start justify-between gap-3 lg:items-center lg:gap-2.5">
            <div className="flex items-start gap-3 lg:items-center lg:gap-2.5 min-w-0">
              <div
                className="mt-0.5 shrink-0 w-9 h-9 rounded-xl bg-primary-600/95 text-white shadow-xs ring-1 ring-primary-300/70 flex items-center justify-center lg:w-8 lg:h-8 lg:rounded-lg"
                aria-hidden="true"
              >
                <Sparkles className="w-4.5 h-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1 lg:mb-0.5">
                  <h3 className="text-sm font-bold tracking-tight text-primary-950 lg:text-[13px]">
                    Importante
                  </h3>
                  <span className="inline-flex items-center rounded-full border border-primary-300/80 bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-primary-800">
                    Regla activa
                  </span>
                </div>

                <p className="text-sm text-primary-900/90 leading-relaxed max-w-3xl lg:text-[13px] lg:leading-snug">
                  No se pueden aplicar ofertas individuales a productos que ya
                  están incluidos en campañas activas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAgregarOferta}
              className="inline-flex shrink-0 items-center justify-center gap-2 h-9 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Agregar oferta
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-4 space-y-3 sm:space-y-4 lg:space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-3">
          {/* Búsqueda */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="search-ofertas"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Search
                size={16}
                className="text-primary-500"
                aria-hidden="true"
              />
              Buscar producto
            </label>
            <div className="relative group">
              <input
                id="search-ofertas"
                type="search"
                inputMode="search"
                placeholder="Escribe el nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="
                  w-full h-12 lg:h-10 px-4 pr-11 lg:px-3.5
                  bg-gray-50 border-2 border-gray-200 rounded-xl
                  text-sm sm:text-base lg:text-sm text-gray-900 placeholder-gray-400
                  font-medium
                  transition-all duration-200
                  hover:border-gray-300 hover:bg-white
                  focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                "
                aria-describedby="search-hint"
              />
              {busqueda && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="
                    absolute inset-y-0 right-0 pr-3 flex items-center
                    text-gray-400 hover:text-gray-600 transition-colors cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg
                  "
                  aria-label="Limpiar búsqueda"
                >
                  <XCircle size={20} />
                </motion.button>
              )}
              {!busqueda && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search
                    size={18}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <span id="search-hint" className="sr-only">
              Escribe el nombre del producto para filtrar
            </span>
          </div>

          {/* Filtro por categoría */}
          <div>
            <label
              htmlFor="filter-categoria"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Package
                size={16}
                className="text-orange-500"
                aria-hidden="true"
              />
              Categoría
            </label>
            <div className="[&>label]:sr-only [&>div]:rounded-xl! [&>div]:min-h-12! lg:[&>div]:min-h-10! [&>div]:bg-gray-50! [&>div]:border-2! [&>div]:border-gray-200! [&>div]:hover:border-gray-300! [&>div]:focus-within:border-primary-500! [&>div]:focus-within:ring-4! [&>div]:focus-within:ring-primary-100!">
              <CustomSelect
                id="filter-categoria"
                label="Categoría"
                value={filtroCategoria}
                onChange={setFiltroCategoria}
                options={opcionesCategoria}
                hideLabel
              />
            </div>
          </div>

          {/* Filtro por descuento */}
          <div>
            <label
              htmlFor="filter-descuento"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Percent size={16} className="text-red-500" aria-hidden="true" />
              Descuento
            </label>
            <div className="[&>label]:sr-only [&>div]:rounded-xl! [&>div]:min-h-12! lg:[&>div]:min-h-10! [&>div]:bg-gray-50! [&>div]:border-2! [&>div]:border-gray-200! [&>div]:hover:border-gray-300! [&>div]:focus-within:border-primary-500! [&>div]:focus-within:ring-4! [&>div]:focus-within:ring-primary-100!">
              <CustomSelect
                id="filter-descuento"
                label="Descuento"
                value={filtroDescuento}
                onChange={setFiltroDescuento}
                options={opcionesDescuento}
                hideLabel
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-3.5 lg:p-2.5"
          aria-label="Atajos de filtro"
        >
          <div className="flex items-center gap-2 mb-2 lg:mb-1.5">
            <SlidersHorizontal
              size={16}
              className="text-primary-600"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-gray-800">
              Atajos rapidos
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "todos", label: "Todos" },
              { key: "10", label: "10% OFF" },
              { key: "15", label: "15% OFF" },
              { key: "20", label: "20% OFF" },
            ].map((atajo) => {
              const activo = filtroDescuento === atajo.key;
              return (
                <button
                  key={atajo.key}
                  type="button"
                  onClick={() => setFiltroDescuento(atajo.key)}
                  className={`
                    h-9 lg:h-8 rounded-lg px-3 lg:px-2.5 text-sm lg:text-xs font-semibold transition-all
                    cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                    ${
                      activo
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }
                  `}
                  aria-pressed={activo}
                  aria-label={`Filtrar por ${atajo.label}`}
                >
                  {atajo.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 lg:mt-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-2.5">
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-4 text-sm">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 lg:px-2.5 lg:py-1.5 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Package
                    size={16}
                    className="text-gray-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-600 font-medium hidden sm:inline">
                    Total:
                  </span>
                </div>
                <span className="font-bold text-gray-900 text-base">
                  {stats.total}
                </span>
                <span className="text-xs text-gray-500 sm:hidden">Total</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 lg:px-2.5 lg:py-1.5 bg-primary-50 rounded-xl border border-primary-100"
              >
                <div className="flex items-center gap-1.5">
                  <TrendingUp
                    size={16}
                    className="text-primary-500 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-primary-700 font-medium hidden sm:inline">
                    Con oferta:
                  </span>
                </div>
                <span className="font-bold text-primary-700 text-base">
                  {stats.conOferta}
                </span>
                <span className="text-xs text-primary-600 sm:hidden">
                  Ofertas
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 lg:px-2.5 lg:py-1.5 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Filter
                    size={16}
                    className="text-gray-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-600 font-medium hidden sm:inline">
                    Sin oferta:
                  </span>
                </div>
                <span className="font-bold text-gray-700 text-base">
                  {stats.sinOferta}
                </span>
                <span className="text-xs text-gray-500 sm:hidden">
                  Sin oferta
                </span>
              </motion.div>
            </div>

            {hayFiltrosActivos && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={resetFiltros}
                className="
                  inline-flex items-center justify-center gap-2 h-11 sm:h-10
                  lg:h-9 px-5 lg:px-4 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300
                  text-gray-700 rounded-xl
                  text-sm lg:text-xs font-semibold shadow-sm
                  cursor-pointer
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
                "
                aria-label="Limpiar todos los filtros"
              >
                <RotateCcw size={16} aria-hidden="true" />
                <span>Limpiar filtros</span>
              </motion.button>
            )}
          </div>
        </div>

        {hayFiltrosActivos && (
          <div
            className="rounded-xl border border-primary-100 bg-primary-50/70 p-3.5 sm:p-4"
            aria-label="Filtros activos"
          >
            <p className="mb-2 text-sm font-semibold text-primary-900">
              Filtros activos
            </p>
            <div className="flex flex-wrap gap-2">
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold text-primary-800 hover:bg-primary-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Quitar filtro de busqueda"
                >
                  Busqueda: {busqueda}
                  <XCircle size={14} aria-hidden="true" />
                </button>
              )}

              {filtroCategoria !== "todas" && (
                <button
                  type="button"
                  onClick={() => setFiltroCategoria("todas")}
                  className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold text-primary-800 hover:bg-primary-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Quitar filtro de categoria"
                >
                  Categoria: {filtroCategoria}
                  <XCircle size={14} aria-hidden="true" />
                </button>
              )}

              {filtroDescuento !== "todos" && (
                <button
                  type="button"
                  onClick={() => setFiltroDescuento("todos")}
                  className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold text-primary-800 hover:bg-primary-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Quitar filtro de descuento"
                >
                  Descuento: {`${filtroDescuento}% OFF`}
                  <XCircle size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};
