import { Search, Package, X, Plus, Minus, AlertTriangle, FileText } from "lucide-react";
import { formatMoneda } from "@features/employee/utils/ventas.utils";

const ProductSearchPanel = ({
  terminoBusqueda, setTerminoBusqueda, resultadosBusqueda, buscando,
  productoSeleccionado, cancelarSeleccion, cantidad, setCantidad,
  recetaPresentada, setRecetaPresentada, seleccionarProducto, agregarAlCarrito,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col min-h-0 flex-1">
    <h2 className="mb-4 text-sm font-semibold text-gray-700 flex items-center gap-2">
      <Search size={16} className="text-gray-400" /> Buscar producto
    </h2>

    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text" value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)}
        placeholder="Escribe al menos 3 caracteres..."
        className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
      />
      {buscando && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      )}
    </div>

    {terminoBusqueda.length < 3 && !productoSeleccionado && (
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
          <Search size={26} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700">Buscar producto</p>
        <p className="mt-1 text-xs text-gray-400 max-w-xs">Escribe el nombre del producto para agregarlo al ticket</p>
      </div>
    )}

    {resultadosBusqueda.length > 0 && (
      <div className="mt-3 flex-1 overflow-y-auto -mx-5 px-5">
        <ul className="space-y-1.5">
          {resultadosBusqueda.map((prod) => (
            <li key={prod.idProducto}>
              <button type="button" onClick={() => seleccionarProducto(prod)}
                className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3.5 text-left transition-all hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm cursor-pointer">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{prod.nombreProducto}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Stock: {prod.stock}
                    {prod.requiereReceta && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-amber-600 font-medium">
                        <FileText size={10} /> Receta
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-gray-900">{formatMoneda(prod.precio)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {terminoBusqueda.length >= 3 && !buscando && resultadosBusqueda.length === 0 && !productoSeleccionado && (
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
          <Package size={26} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700">Sin resultados</p>
        <p className="mt-1 text-xs text-gray-400">No se encontraron productos con "{terminoBusqueda}"</p>
      </div>
    )}

    {productoSeleccionado && (
      <div className="mt-3 -mx-5 px-5 flex-1 overflow-y-auto">
        <div className="rounded-xl border border-green-200 bg-gradient-to-b from-green-50/80 to-white p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900">{productoSeleccionado.nombreProducto}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Código: {productoSeleccionado.codigo || "#" + productoSeleccionado.idProducto}</p>
            </div>
            <button type="button" onClick={cancelarSeleccion}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors"
              aria-label="Cancelar selección">
              <X size={15} />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[120px] rounded-xl bg-white border border-gray-100 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Precio unitario</p>
              <p className="mt-0.5 text-lg font-bold text-green-600">{formatMoneda(productoSeleccionado.precio)}</p>
            </div>
            <div className="flex-1 min-w-[120px] rounded-xl bg-white border border-gray-100 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Stock disponible</p>
              <p className={`mt-0.5 text-lg font-bold ${productoSeleccionado.stock <= 5 ? "text-red-600" : "text-gray-800"}`}>{productoSeleccionado.stock}</p>
            </div>
          </div>

          {(productoSeleccionado.requiereReceta === 1 || productoSeleccionado.requiereReceta === true) && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle size={18} className="text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800">Producto bajo receta</p>
                <p className="text-[10px] text-amber-600">Requiere verificación de receta física</p>
              </div>
              <label className="ml-auto flex items-center gap-2 cursor-pointer select-none shrink-0">
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
                className="flex h-10 w-9 items-center justify-center rounded-l-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                <Minus size={14} />
              </button>
              <input type="number" min="1" max={productoSeleccionado.stock} value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                className="h-10 w-14 text-center text-sm font-semibold text-gray-800 border-x border-gray-200 outline-none" />
              <button type="button" onClick={() => setCantidad(Math.min(productoSeleccionado.stock, cantidad + 1))}
                className="flex h-10 w-9 items-center justify-center rounded-r-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                <Plus size={14} />
              </button>
            </div>

            <button type="button" onClick={agregarAlCarrito}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-green-600/20">
              <Plus size={16} /> Agregar al ticket
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            Subtotal: {formatMoneda(productoSeleccionado.precio * cantidad)} ({cantidad} {cantidad === 1 ? "unidad" : "unidades"})
          </p>
        </div>
      </div>
    )}
  </div>
);

export default ProductSearchPanel;
