import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Filter,
  Percent,
  Package,
  CircleCheck,
  Circle,
} from "lucide-react";
import Default from "@assets/default.webp";
import { getProductoImageUrl } from "../table/utils";

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

  const productoSeleccionado = useMemo(() => {
    return (
      productosDisponibles.find(
        (p) => p.idProducto === productoSeleccionadoId,
      ) || null
    );
  }, [productosDisponibles, productoSeleccionadoId]);

  const handleClose = () => {
    setBusqueda("");
    setCategoria("todas");
    setProductoSeleccionadoId(null);
    setPorcentaje(10);
    onClose();
  };

  const handleSubmit = () => {
    if (!productoSeleccionado) return;

    onConfirm({
      producto: productoSeleccionado,
      porcentaje,
    });

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agregar-oferta-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full sm:max-w-5xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-hidden"
        >
          <div className="sticky top-0 bg-linear-to-r from-primary-600 to-emerald-600 px-5 sm:px-6 py-4 text-white z-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="agregar-oferta-title" className="text-xl font-bold">
                  Agregar producto en oferta
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  Selecciona un producto y aplica 10%, 15% o 20% en un solo
                  paso.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-80px)]">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-3">
                <Percent className="w-4 h-4" />
                Descuento a aplicar
              </div>

              <div className="grid grid-cols-3 gap-2">
                {DESCUENTOS.map((value) => {
                  const active = porcentaje === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPorcentaje(value)}
                      className={`h-11 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                        active
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                      aria-pressed={active}
                    >
                      {value}% OFF
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                <Package className="w-4 h-4" />
                Seleccion de producto
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full h-11 pl-9 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none cursor-pointer"
                  >
                    <option value="todas">Todas las categorias</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 max-h-[360px] overflow-y-auto">
                <p className="text-xs text-gray-600 mb-3">
                  {productosDisponibles.length} productos disponibles
                </p>

                {productosDisponibles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No hay productos disponibles con esos filtros.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {productosDisponibles.map((producto) => {
                      const selected =
                        productoSeleccionadoId === producto.idProducto;
                      const imagen = getProductoImageUrl(producto);

                      return (
                        <button
                          key={producto.idProducto}
                          type="button"
                          onClick={() =>
                            setProductoSeleccionadoId(producto.idProducto)
                          }
                          className={`text-left border rounded-lg p-3 transition-all cursor-pointer ${
                            selected
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 bg-white hover:border-primary-300"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {selected ? (
                              <CircleCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                            )}

                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                              <img
                                src={imagen}
                                alt={producto.nombreProducto}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = Default;
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {producto.nombreProducto}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {producto.categoria}
                              </p>
                              <p className="text-xs text-gray-700 mt-1">
                                Stock: {producto.stock}
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

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="h-11 px-5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!productoSeleccionado}
                className="h-11 px-5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar en oferta
              </button>
            </div>
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
