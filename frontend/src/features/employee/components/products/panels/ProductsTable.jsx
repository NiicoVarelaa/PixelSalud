import { Edit, Archive, RotateCcw, ImageIcon, AlertCircle, Package, Tag, DollarSign, Layers } from "lucide-react";
import { formatMoneda, COLUMNS } from "../utils/productos.utils";
import ProductTableRow from "./ProductTableRow";

const ProductCard = ({ prod, modificarPermiso, onEdit, onToggle }) => {
  const activo = prod.activo === 1 || prod.activo === true;

  return (
    <article className={`rounded-xl border overflow-hidden ${!activo ? "border-red-100 bg-red-50/20" : "border-gray-100 bg-white"}`}>
      <div className="flex gap-3 p-4">
        <div className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
          {prod.img ? (
            <img src={prod.img} alt={prod.nombreProducto} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <ImageIcon size={22} className="text-gray-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{prod.nombreProducto}</p>
          <p className="mt-0.5 text-xs text-gray-500">{prod.categoria || "-"}</p>
          {(prod.requiereReceta === 1 || prod.requiereReceta === true) && (
            <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              Receta
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-gray-900 tabular-nums">{formatMoneda(prod.precioRegular || prod.precio)}</p>
          <p className={`text-xs font-semibold tabular-nums ${prod.stock <= 5 ? "text-red-500" : "text-gray-500"}`}>
            {prod.stock ?? 0} ud.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
        <div>
          {activo ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">Activo</span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Inactivo</span>
          )}
        </div>
        {modificarPermiso ? (
          <div className="flex gap-1.5">
            <button onClick={() => onEdit(prod)}
              className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 transition-colors cursor-pointer">
              <Edit size={12} /> Editar
            </button>
            <button onClick={() => onToggle(prod)}
              className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
              {activo ? <Archive size={12} /> : <RotateCcw size={12} />}
              {activo ? "Dar baja" : "Reactivar"}
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </div>
    </article>
  );
};

const ProductsTable = ({ productosPaginados, modificarPermiso, onEdit, onToggle }) => (
  <>
    <div className="space-y-2.5 lg:hidden">
      {productosPaginados.map((prod) => (
        <ProductCard key={prod.idProducto} prod={prod} modificarPermiso={modificarPermiso} onEdit={onEdit} onToggle={onToggle} />
      ))}
    </div>

    <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              {COLUMNS.map((col, i) => (
                <th key={col}
                  className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${
                    i === 0 ? "w-20" : ""
                  } ${i === COLUMNS.length - 1 ? "text-center" : i === 4 || i === 5 ? "text-center" : i === 3 ? "text-right" : "text-left"}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productosPaginados.map((prod) => (
              <ProductTableRow key={prod.idProducto} prod={prod} modificarPermiso={modificarPermiso} onEdit={onEdit} onToggle={onToggle} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default ProductsTable;
