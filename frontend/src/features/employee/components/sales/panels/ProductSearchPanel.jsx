import { Search, Package, X, Plus, Minus, AlertTriangle, FileText, Pill, ChevronRight } from "lucide-react";
import { formatMoneda } from "@features/employee/utils/ventas.utils";
import Default from "@assets/default.webp";

const getImg = (prod) => prod?.img || prod?.urlImagen || prod?.imagen || prod?.imagenPrincipal || Default;

const StockBadge = ({ stock }) => {
  let color;
  if (stock <= 0) color = "bg-red-100 text-red-700 border-red-200";
  else if (stock <= 3) color = "bg-red-50 text-red-600 border-red-200";
  else if (stock <= 10) color = "bg-amber-50 text-amber-700 border-amber-200";
  else color = "bg-green-50 text-green-700 border-green-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${stock <= 0 ? "bg-red-500" : stock <= 3 ? "bg-red-400" : stock <= 10 ? "bg-amber-400" : "bg-green-400"}`} />
      {stock <= 0 ? "Sin stock" : `${stock} ud.`}
    </span>
  );
};

const ProductSearchPanel = ({
  terminoBusqueda, setTerminoBusqueda, resultadosBusqueda, buscando,
  productoSeleccionado, cancelarSeleccion, cantidad, setCantidad,
  recetaPresentada, setRecetaPresentada, seleccionarProducto, agregarAlCarrito,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white flex flex-col min-h-0 flex-1">
    <div className="p-5 pb-0">
      <h2 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Search size={16} className="text-gray-400" /> Buscar producto
      </h2>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text" value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full h-11 pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        {buscando && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto min-h-0">
      {terminoBusqueda.length < 3 && !productoSeleccionado && (
        <div className="flex flex-col items-center justify-center h-full py-12 text-center px-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 mb-4">
            <Search size={26} className="text-green-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Buscar producto</p>
          <p className="mt-1 text-xs text-gray-400 max-w-xs">Escribí al menos 3 caracteres para buscar productos</p>
        </div>
      )}

      {resultadosBusqueda.length > 0 && (
        <div className="px-5 pt-3 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
            {resultadosBusqueda.length} resultado{resultadosBusqueda.length !== 1 ? "s" : ""}
          </p>
          <ul className="space-y-2">
            {resultadosBusqueda.map((prod) => (
              <li key={prod.idProducto}>
                <button type="button" onClick={() => seleccionarProducto(prod)}
                  className="w-full flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left transition-all hover:border-green-200 hover:shadow-sm hover:bg-green-50/40 cursor-pointer group">
                  <div className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img src={getImg(prod)} alt="" className="h-full w-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = Default; }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">{prod.nombreProducto}</p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <StockBadge stock={prod.stock} />
                      {(prod.requiereReceta === 1 || prod.requiereReceta === true) && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 border border-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          <FileText size={10} /> Receta
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-gray-900 tabular-nums">{formatMoneda(prod.precio)}</span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {terminoBusqueda.length >= 3 && !buscando && resultadosBusqueda.length === 0 && !productoSeleccionado && (
        <div className="flex flex-col items-center justify-center h-full py-12 text-center px-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <Package size={26} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Sin resultados</p>
          <p className="mt-1 text-xs text-gray-400 max-w-xs">No encontramos productos que coincidan con "{terminoBusqueda}"</p>
        </div>
      )}

      {productoSeleccionado && (
        <div className="p-5">
          <div className="rounded-xl border border-green-200 bg-gradient-to-b from-green-50/80 to-white p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 bg-white overflow-hidden flex items-center justify-center shadow-sm">
                  <img src={getImg(productoSeleccionado)} alt="" className="h-full w-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = Default; }} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate">{productoSeleccionado.nombreProducto}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Código: {productoSeleccionado.codigo || `#${productoSeleccionado.idProducto}`}</p>
                </div>
              </div>
              <button type="button" onClick={cancelarSeleccion}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors"
                aria-label="Cancelar selección">
                <X size={15} />
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex-1 rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Precio</p>
                <p className="mt-0.5 text-xl font-bold text-green-600 tabular-nums">{formatMoneda(productoSeleccionado.precio)}</p>
              </div>
              <div className="flex-1 rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Stock</p>
                <p className={`mt-0.5 text-xl font-bold tabular-nums ${productoSeleccionado.stock <= 5 ? "text-red-600" : "text-gray-800"}`}>{productoSeleccionado.stock}</p>
              </div>
            </div>

            {(productoSeleccionado.requiereReceta === 1 || productoSeleccionado.requiereReceta === true) && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <Pill size={16} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-800">Producto bajo receta</p>
                  <p className="text-[10px] text-amber-600">Verificá la receta física antes de entregar</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                  <input type="checkbox" checked={recetaPresentada} onChange={(e) => setRecetaPresentada(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer" />
                  <span className={`text-xs font-semibold ${recetaPresentada ? "text-green-600" : "text-amber-700"}`}>
                    {recetaPresentada ? "Verificada" : "Verificar"}
                  </span>
                </label>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                <button type="button" onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="flex h-11 w-10 items-center justify-center rounded-l-xl text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Minus size={14} />
                </button>
                <input type="number" min="1" max={productoSeleccionado.stock} value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  className="h-11 w-16 text-center text-sm font-semibold text-gray-800 border-x border-gray-200 outline-none" />
                <button type="button" onClick={() => setCantidad(Math.min(productoSeleccionado.stock, cantidad + 1))}
                  className="flex h-11 w-10 items-center justify-center rounded-r-xl text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <button type="button" onClick={agregarAlCarrito}
                disabled={productoSeleccionado.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:active:scale-100 transition-all cursor-pointer shadow-sm shadow-green-600/20">
                <Plus size={16} /> Agregar al ticket
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              Subtotal: <span className="font-semibold text-gray-700">{formatMoneda(productoSeleccionado.precio * cantidad)}</span>
              <span className="text-gray-300"> · </span>
              {cantidad} {cantidad === 1 ? "unidad" : "unidades"}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ProductSearchPanel;
