import { useMemo, useState } from "react";
import {
  CheckSquare,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Square,
} from "lucide-react";
import { toast } from "react-toastify";
import CustomSelect from "../../employees/VentasModal/CustomSelect";
import Default from "@assets/default.webp";

export const ProductSearchVentasOnline = ({
  terminoBusqueda,
  setTerminoBusqueda,
  filtroCategoria,
  setFiltroCategoria,
  categorias = [],
  resultadosBusqueda,
  productosCategoria = [],
  productoSeleccionado,
  productosEnTicketIds = new Set(),
  onSeleccionarProducto,
  onAgregarAlCarrito,
  onToggleProductoTicket,
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [recetaPresentada, setRecetaPresentada] = useState(false);

  const getProductImage = (prod) => {
    return (
      prod.img ||
      prod.urlImagen ||
      prod.imagen ||
      prod.imagenPrincipal ||
      Default
    );
  };

  const categoriasPermitidas = useMemo(() => {
    return categorias.filter((cat) => {
      const catLower = cat.toLowerCase();
      return (
        !catLower.includes("cyber") &&
        !catLower.includes("black friday") &&
        !catLower.includes("oferta") &&
        !catLower.includes("descuento") &&
        !catLower.includes("promo")
      );
    });
  }, [categorias]);

  const opcionesCategoria = useMemo(() => {
    return [
      { value: "todas", label: "Todas las categorías" },
      ...categoriasPermitidas.map((cat) => ({ value: cat, label: cat })),
    ];
  }, [categoriasPermitidas]);

  const handleCantidadChange = (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return setCantidad(1);
    if (!productoSeleccionado) return setCantidad(Math.max(1, parsed));
    const max = Number(productoSeleccionado.stock || 1);
    setCantidad(Math.min(Math.max(1, parsed), max));
  };

  const handleAgregar = () => {
    if (!productoSeleccionado) return;

    const cantInt = parseInt(cantidad, 10);
    if (isNaN(cantInt) || cantInt <= 0) {
      return toast.warning("Ingresa una cantidad mayor a cero.");
    }
    if (cantInt > productoSeleccionado.stock) {
      return toast.warning(
        `Stock insuficiente. Solo quedan ${productoSeleccionado.stock} unidades.`,
      );
    }
    if (
      (productoSeleccionado.requiereReceta === 1 ||
        productoSeleccionado.requiereReceta === true) &&
      !recetaPresentada
    ) {
      return toast.warning(
        "⚠️ Requiere Receta. Verifica el documento físico marcando la casilla.",
      );
    }

    onAgregarAlCarrito({
      idProducto: productoSeleccionado.idProducto,
      nombreProducto: productoSeleccionado.nombreProducto,
      precioUnitario: productoSeleccionado.precio,
      cantidad: cantInt,
      imagenProducto: getProductImage(productoSeleccionado),
      stockDisponible: Number(productoSeleccionado.stock || 0),
      requiereReceta: productoSeleccionado.requiereReceta,
      recetaFisica: recetaPresentada ? "Presentada" : null,
    });

    setCantidad(1);
    setRecetaPresentada(false);
  };

  return (
    <div className="w-full lg:w-[45%] min-h-0 flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-gray-200 z-40 lg:z-10 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-white shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
          Búsqueda de Productos
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <label
              htmlFor="search-product-online"
              className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1"
            >
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search-product-online"
                type="search"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all hover:border-gray-300"
                placeholder="Nombre o código..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>

            {resultadosBusqueda.length > 0 && (
              <ul
                className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-50"
                role="listbox"
              >
                {resultadosBusqueda.map((prod) => (
                  <li
                    key={prod.idProducto}
                    role="option"
                    aria-selected="false"
                    tabIndex="0"
                    onClick={() => {
                      onSeleccionarProducto(prod);
                      setCantidad(1);
                      setRecetaPresentada(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSeleccionarProducto(prod);
                        setCantidad(1);
                        setRecetaPresentada(false);
                      }
                    }}
                    className="p-3 sm:p-4 hover:bg-green-50 cursor-pointer flex justify-between items-center gap-3 transition-colors focus-visible:bg-green-50 outline-none"
                  >
                    <div className="flex min-w-0 items-center gap-3 flex-1">
                      <div className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                        <img
                          src={getProductImage(prod)}
                          alt={prod.nombreProducto}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = Default;
                          }}
                        />
                      </div>

                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {prod.nombreProducto}
                        </p>
                        <p className="text-sm font-bold text-green-600 mt-0.5">
                          ${prod.precio}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                      Stock: {prod.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-full sm:w-2/5">
            <CustomSelect
              id="filter-category-online"
              label="Categoría"
              value={filtroCategoria}
              onChange={setFiltroCategoria}
              options={opcionesCategoria}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50/50 flex flex-col justify-center">
        {productoSeleccionado ? (
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 text-center max-w-sm mx-auto w-full animate-fadeIn">
            <div className="mb-4 h-32 w-full rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
              <img
                src={getProductImage(productoSeleccionado)}
                alt={productoSeleccionado.nombreProducto}
                className="h-full w-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = Default;
                }}
              />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-4 leading-tight">
              {productoSeleccionado.nombreProducto}
            </h3>

            <div className="flex justify-center gap-3 mb-6">
              <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100 flex-1">
                <p className="text-xs text-green-800 uppercase font-bold opacity-70 mb-0.5">
                  Precio
                </p>
                <p className="font-black text-green-700 text-lg">
                  ${productoSeleccionado.precio}
                </p>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 flex-1">
                <p className="text-xs text-gray-600 uppercase font-bold opacity-70 mb-0.5">
                  Stock
                </p>
                <p className="font-black text-gray-800 text-lg">
                  {productoSeleccionado.stock}
                </p>
              </div>
            </div>

            {(productoSeleccionado.requiereReceta === 1 ||
              productoSeleccionado.requiereReceta === true) && (
              <label className="mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start sm:items-center gap-3 cursor-pointer group transition-colors hover:bg-orange-100/50">
                <input
                  type="checkbox"
                  className="mt-0.5 sm:mt-0 w-5 h-5 text-orange-600 rounded border-orange-300 focus:ring-orange-500 cursor-pointer"
                  checked={recetaPresentada}
                  onChange={(e) => setRecetaPresentada(e.target.checked)}
                  aria-label="Confirmar receta física verificada"
                />
                <span className="text-orange-900 font-semibold text-sm text-left leading-tight group-hover:text-orange-950 select-none">
                  Receta Física Verificada
                </span>
              </label>
            )}

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider text-left">
                Cantidad
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCantidadChange(Number(cantidad) - 1)}
                  className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-green-500 outline-none text-gray-600 cursor-pointer"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={productoSeleccionado.stock}
                  className="h-12 flex-1 w-full text-center text-xl font-bold text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                  value={cantidad}
                  onChange={(e) => handleCantidadChange(e.target.value)}
                  aria-label="Cantidad a agregar"
                />
                <button
                  onClick={() => handleCantidadChange(Number(cantidad) + 1)}
                  className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-green-500 outline-none text-gray-600 cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAgregar}
              className="w-full py-3.5 sm:py-4 bg-green-600 text-white text-base sm:text-lg font-bold rounded-xl hover:bg-green-700 transition-all shadow-md shadow-green-600/20 active:scale-[0.98] outline-none focus-visible:ring-4 focus-visible:ring-green-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={20} aria-hidden="true" />
              Agregar al Ticket
            </button>
          </div>
        ) : filtroCategoria !== "todas" ? (
          <div className="flex h-full flex-col">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                Productos en {filtroCategoria}
              </p>
              <span className="rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
                {productosCategoria.length}
              </span>
            </div>

            {productosCategoria.length === 0 ? (
              <div className="flex-1 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500 flex items-center justify-center">
                No hay productos para esta categoría con el filtro actual.
              </div>
            ) : (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1"
                role="list"
              >
                {productosCategoria.map((prod) => {
                  const checked = productosEnTicketIds.has(prod.idProducto);

                  return (
                    <li
                      key={prod.idProducto}
                      className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-green-200"
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={(e) =>
                            onToggleProductoTicket?.(prod, e.target.checked)
                          }
                          aria-label={`Agregar ${prod.nombreProducto} al ticket`}
                        />
                        <span className="mt-0.5 shrink-0 text-green-600">
                          {checked ? (
                            <CheckSquare size={20} />
                          ) : (
                            <Square size={20} />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 h-20 w-full rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                              src={getProductImage(prod)}
                              alt={prod.nombreProducto}
                              className="h-full w-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = Default;
                              }}
                            />
                          </div>

                          <p
                            className="truncate text-sm font-bold text-gray-900"
                            title={prod.nombreProducto}
                          >
                            {prod.nombreProducto}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 truncate">
                            {prod.categoria}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-black text-green-700">
                              $
                              {new Intl.NumberFormat("es-AR").format(
                                Number(prod.precioFinal || prod.precio || 0),
                              )}
                            </p>
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600 border border-gray-200">
                              Stock: {prod.stock}
                            </span>
                          </div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-center flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={28} className="text-gray-300" aria-hidden="true" />
            </div>
            <p className="text-gray-500 font-medium">
              Busca y selecciona un producto
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Aparecerá aquí para configurar su cantidad.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
