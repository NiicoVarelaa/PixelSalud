import { Edit, Archive, RotateCcw, ImageIcon, AlertCircle } from "lucide-react";
import { formatMoneda } from "../utils/productos.utils";

const ProductTableRow = ({ prod, modificarPermiso, onEdit, onToggle }) => {
  const activo = prod.activo === 1 || prod.activo === true;
  const baseActionBtn = "p-2 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2";

  return (
    <tr className={`transition-colors hover:bg-gray-50/50 ${!activo ? "bg-red-50/20" : ""}`}>
      <td className="px-4 py-2.5">
        {prod.img ? (
          <img
            src={prod.img}
            alt={prod.nombreProducto}
            className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 border border-gray-100 shrink-0">
            <ImageIcon size={20} className="text-gray-300" />
          </div>
        )}
      </td>

      <td className="px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
            {prod.nombreProducto}
          </p>
          {(prod.requiereReceta === 1 || prod.requiereReceta === true) && (
            <span className="mt-0.5 inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              Receta
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-2.5">
        <span className="text-sm text-gray-600">{prod.categoria || "-"}</span>
      </td>

      <td className="px-4 py-2.5 text-right tabular-nums">
        <span className="text-sm font-bold text-gray-900">
          {formatMoneda(prod.precioRegular || prod.precio)}
        </span>
      </td>

      <td className="px-4 py-2.5 text-center tabular-nums">
        <span className="text-sm font-semibold text-gray-700">{prod.stock ?? 0}</span>
      </td>

      <td className="px-4 py-2.5 text-center">
        {activo ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
            Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
            <AlertCircle size={10} /> Inactivo
          </span>
        )}
      </td>

      <td className="px-4 py-2.5">
        {modificarPermiso ? (
          <div className="flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(prod)}
              className={`${baseActionBtn} bg-amber-100 text-amber-700 hover:bg-amber-200 focus-visible:ring-amber-500`}
              title="Editar"
              aria-label={`Editar ${prod.nombreProducto}`}
            >
              <Edit size={15} />
            </button>
            <button
              type="button"
              onClick={() => onToggle(prod)}
              className={`${baseActionBtn} bg-slate-100 text-slate-600 hover:bg-slate-200 focus-visible:ring-slate-500`}
              title={activo ? "Dar de baja" : "Reactivar"}
              aria-label={activo ? `Dar de baja ${prod.nombreProducto}` : `Reactivar ${prod.nombreProducto}`}
            >
              {activo ? <Archive size={15} /> : <RotateCcw size={15} />}
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
};

export default ProductTableRow;
