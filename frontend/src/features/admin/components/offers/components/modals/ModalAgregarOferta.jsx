import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, CircleCheck, Circle, Tag, Calendar } from "lucide-react";
import Default from "@assets/default.webp";
import CustomSelect from "@features/admin/components/products/components/CustomSelect";
import { getProductoImageUrl } from "../table/utils";
import { DESCUENTOS_DISPONIBLES } from "../../utils/constants";

const DESCUENTOS = [10, 15, 20];

export const ModalAgregarOferta = ({
  isOpen,
  onClose,
  productos,
  categorias,
  estaEnCampana,
  onConfirm,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);
  const [porcentaje, setPorcentaje] = useState(10);
  const [modoCustom, setModoCustom] = useState(false);
  const [porcentajeCustom, setPorcentajeCustom] = useState("");
  const [conFechas, setConFechas] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const productosDisponibles = useMemo(() => {
    return productos.filter((producto) => {
      const enOferta =
        Boolean(producto.enOferta) && Number(producto.porcentajeDescuento) > 0;
      const bloqueado = enOferta || estaEnCampana(producto.idProducto);
      if (bloqueado) return false;
      const coincideBusqueda =
        !busqueda ||
        producto.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria =
        categoria === "todas" || producto.categoria === categoria;
      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, busqueda, categoria, estaEnCampana]);

  const opcionesCategoria = useMemo(
    () => [
      { value: "todas", label: "Todas las categorías" },
      ...categorias.map((cat) => ({ value: cat, label: cat })),
    ],
    [categorias],
  );

  const productoSeleccionado = useMemo(
    () =>
      productosDisponibles.find(
        (p) => p.idProducto === productoSeleccionadoId,
      ) || null,
    [productosDisponibles, productoSeleccionadoId],
  );

  const handleClose = () => {
    setBusqueda("");
    setCategoria("todas");
    setProductoSeleccionadoId(null);
    setPorcentaje(10);
    setModoCustom(false);
    setPorcentajeCustom("");
    setConFechas(false);
    setFechaInicio("");
    setFechaFin("");
    onClose();
  };

  const handleSubmit = () => {
    if (!productoSeleccionado) return;
    const descuentoFinal = modoCustom
      ? Number(porcentajeCustom)
      : porcentaje;
    if (descuentoFinal < 1 || descuentoFinal > 100) return;
    if (conFechas && (!fechaInicio || !fechaFin || new Date(fechaFin) <= new Date(fechaInicio))) return;
    onConfirm({
      producto: productoSeleccionado,
      porcentaje: descuentoFinal,
      fechas: conFechas ? { fechaInicio, fechaFin } : null,
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agregar-oferta-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shrink-0"
                aria-hidden="true"
              >
                <Tag size={15} />
              </span>
              <div>
                <h2
                  id="agregar-oferta-title"
                  className="text-base font-semibold text-gray-900 leading-none"
                >
                  Agregar en oferta
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Seleccioná el producto y el descuento a aplicar
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            <fieldset>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Descuento
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {DESCUENTOS_DISPONIBLES.map((value) => {
                  const active = !modoCustom && porcentaje === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setModoCustom(false);
                        setPorcentaje(value);
                      }}
                      className={`h-11 cursor-pointer rounded-xl text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
                        active
                          ? "border border-green-600 bg-green-50 text-green-700"
                          : "border border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                      }`}
                      aria-pressed={active}
                    >
                      {value}% OFF
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setModoCustom(!modoCustom)}
                  className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:border-green-400 hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {modoCustom ? "Usar descuento predefinido" : "Descuento personalizado"}
                </button>

                {modoCustom && (
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={porcentajeCustom}
                      onChange={(e) => setPorcentajeCustom(e.target.value)}
                      placeholder="Ingresá un porcentaje (1-100)"
                      className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-colors"
                      aria-label="Porcentaje de descuento personalizado"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                      %
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setConFechas(!conFechas)}
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:border-blue-400 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Calendar size={14} />
                {conFechas ? "Sin fechas de validez" : "Agregar fechas de validez"}
              </button>

              {conFechas && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Inicio
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Fin
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  {conFechas && fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio) && (
                    <p className="col-span-2 text-xs text-red-500">
                      La fecha de fin debe ser posterior al inicio
                    </p>
                  )}
                </div>
              )}
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full h-10 pl-8.5 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring focus:ring-green-500 transition-colors"
                  aria-label="Buscar producto para agregar en oferta"
                />
              </div>
              <CustomSelect
                id="categoria-oferta"
                label="Categoría"
                value={categoria}
                onChange={setCategoria}
                options={opcionesCategoria}
                hideLabel
              />
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500" aria-live="polite">
                {productosDisponibles.length} productos disponibles
              </p>

              {productosDisponibles.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">
                  No hay productos disponibles con esos filtros.
                </p>
              ) : (
                <div
                  className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-0.5 sm:grid-cols-2"
                  role="listbox"
                  aria-label="Productos disponibles"
                >
                  {productosDisponibles.map((producto) => {
                    const selected =
                      productoSeleccionadoId === producto.idProducto;
                    const imagen = getProductoImageUrl(producto);
                    return (
                      <button
                        key={producto.idProducto}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() =>
                          setProductoSeleccionadoId(producto.idProducto)
                        }
                        className={`cursor-pointer rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                          selected
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 bg-white hover:border-green-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {selected ? (
                            <CircleCheck
                              size={16}
                              className="text-green-600 shrink-0"
                              aria-hidden="true"
                            />
                          ) : (
                            <Circle
                              size={16}
                              className="text-gray-300 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <div className="h-9 w-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img
                              src={imagen}
                              alt=""
                              aria-hidden="true"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = Default;
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {producto.nombreProducto}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {producto.categoria} · Stock: {producto.stock}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-gray-100 shrink-0">
            {productoSeleccionado && (
              <p className="mr-auto text-xs text-gray-500 truncate max-w-[200px]">
                <span className="font-medium text-gray-700">
                  {productoSeleccionado.nombreProducto}
                </span>{" "}
                · {modoCustom ? (porcentajeCustom || "0") : porcentaje}% OFF
                {conFechas && fechaInicio && fechaFin && (
                  <span className="block text-[10px] text-gray-400">
                    {new Date(fechaInicio).toLocaleDateString("es-AR")} - {new Date(fechaFin).toLocaleDateString("es-AR")}
                  </span>
                )}
              </p>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="h-9 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !productoSeleccionado ||
                (modoCustom &&
                  (porcentajeCustom === "" ||
                    Number(porcentajeCustom) < 1 ||
                    Number(porcentajeCustom) > 100)) ||
                (conFechas &&
                  (!fechaInicio ||
                    !fechaFin ||
                    new Date(fechaFin) <= new Date(fechaInicio)))
              }
              className="h-9 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              aria-disabled={
                !productoSeleccionado ||
                (modoCustom &&
                  (porcentajeCustom === "" ||
                    Number(porcentajeCustom) < 1 ||
                    Number(porcentajeCustom) > 100)) ||
                (conFechas &&
                  (!fechaInicio ||
                    !fechaFin ||
                    new Date(fechaFin) <= new Date(fechaInicio)))
              }
            >
              Agregar en oferta
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

ModalAgregarOferta.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productos: PropTypes.arrayOf(PropTypes.object).isRequired,
  categorias: PropTypes.arrayOf(PropTypes.string),
  estaEnCampana: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ModalAgregarOferta.defaultProps = {
  categorias: [],
};
